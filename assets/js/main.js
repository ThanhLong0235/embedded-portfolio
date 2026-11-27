(function () {
  const htmlEl = document.documentElement;
  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('btl_portfolio_lang') || 'vi';

  function setLanguage(lang) {
    htmlEl.setAttribute('data-lang', lang);
    htmlEl.setAttribute('lang', lang);
    localStorage.setItem('btl_portfolio_lang', lang);
    langBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.setLang === lang);
    });
  }

  setLanguage(savedLang);

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.setLang));
  });

  // Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
      galleryCards.forEach((card) => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox Modal for Images
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt, captionEl) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (lightboxCap) {
      lightboxCap.textContent = captionEl || alt || '';
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const lang = htmlEl.getAttribute('data-lang') || 'vi';
      const titleEl = item.querySelector(`.gallery-title [data-i18n="${lang}"]`) ||
                      item.querySelector(`[data-caption-${lang}]`);
      const descEl = item.querySelector(`.gallery-desc [data-i18n="${lang}"]`);
      let cap = img.alt;
      if (item.dataset[`caption_${lang}`]) {
        cap = item.dataset[`caption_${lang}`];
      } else if (titleEl && descEl) {
        cap = `${titleEl.textContent.trim()} — ${descEl.textContent.trim()}`;
      } else if (titleEl) {
        cap = titleEl.textContent.trim();
      }
      openLightbox(img.src, img.alt, cap);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Pause other videos when one starts playing
  const videos = document.querySelectorAll('video');
  videos.forEach((v) => {
    v.addEventListener('play', () => {
      videos.forEach((other) => {
        if (other !== v && !other.paused) other.pause();
      });
    });
  });

  // Copy Email Button
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'buithanhlong0235@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (!toast) return;
        const lang = htmlEl.getAttribute('data-lang') || 'vi';
        toast.textContent = lang === 'vi'
          ? 'Đã sao chép email: buithanhlong0235@gmail.com'
          : 'Copied email: buithanhlong0235@gmail.com';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
      });
    });
  }
})();
