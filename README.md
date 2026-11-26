# Embedded Systems Portfolio — Bui Thanh Long

[![GitHub Profile](https://img.shields.io/badge/GitHub-ThanhLong0235-181717?style=flat-square&logo=github)](https://github.com/ThanhLong0235)
[![Email](https://img.shields.io/badge/Email-buithanhlong0235%40gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:buithanhlong0235@gmail.com)
[![Focus](https://img.shields.io/badge/Focus-Firmware%20%7C%20PCB%20Design%20%7C%20Industrial%20IoT-007ACC?style=flat-square)]()

Welcome to my **Embedded Systems Engineering Portfolio**. This repository showcases selected hardware and firmware projects covering microcontroller firmware development, real-time operating systems (RTOS), industrial communication protocols, analog/sensor front-ends, and custom PCB design.

---

## About Me

- **Role:** Embedded Hardware & Firmware R&D Engineer
- **Core Competencies:** Bare-metal & RTOS Firmware, Mixed-Signal Sensor Interfaces, Industrial Fieldbuses, IoT Connectivity, Schematic Capture & Multi-layer PCB Layout
- **Location:** Vietnam
- **Contact:** [buithanhlong0235@gmail.com](mailto:buithanhlong0235@gmail.com) | [GitHub @ThanhLong0235](https://github.com/ThanhLong0235)
<!-- [TODO: Add LinkedIn / CV PDF link here if desired] -->

---

## Technical Stack

| Category | Technologies & Tools |
| :--- | :--- |
| **Microcontrollers & SoCs** | `STM32` (F1/F4/G0/H7), `ESP32` / `ESP32-S3`, `AVR` / `PIC`, `nRF52` *(edit as needed)* |
| **Languages** | `C`, `C++`, `Python` (test automation & tooling), `Bash` |
| **RTOS & Frameworks** | `FreeRTOS`, `ESP-IDF`, `STM32Cube HAL / LL`, `CMSIS`, `Zephyr` *(optional)* |
| **Interfaces & Protocols** | `UART`, `RS-485 (Modbus RTU)`, `CAN / CANopen`, `I2C`, `SPI`, `ADC / 4–20mA`, `MQTT`, `BLE`, `Wi-Fi` |
| **Firmware IDEs & Build** | `STM32CubeIDE`, `Keil MDK-ARM`, `VS Code` + `ESP-IDF` / `PlatformIO`, `CMake`, `GCC ARM`, `Git` |
| **Hardware & EDA** | `Altium Designer`, `KiCad`, `LTspice` |
| **Lab & Debugging** | `ST-Link` / `J-Link`, Digital Oscilloscope, Logic Analyzer (`Saleae`), Multimeter, Power Profiler |

---

## Featured Projects Overview

> Click on any **Project Name** below to view full system architecture, hardware/board specifications, firmware design, schematics, and test results.

| # | Project | Summary | Target Board / MCU | Firmware & Software | Key Interfaces & Specs | Status |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: |
| **01** | [**Industrial Sensor & 4–20mA Node**](./projects/01-industrial-sensor-node/) | `[TODO: High-precision analog current-loop acquisition & Modbus RTU telemetry node]` | Custom PCB / `STM32G030` + `ADS1115` | `C`, `STM32CubeIDE` (HAL/LL), `Altium Designer` | `I2C`, `RS-485 Modbus RTU`, `16-bit ADC`, `4–20mA` | Production / Prototype |
| **02** | [**Wireless Industrial IoT Edge Gateway**](./projects/02-iot-edge-gateway/) | `[TODO: Multi-protocol gateway bridging fieldbus sensors to cloud MQTT broker with OTA]` | Custom Board / `ESP32-S3` | `C/C++`, `ESP-IDF`, `FreeRTOS`, `MQTT/TLS` | `Wi-Fi`, `BLE`, `RS-485`, `SPI Flash`, `OTA` | Prototype |
| **03** | [**Custom Embedded Controller & PCB**](./projects/03-custom-pcb-controller/) | `[TODO: Real-time actuator/motor control board with isolated I/O and fault protection]` | Custom 4-Layer PCB / `STM32F4` | `C`, `FreeRTOS`, `Keil MDK` / `CubeIDE`, `Altium` | `CAN`, `PWM`, `UART`, `Opto-isolated Digital I/O` | Completed |

---

## Detailed Project Highlights

### 1. [Industrial Sensor & 4–20mA Acquisition Node](./projects/01-industrial-sensor-node/)
- **Overview:** `[TODO: 2–3 sentences describing the problem solved, operating environment, and core value of the device.]`
- **Hardware / Board:** `[TODO: e.g., Custom 2-layer PCB designed in Altium Designer, STM32G030F6P6 MCU, ADS1115 16-bit delta-sigma ADC, TVS surge protection, isolated RS-485 transceiver, 24VDC industrial power input.]`
- **Software & Toolchain:** `STM32CubeIDE`, `STM32 HAL/LL`, bare-metal state machine / `FreeRTOS`, Python calibration script.
- **Key Highlights:**
  - `[TODO: e.g., Achieved < 0.1% full-scale measurement accuracy across 4–20mA span]`
  - `[TODO: e.g., Non-blocking DMA UART communication with hardware CRC-16 Modbus RTU]`
- **Details & Documentation:** [View Full Project →](./projects/01-industrial-sensor-node/)

---

### 2. [Wireless Industrial IoT Edge Gateway](./projects/02-iot-edge-gateway/)
- **Overview:** `[TODO: 2–3 sentences describing how data is collected from local nodes, buffered offline, and published securely to the cloud.]`
- **Hardware / Board:** `[TODO: e.g., Goouuu / Custom ESP32-S3 module carrier board, dual-core XTensa LX7, external antenna, RTC backup, RS-485 & CAN transceivers.]`
- **Software & Toolchain:** `ESP-IDF v5.x`, `FreeRTOS` multi-tasking architecture, `Altium Designer`, `Mosquitto / AWS IoT`.
- **Key Highlights:**
  - `[TODO: e.g., Deterministic FreeRTOS task partitioning between fieldbus polling and Wi-Fi/MQTT stack]`
  - `[TODO: e.g., Ring-buffer flash logging during network outages + secure HTTPS OTA firmware updates]`
- **Details & Documentation:** [View Full Project →](./projects/02-iot-edge-gateway/)

---

### 3. [Custom Embedded Controller & PCB](./projects/03-custom-pcb-controller/)
- **Overview:** `[TODO: 2–3 sentences summarizing real-time control, safety interlocks, or HMI integration.]`
- **Hardware / Board:** `[TODO: e.g., STM32F407VET6 custom control board, DC-DC buck stage, galvanic isolation, current sensing.]`
- **Software & Toolchain:** `Keil MDK-ARM` / `STM32CubeIDE`, `FreeRTOS`, `Altium Designer`, Logic Analyzer verification.
- **Key Highlights:**
  - `[TODO: e.g., Passed EMI/noise stress testing in industrial cabinet environment]`
  - `[TODO: e.g., Watchdog recovery & hardware fault protection under < 10 µs response time]`
- **Details & Documentation:** [View Full Project →](./projects/03-custom-pcb-controller/)

---

## Repository Structure

```text
embedded-portfolio/
├── README.md                         # Portfolio overview, tech stack & project matrix
├── templates/
│   └── PROJECT_TEMPLATE.md           # Standardized template for adding new projects
├── assets/                           # Shared portfolio banners, diagrams, or badges
└── projects/
    ├── 01-industrial-sensor-node/    # Project 01: Summary, board specs, firmware, media
    ├── 02-iot-edge-gateway/          # Project 02: Summary, board specs, firmware, media
    └── 03-custom-pcb-controller/     # Project 03: Summary, board specs, firmware, media
```

### How to Add a New Project
1. Duplicate [`templates/PROJECT_TEMPLATE.md`](./templates/PROJECT_TEMPLATE.md) into a new folder `projects/04-your-project-name/README.md`.
2. Place board renders, PCB photos, logic analyzer captures, or demo GIFs in `projects/04-your-project-name/media/`.
3. Place public schematics (PDF), BOM excerpts, or code snippets in `hardware/` and `firmware/` (keep proprietary company IP redacted if under NDA).
4. Add a new row to the **Featured Projects Overview** table above.

---

## Confidentiality & IP Notice

Some commercial R&D projects were developed for industrial clients or employers. Where applicable, proprietary source code and full manufacturing Gerbers are omitted or sanitized; architectural block diagrams, hardware specifications, design methodologies, and verified performance metrics are documented to demonstrate engineering work.

## License

Documentation and sample code snippets in this portfolio are released under the [MIT License](./LICENSE), unless stated otherwise in individual project folders.
