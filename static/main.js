(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targetSelectors = [
    '.article-preview-image',
    '.team-banner',
    '.home-intro-visual > img',
    '.fma-product-card .product-art',
    '.article-content img',
    '.table-clean img.fuzzy-avatar'
  ];
  const timingProfiles = [13700, 15100, 16900, 18400, 19700, 21300];
  const colors = ['#ff234f', '#ff2bd6', '#a855f7', '#7c3aed', '#55e7ff'];
  const timers = new Set();
  const targets = [];

  const randomBetween = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
  }

  function createTarget(image, index) {
    if (image.closest('.digital-media-frame')) return null;

    const frame = document.createElement('span');
    const surface = document.createElement('span');
    const overlay = document.createElement('span');

    frame.className = 'digital-media-frame';
    surface.className = 'digital-glitch-surface';
    overlay.className = 'digital-glitch-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    image.parentNode.insertBefore(frame, image);
    frame.appendChild(surface);
    surface.appendChild(image);
    surface.appendChild(overlay);

    for (let fragmentIndex = 0; fragmentIndex < 8; fragmentIndex += 1) {
      const fragment = document.createElement('i');
      fragment.className = 'digital-glitch-fragment';
      overlay.appendChild(fragment);
    }

    const target = {
      overlay,
      profile: timingProfiles[index % timingProfiles.length]
    };
    targets.push(target);
    return target;
  }

  function configureFragment(fragment, fragmentIndex, activeCount, duration) {
    const cyanAccent = fragmentIndex === activeCount - 1 && Math.random() < 0.28;
    const colorLimit = cyanAccent ? colors.length : colors.length - 1;
    const color = cyanAccent ? colors[colors.length - 1] : colors[Math.floor(Math.random() * colorLimit)];
    const width = randomBetween(8, 55);
    const left = randomBetween(0, 100 - width);
    const thickFragment = Math.random() < 0.16;
    const height = thickFragment ? randomBetween(5.5, 8) : randomBetween(1, 5);
    const delay = Math.round(randomBetween(0, Math.min(150, duration * 0.18)));

    fragment.hidden = fragmentIndex >= activeCount;
    if (fragment.hidden) return;

    fragment.style.setProperty('--fragment-x', `${left.toFixed(2)}%`);
    fragment.style.setProperty('--fragment-y', `${randomBetween(5, 94).toFixed(2)}%`);
    fragment.style.setProperty('--fragment-width', `${width.toFixed(2)}%`);
    fragment.style.setProperty('--fragment-height', `${height.toFixed(1)}px`);
    fragment.style.setProperty('--fragment-color', color);
    const alpha = randomBetween(0.48, 0.9);
    fragment.style.setProperty('--fragment-alpha-faint', (alpha * 0.22).toFixed(2));
    fragment.style.setProperty('--fragment-alpha-low', (alpha * 0.34).toFixed(2));
    fragment.style.setProperty('--fragment-alpha-peak', alpha.toFixed(2));
    fragment.style.setProperty('--fragment-alpha-fall', (alpha * 0.82).toFixed(2));
    fragment.style.setProperty('--fragment-shift-a', `${Math.round(randomBetween(-6, 6))}px`);
    fragment.style.setProperty('--fragment-shift-b', `${Math.round(randomBetween(-4, 4))}px`);
    fragment.style.setProperty('--fragment-delay', `${delay}ms`);
    fragment.style.setProperty('--fragment-duration', `${duration - delay}ms`);
  }

  function trigger(target) {
    if (reducedMotion.matches) return;

    const duration = Math.round(randomBetween(560, 860));
    const fragments = target.overlay.children;
    const activeCount = Math.round(randomBetween(3, 8));

    target.overlay.style.setProperty('--glitch-duration', `${duration}ms`);
    Array.from(fragments).forEach((fragment, index) => {
      configureFragment(fragment, index, activeCount, duration);
    });

    target.overlay.classList.add('is-corrupting');
    const finishTimer = window.setTimeout(() => {
      target.overlay.classList.remove('is-corrupting');
      timers.delete(finishTimer);
    }, duration + 30);
    timers.add(finishTimer);
  }

  function schedule(target, initialDelay) {
    const wait = initialDelay ?? Math.round(target.profile * randomBetween(0.92, 1.08));
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      trigger(target);
      schedule(target);
    }, wait);
    timers.add(timer);
  }

  function start() {
    clearTimers();
    targets.forEach((target) => target.overlay.classList.remove('is-corrupting'));
    if (reducedMotion.matches) return;

    targets.forEach((target, index) => {
      const phase = 1800 + ((index * 2900) % 9700);
      schedule(target, phase);
    });
  }

  /* Article image lightbox */
  function initializeArticleLightbox() {
    const images = Array.from(document.querySelectorAll('.article-content img'))
      .filter((image) => !image.closest('a'));
    if (!images.length) return;

    const lightbox = document.createElement('div');
    const stage = document.createElement('div');
    const expandedImage = document.createElement('img');
    const closeButton = document.createElement('button');

    lightbox.className = 'article-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded image preview');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.inert = true;

    stage.className = 'article-lightbox__stage';
    expandedImage.className = 'article-lightbox__image';
    closeButton.className = 'article-lightbox__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close image preview');
    closeButton.textContent = '\u00d7';

    stage.appendChild(expandedImage);
    lightbox.append(stage, closeButton);
    document.body.appendChild(lightbox);

    let activeTrigger = null;
    let scrollPosition = 0;
    let bodyStyles = null;
    let cleanupTimer = null;

    function lockScroll() {
      const body = document.body;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      scrollPosition = window.scrollY;
      bodyStyles = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        paddingRight: body.style.paddingRight
      };

      body.style.position = 'fixed';
      body.style.top = `-${scrollPosition}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      if (scrollbarWidth > 0) body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      document.documentElement.classList.add('article-lightbox-open');
    }

    function unlockScroll() {
      if (!bodyStyles) return scrollPosition;
      const body = document.body;
      const restorePosition = scrollPosition;

      Object.entries(bodyStyles).forEach(([property, value]) => {
        body.style[property] = value;
      });
      document.documentElement.classList.remove('article-lightbox-open');
      bodyStyles = null;
      return restorePosition;
    }

    function openLightbox(image, trigger) {
      if (cleanupTimer) {
        window.clearTimeout(cleanupTimer);
        cleanupTimer = null;
      }

      activeTrigger = trigger;
      expandedImage.src = image.currentSrc || image.src;
      expandedImage.alt = image.alt || '';
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.inert = false;
      lockScroll();

      window.requestAnimationFrame(() => {
        lightbox.classList.add('is-open');
        closeButton.focus({ preventScroll: true });
      });
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('is-open')) return;

      lightbox.classList.remove('is-open');
      const restorePosition = unlockScroll();
      const trigger = activeTrigger;
      activeTrigger = null;
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.inert = true;

      window.requestAnimationFrame(() => {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, restorePosition);
        root.style.scrollBehavior = previousScrollBehavior;
        if (trigger) trigger.focus({ preventScroll: true });
      });

      cleanupTimer = window.setTimeout(() => {
        expandedImage.removeAttribute('src');
        expandedImage.alt = '';
        cleanupTimer = null;
      }, 240);
    }

    images.forEach((image) => {
      const trigger = image.closest('.digital-media-frame') || image;
      trigger.classList.add('article-lightbox-trigger');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-label', image.alt ? `Open image preview: ${image.alt}` : 'Open image preview');

      trigger.addEventListener('click', () => openLightbox(image, trigger));
      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openLightbox(image, trigger);
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target === stage) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        closeButton.focus({ preventScroll: true });
      }
    });
  }

  function initialize() {
    document.querySelectorAll(targetSelectors.join(',')).forEach(createTarget);
    start();
    reducedMotion.addEventListener('change', start);
    initializeArticleLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
