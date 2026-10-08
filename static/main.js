(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targetSelectors = [
    '.article-preview-image',
    '.team-banner',
    '.home-intro-visual > img',
    '.fma-intro-visual > img',
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
    const openingGlitch = document.createElement('span');
    const closeButton = document.createElement('button');

    lightbox.className = 'article-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded image preview');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.inert = true;

    stage.className = 'article-lightbox__stage';
    expandedImage.className = 'article-lightbox__image';
    openingGlitch.className = 'digital-glitch-overlay article-lightbox__opening-glitch';
    openingGlitch.setAttribute('aria-hidden', 'true');
    closeButton.className = 'article-lightbox__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close image preview');
    closeButton.textContent = '\u00d7';

    for (let fragmentIndex = 0; fragmentIndex < 6; fragmentIndex += 1) {
      const fragment = document.createElement('i');
      fragment.className = 'digital-glitch-fragment';
      openingGlitch.appendChild(fragment);
    }

    stage.append(expandedImage, openingGlitch);
    lightbox.append(stage, closeButton);
    document.body.appendChild(lightbox);

    let activeTrigger = null;
    let scrollPosition = 0;
    let bodyStyles = null;
    let cleanupTimer = null;
    let openingGlitchTimer = null;
    let openingGlitchRequest = 0;

    function fitExpandedImage() {
      const { naturalWidth, naturalHeight } = expandedImage;
      if (!naturalWidth || !naturalHeight) return;

      // Fit both axes, including upscaling small originals, without cropping.
      const scale = Math.min(stage.clientWidth / naturalWidth, stage.clientHeight / naturalHeight);
      const width = `${naturalWidth * scale}px`;
      const height = `${naturalHeight * scale}px`;
      expandedImage.style.width = width;
      expandedImage.style.height = height;
      openingGlitch.style.width = width;
      openingGlitch.style.height = height;
    }

    expandedImage.addEventListener('load', fitExpandedImage);
    const stageObserver = new ResizeObserver(() => {
      if (lightbox.classList.contains('is-open')) fitExpandedImage();
    });
    stageObserver.observe(stage);

    function stopOpeningGlitch() {
      if (openingGlitchTimer) {
        window.clearTimeout(openingGlitchTimer);
        openingGlitchTimer = null;
      }
      openingGlitch.classList.remove('is-corrupting');
    }

    function playOpeningGlitch() {
      stopOpeningGlitch();
      if (reducedMotion.matches) return;

      const imageWidth = expandedImage.clientWidth;
      const imageHeight = expandedImage.clientHeight;
      if (!imageWidth || !imageHeight) return;

      const duration = Math.round(randomBetween(480, 650));
      const activeCount = Math.round(randomBetween(3, 6));
      openingGlitch.style.width = `${imageWidth}px`;
      openingGlitch.style.height = `${imageHeight}px`;
      openingGlitch.style.setProperty('--glitch-duration', `${duration}ms`);
      Array.from(openingGlitch.children).forEach((fragment, index) => {
        configureFragment(fragment, index, activeCount, duration);
      });

      openingGlitch.classList.add('is-corrupting');
      openingGlitchTimer = window.setTimeout(() => {
        openingGlitch.classList.remove('is-corrupting');
        openingGlitchTimer = null;
      }, duration + 30);
    }

    function queueOpeningGlitch() {
      const request = ++openingGlitchRequest;
      expandedImage.decode().catch(() => {}).then(() => {
        window.requestAnimationFrame(() => {
          if (request !== openingGlitchRequest || !lightbox.classList.contains('is-open')) return;
          fitExpandedImage();
          playOpeningGlitch();
        });
      });
    }

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
        fitExpandedImage();
        lightbox.classList.add('is-open');
        closeButton.focus({ preventScroll: true });
        queueOpeningGlitch();
      });
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('is-open')) return;

      lightbox.classList.remove('is-open');
      openingGlitchRequest += 1;
      stopOpeningGlitch();
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
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) stopOpeningGlitch();
    });
  }

  /* Electrical text glitch */
  function initializeTextGlitches() {
    if (!Element.prototype.animate) return;

    const tierProfiles = {
      strong: { intensity: 1, idleMin: 12000, idleMax: 18000 },
      medium: { intensity: 0.8, idleMin: 16000, idleMax: 24000 },
      subtle: { intensity: 0.52, idleMin: 22000, idleMax: 35000 }
    };
    const targetTiers = new Map();
    const textTimers = new Set();
    const textAnimations = new Map();

    document.querySelectorAll('h3, .eyebrow, .card-label').forEach((target) => {
      targetTiers.set(target, 'subtle');
    });
    document.querySelectorAll('h2, .project-card h3, .fma-product-card h3').forEach((target) => {
      targetTiers.set(target, 'medium');
    });
    document.querySelectorAll('.site-title a, h1:not(.site-title)').forEach((target) => {
      targetTiers.set(target, 'strong');
    });

    const textTargets = Array.from(targetTiers, ([element, tier]) => ({ element, tier }));
    textTargets.forEach(({ element, tier }) => {
      element.classList.add('text-glitch-target', `text-glitch-target--${tier}`);
    });

    function clearTextActivity() {
      textTimers.forEach((timer) => window.clearTimeout(timer));
      textTimers.clear();
      textAnimations.forEach((animation, element) => {
        animation.cancel();
        element.classList.remove('is-text-glitching');
      });
      textAnimations.clear();
    }

    function eventDuration() {
      return Math.round(500 + ((Math.random() + Math.random()) / 2) * 1000);
    }

    function pulseCenters(count) {
      const centers = {
        2: [0.2, 0.7],
        3: [0.18, 0.46, 0.72],
        4: [0.15, 0.34, 0.54, 0.74]
      }[count];
      return centers.map((center) => center + randomBetween(-0.018, 0.018));
    }

    function glitchStyle(intensity, variant, displacementVariation = 1) {
      const displacement = Math.min(3, 2.15 * intensity * displacementVariation);
      const secondary = Math.max(0.45, displacement * 0.82);
      const glow = Math.max(1.5, 6.5 * intensity);
      const saturation = 1 + 0.18 * intensity;
      const shadows = [
        `-${displacement.toFixed(2)}px 0 #ff234f, ${secondary.toFixed(2)}px 0 #a855f7, 0 0 ${glow.toFixed(2)}px #55e7ff77`,
        `${displacement.toFixed(2)}px 0 #ff2bd6, -${secondary.toFixed(2)}px 0 #7c3aed, 0 0 ${glow.toFixed(2)}px #ff234f66`,
        `-${secondary.toFixed(2)}px 0 #ff234f, ${displacement.toFixed(2)}px 0 #ff2bd6, 0 0 ${glow.toFixed(2)}px #55e7ff66`
      ];
      return {
        textShadow: shadows[variant % shadows.length],
        filter: `saturate(${saturation.toFixed(3)})`
      };
    }

    function buildElectricalFrames(element, tier, duration, pulseCount) {
      const profile = tierProfiles[tier];
      const computed = window.getComputedStyle(element);
      const rest = { textShadow: computed.textShadow, filter: computed.filter };
      const centers = pulseCenters(pulseCount);
      const firstPulse = randomBetween(0.78, 0.9);
      const strongestPulse = Math.min(1.08, firstPulse * randomBetween(1.1, 1.25));
      const pulseStrengths = centers.map((unused, index) => {
        if (index === 0) return firstPulse;
        if (index === centers.length - 1) return strongestPulse;
        return randomBetween(0.72, 0.96);
      });
      const displacementVariation = randomBetween(0.92, 1.08);
      const frames = [
        { ...rest, offset: 0, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
        { ...glitchStyle(profile.intensity * 0.12, 0, displacementVariation), offset: 0.04 }
      ];

      centers.forEach((center, index) => {
        const pulse = pulseStrengths[index] * profile.intensity;
        const microSpan = Math.min(randomBetween(30, 80) / duration, 0.065);
        const prePulse = center - randomBetween(0.055, 0.075);
        const dip = center + microSpan + randomBetween(0.025, 0.045);

        frames.push(
          {
            ...glitchStyle(pulse * randomBetween(0.28, 0.4), index, displacementVariation),
            offset: prePulse,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
          },
          {
            ...glitchStyle(pulse, index, displacementVariation),
            offset: center,
            easing: 'steps(1, end)'
          },
          {
            ...glitchStyle(pulse * randomBetween(0.48, 0.64), index + 1, displacementVariation),
            offset: center + microSpan * 0.48,
            easing: 'steps(1, end)'
          },
          {
            ...glitchStyle(pulse * randomBetween(0.76, 0.9), index + 2, displacementVariation),
            offset: center + microSpan,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
          },
          {
            ...glitchStyle(pulse * randomBetween(0.12, 0.22), index + 1, displacementVariation),
            offset: dip
          }
        );
      });

      frames.push(
        { ...glitchStyle(profile.intensity * 0.18, 2, displacementVariation), offset: 0.88 },
        { ...glitchStyle(profile.intensity * 0.08, 0, displacementVariation), offset: 0.94 },
        { ...rest, offset: 1 }
      );
      return frames.sort((left, right) => left.offset - right.offset);
    }

    function scheduleTextTarget(target, initialDelay) {
      const profile = tierProfiles[target.tier];
      const delay = initialDelay ?? randomBetween(profile.idleMin, profile.idleMax);
      const timer = window.setTimeout(() => {
        textTimers.delete(timer);
        if (reducedMotion.matches || !target.element.isConnected) return;

        const duration = eventDuration();
        const pulseCount = Math.floor(randomBetween(2, 5));
        const frames = buildElectricalFrames(target.element, target.tier, duration, pulseCount);
        const animation = target.element.animate(frames, {
          duration,
          fill: 'none'
        });

        target.element.classList.add('is-text-glitching');
        textAnimations.set(target.element, animation);
        animation.onfinish = () => {
          target.element.classList.remove('is-text-glitching');
          textAnimations.delete(target.element);
          if (!reducedMotion.matches) scheduleTextTarget(target);
        };
      }, delay);
      textTimers.add(timer);
    }

    function startTextGlitches() {
      clearTextActivity();
      if (reducedMotion.matches) return;
      textTargets.forEach((target, index) => {
        const profile = tierProfiles[target.tier];
        const phase = randomBetween(1200, profile.idleMax * 0.72) + index * 37;
        scheduleTextTarget(target, phase);
      });
    }

    startTextGlitches();
    reducedMotion.addEventListener('change', startTextGlitches);
  }

  function initialize() {
    document.querySelectorAll(targetSelectors.join(',')).forEach(createTarget);
    start();
    reducedMotion.addEventListener('change', start);
    initializeArticleLightbox();
    initializeTextGlitches();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
