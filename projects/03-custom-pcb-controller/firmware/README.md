# Firmware Architecture & Protocol Specification — Percussion Welder Controller (Rev V3)

> Architectural specification of the dual-MCU firmware running on `STM32G431CBT6` and `ESP32-WROOM-32U`. *(Proprietary C/C++ source files are omitted; state machines, timing models, and inter-MCU communication protocols are documented below.)*

---

## 1. Dual-MCU Functional Partitioning

Splitting the firmware across two specialized microcontrollers guarantees that **zero-jitter microsecond control** on the welding head is completely insulated from variable-latency tasks such as HMI screen redraws, Modbus RTU timeouts, or USB flash sector writes:

| Responsibility | `STM32G431CBT6` (170 MHz) | `ESP32-WROOM-32U` (240 MHz Dual-Core) |
| :--- | :--- | :--- |
| **Primary Role** | Hard real-time ignition, `200 kSPS` waveform digitization, PLC handshaking | Recipe management, HV PSU closed-loop control, capacitor relay bank, HMI, USB CSV logging |
| **Execution Paradigm** | Bare-metal deterministic loop + prioritized `DMA` / `EXTI` / `TIM` interrupts | `FreeRTOS` multi-tasking pinned across Core 1 (SPI DMA) and Core 0 (App/UI/IO) |
| **Critical Timing** | `1 µs` timer resolution (`TIM1/TIM8/TIM17`), `5 µs` ADC sample period (`TIM7`) | `2–10 ms` RTOS task ticks (`HMI: 5 ms`, `Program: 2 ms`, `Power: 5 ms`, `USB: 10 ms`) |

---

## 2. High-Speed Waveform Acquisition & Quality Judgment (`STM32G431`)

### 2.1 Phase-Locked Circular DMA Capture
1. **Continuous Background Sampling:** `TIM7` generates a hardware update trigger (`TRGO`) every **`5 µs`** (`200 kSPS`), driving `ADC2` (12-bit, `2.5` ADC clock cycles sampling time) into a `1,000-sample` (`5 ms`) circular DMA buffer (`dma_buffer`) with DMA interrupts initially masked so CPU overhead is **0%** during idle charging.
2. **Workpiece Contact Synchronization (`EXTI0`):** When `PLC_TRIGGER` is asserted, `CHARGE` opens and `DISCHARGE_P` closes to arm the electrode. Physical contact between the wire electrode and workpiece pulls `TOUCH` low, firing `EXTI0` immediately:
   - Marks acquisition active and unmasks DMA Transfer-Complete (`TC`).
   - On the aligned boundary, enables Half-Transfer (`HT`), waits exactly `1` sample period (`5 µs`), starts the hardware cutoff timer `TIM8` (`ARR = T_CutOff - 1` at `1 MHz` tick), and closes `DISCHARGE_N` to ignite the weld arc.
   - Copies both `500-sample` halves seamlessly into the evaluation buffer, then masks DMA interrupts and flags `discharge_done`.
3. **Hardware Arc Cutoff (`TIM8` ISR):** When `TIM8` reaches `T_CutOff` (`100–5,000 µs`), the ISR immediately opens `DISCHARGE_N` and halts the timer, bounding maximum arc energy in hardware-timed microseconds.

### 2.2 Voltage Calibration & `PASS` / `REJECT` Criteria
Raw 12-bit ADC samples are converted into calibrated `0.1 V` (`100 mV`) units using:
1. **Non-Linear Droop Compensation:** Compensates RC divider / discharge dynamics across sample index $i \in [0, N-1]$ as a function of target voltage $V_0$ and active capacitance $C_{\mu\text{F}}$, including an additional boost factor for low-capacitance banks ($C < 50\ \mu\text{F}$).
2. **16-Point Piecewise-Linear Lookup:** Interpolates between factory-characterized calibration points spanning `0 V` to `150 V` in `10 V` steps.
3. **Dual-Window Quality Check:**
   - **Peak Ignition Voltage (`V0_dis`):** Verified against `V0_LSL <= V0_dis <= V0_USL`.
   - **Effective Arc Time (`t(a)`):** Computed as $t_{\text{dis}} = (i_{V_1} + 1) \times 5\ \mu\text{s}$, where $i_{V_1}$ is the sample index at which capacitor voltage decays to the configured threshold `V1` (`V`), verified against `t(a)_LSL <= t(a) <= t(a)_USL`.
   - A weld is classified **`GOOD` (`PASS`)** if and only if both voltage and arc-time windows pass; otherwise **`REJECT` (`FAIL`)** is asserted on the `24 V` PLC interface (`100 ms` pulse) and pushed to the HMI.

