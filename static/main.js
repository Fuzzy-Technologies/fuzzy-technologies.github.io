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

  function initialize() {
    document.querySelectorAll(targetSelectors.join(',')).forEach(createTarget);
    start();
    reducedMotion.addEventListener('change', start);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
