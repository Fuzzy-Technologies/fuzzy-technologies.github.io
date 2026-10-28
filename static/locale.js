/* First-entry language selection; explicit content URLs remain stable. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else api.start(root);
})(typeof window === 'object' ? window : null, function () {
  'use strict';

  const preferenceKey = 'ft.language.v1';
  const visitKey = 'ft.language.visited.v1';
  const russianCountries = new Set(['RU', 'BY', 'KZ', 'KG', 'UZ', 'TJ', 'TM', 'AM', 'AZ', 'MD']);

  function normalizeLanguage(value) {
    if (typeof value !== 'string') return null;
    const language = value.toLowerCase().split(/[-_]/)[0];
    return ['en', 'ru', 'zh'].includes(language) ? (language === 'zh' ? 'zh-CN' : language) : null;
  }

  function browserLanguage(languages) {
    for (const language of languages || []) {
      const supported = normalizeLanguage(language);
      if (supported) return supported;
    }
    return null;
  }

  function countryLanguage(country) {
    return russianCountries.has(country) ? 'ru' : country === 'CN' ? 'zh-CN' : 'en';
  }

  function entryPath(pathname) {
    if (['/', '/index.html'].includes(pathname)) return '/';
    if (['/articles', '/articles/', '/articles/index.html'].includes(pathname)) return '/articles/';
    return null;
  }

  function destination(href, language) {
    const url = new URL(href);
    const entry = entryPath(url.pathname);
    if (!entry || language === 'en') return null;
    const prefix = language === 'ru' ? '/ru' : language === 'zh-CN' ? '/zh-cn' : null;
    if (!prefix) return null;
    url.pathname = prefix + entry;
    return url.href;
  }

  function read(win, storageName, key) {
    try { return win[storageName].getItem(key); } catch (_) { return null; }
  }

  function write(win, storageName, key, value) {
    try {
      win[storageName].setItem(key, value);
      return win[storageName].getItem(key) === value;
    } catch (_) { return false; }
  }

  function savePreference(win, language) {
    const session = write(win, 'sessionStorage', preferenceKey, language);
    const persistent = write(win, 'localStorage', preferenceKey, language);
    return persistent || session;
  }

  function savedPreference(win) {
    for (const storage of ['sessionStorage', 'localStorage']) {
      const value = read(win, storage, preferenceKey);
      if (['en', 'ru', 'zh-CN'].includes(value)) return value;
    }
    return null;
  }

  function bindSwitcher(win) {
    win.document.querySelectorAll('.language-switch a[lang]').forEach(function (link) {
      const language = normalizeLanguage(link.getAttribute('lang'));
      const url = new URL(link.href, win.location.href);
      if (!language || url.origin !== win.location.origin) return;
      // A query marker also carries an explicit English choice into new tabs
      // and survives browsers that reject both local and session storage.
      url.searchParams.set('lang', language);
      link.href = url.href;
    });
    win.document.addEventListener('click', function (event) {
      const link = event.target.closest && event.target.closest('.language-switch a[lang]');
      if (!link || new URL(link.href, win.location.href).origin !== win.location.origin) return;
      const language = normalizeLanguage(link.getAttribute('lang'));
      if (language) savePreference(win, language);
    });
  }

  async function lookupCountry(win) {
    if (!win.fetch || !win.AbortController) return null;
    const controller = new win.AbortController();
    const timer = win.setTimeout(function () { controller.abort(); }, 1000);
    try {
      const response = await win.fetch('https://www.cloudflare.com/cdn-cgi/trace', {
        credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
        mode: 'cors', signal: controller.signal
      });
      if (!response.ok) return null;
      const match = (await response.text()).match(/^loc=([A-Z]{2})\s*$/m);
      return match ? match[1] : null;
    } catch (_) { return null; }
    finally { win.clearTimeout(timer); }
  }

  async function start(win) {
    if (!win || !win.document) return;
    if (win.document.readyState === 'loading') {
      win.document.addEventListener('DOMContentLoaded', function () { bindSwitcher(win); }, { once: true });
    } else bindSwitcher(win);

    const url = new URL(win.location.href);
    const entry = entryPath(url.pathname);
    const explicit = normalizeLanguage(url.searchParams.get('lang'));
    if (explicit) {
      const visible = normalizeLanguage(win.document.documentElement.lang);
      const chosen = entry ? explicit : visible || explicit;
      const persisted = savePreference(win, chosen);
      write(win, 'sessionStorage', visitKey, '1');
      if (persisted) {
        url.searchParams.delete('lang');
        try { win.history.replaceState(win.history.state, '', url.href); } catch (_) { /* Keep the explicit marker if history is restricted. */ }
      }
      const target = destination(url.href, chosen);
      if (target) win.location.replace(target);
      return;
    }

    const visited = read(win, 'sessionStorage', visitKey) === '1';
    write(win, 'sessionStorage', visitKey, '1');
    if (!entry) return;
    if (/\b(?:Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp)\b/i.test(win.navigator.userAgent || '')) return;
    const navigation = win.performance && win.performance.getEntriesByType('navigation')[0];
    if (navigation && navigation.type === 'back_forward') return;
    try {
      if (win.document.referrer && new URL(win.document.referrer).origin === url.origin) return;
    } catch (_) { /* An unreadable referrer does not establish an internal visit. */ }

    const saved = savedPreference(win);
    if (saved) {
      const target = destination(url.href, saved);
      if (target) win.location.replace(target);
      return;
    }
    if (visited) return;
    const preferred = browserLanguage(win.navigator.languages && win.navigator.languages.length ?
      win.navigator.languages : [win.navigator.language]);
    if (preferred) {
      const target = destination(url.href, preferred);
      if (target) win.location.replace(target);
      return;
    }

    // Geo is only a bounded fallback. Never move the page after user input
    // or navigation while the optional network request is in flight.
    let interacted = false;
    const cancel = function () { interacted = true; };
    win.document.addEventListener('pointerdown', cancel, { once: true, capture: true });
    win.document.addEventListener('keydown', cancel, { once: true, capture: true });
    const country = await lookupCountry(win);
    win.document.removeEventListener('pointerdown', cancel, true);
    win.document.removeEventListener('keydown', cancel, true);
    if (interacted || win.location.href !== url.href || savedPreference(win)) return;
    const target = destination(url.href, countryLanguage(country));
    if (target) win.location.replace(target);
  }

  return { normalizeLanguage, browserLanguage, countryLanguage, entryPath, destination,
    savePreference, savedPreference, lookupCountry, start };
});
