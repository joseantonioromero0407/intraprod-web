(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuClose = document.querySelector('[data-menu-close]');
  const mobileQuery = window.matchMedia('(max-width: 920px)');
  let focusBeforeMenu = null;

  const setHeaderState = () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 18);
    }
  };

  const setMenuState = (open, returnFocus = false) => {
    if (!menu || !menuToggle || !menuClose) return;

    const shouldOpen = Boolean(open && mobileQuery.matches);
    menu.classList.toggle('is-open', shouldOpen);
    menuClose.classList.toggle('is-open', shouldOpen);
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    menuToggle.setAttribute('aria-label', shouldOpen ? 'Cerrar menú' : 'Abrir menú');
    menu.setAttribute('aria-hidden', String(mobileQuery.matches && !shouldOpen));
    document.body.classList.toggle('menu-open', shouldOpen);

    if (shouldOpen) {
      focusBeforeMenu = document.activeElement;
      menu.querySelector('a[href]')?.focus({ preventScroll: true });
    } else if (returnFocus && focusBeforeMenu instanceof HTMLElement) {
      focusBeforeMenu.focus();
    }
  };

  const syncMenuMode = () => {
    if (!menu) return;
    if (mobileQuery.matches) {
      setMenuState(false);
    } else {
      menu.classList.remove('is-open');
      menuClose?.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Abrir menú');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.remove('menu-open');
    }
  };

  menuToggle?.addEventListener('click', () => {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true', true);
  });

  menuClose?.addEventListener('click', () => setMenuState(false, true));

  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!menu?.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuState(false, true);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  mobileQuery.addEventListener?.('change', syncMenuMode);
  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();
  syncMenuMode();

  const revealItems = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => observer.observe(item));
  }

  const catalog = document.querySelector('[data-catalog]');
  const catalogButton = catalog?.querySelector('[data-catalog-load]');
  const catalogViewer = catalog?.querySelector('[data-catalog-viewer]');
  const catalogStatus = document.querySelector('[data-catalog-status]');

  const publishConversionSignal = (type) => {
    document.dispatchEvent(new CustomEvent('intraprod:conversion', { detail: { type } }));
  };

  catalogButton?.addEventListener('click', () => {
    if (!catalog || !catalogViewer || catalog.dataset.loading === 'true' || catalog.dataset.loaded === 'true') return;

    const source = catalog.dataset.catalogSrc;
    if (!source) return;

    catalog.dataset.loading = 'true';
    catalog.classList.add('is-loading');
    catalogButton.disabled = true;
    catalogViewer.hidden = false;
    if (catalogStatus) catalogStatus.textContent = 'Cargando el catálogo interactivo…';

    const frame = document.createElement('iframe');
    frame.title = 'Catálogo interactivo de calefones ASTOM B';
    frame.allow = 'fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';

    const timeout = window.setTimeout(() => {
      if (catalog.dataset.loaded === 'true') return;
      frame.remove();
      catalogViewer.hidden = true;
      catalog.dataset.loading = 'false';
      catalog.classList.remove('is-loading');
      catalogButton.disabled = false;
      if (catalogStatus) catalogStatus.textContent = 'El visor tardó demasiado. Puedes intentarlo otra vez o abrir el catálogo en pantalla completa.';
    }, 60000);

    frame.addEventListener('load', () => {
      window.clearTimeout(timeout);
      catalog.dataset.loading = 'false';
      catalog.dataset.loaded = 'true';
      catalog.classList.remove('is-loading');
      catalog.classList.add('is-loaded');
      if (catalogStatus) catalogStatus.textContent = 'Catálogo interactivo cargado.';
    }, { once: true });

    frame.src = source;
    catalogViewer.append(frame);
    publishConversionSignal('catalog_open');
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="wa.me"]');
    if (link) publishConversionSignal('whatsapp_click');
  });
})();