---

## 3. Framed Inter-MCU `SPI + DMA` Protocol

`STM32G431` acts as **SPI1 Master** (`Mode 0`, DMA TX/RX, 4-byte aligned transfer length) and `ESP32` acts as **HSPI DMA Slave** (`1,024-byte` DMA buffers). Every transaction uses a deterministic binary frame with a 3-byte `0xFF 0xFF 0xFF` end-of-frame trailer:

```text
+---------------+-------------------+------------------+-------------------------+--------------------+
| Header (1 B)  | Length High (1 B) | Length Low (1 B) | Payload (0 .. 968 B)    | Trailer (3 B)      |
| Command Macro | Big-Endian Frame Length (N)          | Big-Endian / u16 Array  | 0xFF  0xFF  0xFF   |
+---------------+-------------------+------------------+-------------------------+--------------------+
```

| Direction | Command Macro | Payload Size | Description |
| :--- | :--- | :--- | :--- |
| `STM32 ↔ ESP32` | `spiSTM32_Init` / `Init_OK` | `0 B` (`N = 3`) | Boot/link watchdog handshake (`5 s` timeout auto-resync) |
| `ESP32 → STM32` | `spiInit_Param_TOTAL` | `22 B` (`N = 25`) | Full 11-parameter recipe sync (`Vset`, `V1`, `us/div`, `T_Trigger`, `T_CutOff`, `PwrEn`, `V_USL/LSL`, `t_USL/LSL`, `Cap`) |
| `ESP32 → STM32` | `spiVset` .. `spi_CAP` | `2 B` (`N = 5`) | Incremental single-parameter update when operator edits HMI settings |
| `STM32 → ESP32` | `spiVCAP_F` | `2 B` (`N = 5`) | Periodic `500 ms` live capacitor voltage telemetry (`0.1 V` unit) |
| `STM32 → ESP32` | `spiData_Discharge_TOTAL` | `968 B` (`N = 971`) | Complete post-weld burst: `480 × uint16` waveform + `V0_dis` + `t_dis` + `quality.V` + `quality.T` |
| `Bidirectional` | `EMERGENCY` / `PLC_ERROR` / `RESET` | `0 B` (`N = 3`) | Safety interlock propagation between PLC terminals and HMI error screens |

---

## 4. Closed-Loop HV Power Supply & USB Traceability (`ESP32`)

- **Modbus RTU HV Supply Synchronization (`POWER_Task`):** Continuously polls holding registers (`Func 0x03`, `8` words @ `0x0000`) over RS-485 (`2400 bps, 8N1`) with `CRC-16` validation to read actual output voltage, output current, CC/CV status, and model range. Whenever any parameter (`V_Set + V_Calib`, `I_MAX`, `Output Enable`, `OCP`, `Key Lock`) diverges from the target recipe, the state machine automatically issues a `Write Multiple Registers` (`Func 0x10`) command and verifies read-back convergence before clearing the sync flag.
- **Chunked FAT32 CSV Waveform Logging (`USB_Task`):** Appends every weld event to `DATA_LOG.CSV` via the `CH376S` SPI controller (`8 MHz`). On file open, seeks to the final `3 KB` of `DATA_LOG.CSV` to recover the last weld sequence ID in $O(1)$ time regardless of file size, then streams the `480` voltage samples (`0` to `2,395 µs` in `5 µs` columns) in `255-byte` FIFO-safe chunks.

[← Back to Project 03 Overview](../README.md)
