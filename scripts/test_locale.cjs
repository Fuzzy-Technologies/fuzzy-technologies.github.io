/* Routing policy and browser/storage failure regressions, without network I/O. */
const test = require('node:test');
const assert = require('node:assert/strict');
const locale = require('../static/locale.js');

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

function browser(options = {}) {
  const url = new URL(options.path || '/', 'https://example.test');
  const events = new Map();
  const calls = { redirects: [], fetches: [], events };
  const local = storage(options.saved ? { 'ft.language.v1': options.saved } : {});
  const session = storage(options.visited ? { 'ft.language.visited.v1': '1' } : {});
  const win = {
    location: { href: url.href, origin: url.origin, replace: target => calls.redirects.push(target) },
    history: { state: null, replaceState: (_state, _title, href) => { win.location.href = href; } },
    navigator: { languages: options.languages || ['en-US'], language: options.language || 'en-US', userAgent: options.userAgent || 'Browser' },
    performance: { getEntriesByType: () => [{ type: options.navigation || 'navigate' }] },
    localStorage: local, sessionStorage: session,
    document: {
      readyState: 'complete', referrer: options.referrer || '',
      documentElement: { lang: options.pageLanguage || (url.pathname.startsWith('/ru/') ? 'ru' : url.pathname.startsWith('/zh-cn/') ? 'zh-CN' : 'en') },
      querySelectorAll: () => options.links || [],
      addEventListener: (name, fn) => events.set(name, fn),
      removeEventListener: name => events.delete(name)
    },
    AbortController, setTimeout, clearTimeout,
    fetch: async (href, config) => {
      calls.fetches.push({ href, config });
      return { ok: true, text: async () => 'ip=not-recorded\nloc=' + (options.country || 'US') + '\n' };
    }
  };
  if (options.blocked) for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(win, name, { get() { throw new Error('Storage denied'); } });
  return { win, calls };
}

test('supported browser languages follow preference order', () => {
  assert.equal(locale.browserLanguage(['de-DE', 'ru-RU', 'en-US']), 'ru');
  assert.equal(locale.browserLanguage(['en-US', 'zh-CN']), 'en');
  assert.equal(locale.browserLanguage(['zh-Hant-TW', 'en']), 'zh-CN');
  assert.equal(locale.browserLanguage(['fr', 'de']), null);
});

test('only neutral entry hubs can be redirected', () => {
  for (const path of ['/ru/', '/zh-cn/articles/', '/articles/example/', '/FMA/', '/TKSBrokerAPI/']) assert.equal(locale.destination('https://example.test' + path, 'ru'), null);
  assert.equal(locale.destination('https://example.test/articles/?q=a%20b#item', 'ru'), 'https://example.test/ru/articles/?q=a%20b#item');
  assert.equal(locale.destination('https://example.test/', 'zh-CN'), 'https://example.test/zh-cn/');
  assert.equal(locale.destination('https://example.test/', '//evil.test'), null);
});

for (const [language, expected] of [['ru-RU', '/ru/articles/'], ['zh-CN', '/zh-cn/articles/'], ['en-GB', null]]) {
  test('first catalogue entry uses ' + language, async () => {
    const { win, calls } = browser({ path: '/articles/?q=one#section', languages: [language] });
    await locale.start(win);
    assert.deepEqual(calls.redirects, expected ? ['https://example.test' + expected + '?q=one#section'] : []);
    assert.equal(calls.fetches.length, 0);
  });
}

test('saved manual English overrides Russian browser and country', async () => {
  const { win, calls } = browser({ saved: 'en', languages: ['ru'], country: 'RU' });
  await locale.start(win);
  assert.equal(calls.redirects.length, 0);
  assert.equal(calls.fetches.length, 0);
});

test('saved manual Russian overrides English browser', async () => {
  const { win, calls } = browser({ saved: 'ru', languages: ['en'], visited: true });
  await locale.start(win);
  assert.deepEqual(calls.redirects, ['https://example.test/ru/']);
});

for (const country of ['RU', 'BY', 'KZ', 'KG', 'UZ', 'TJ', 'TM', 'AM', 'AZ', 'MD', 'CN', 'DE', 'XX']) {
  test('country fallback is bounded to configured region: ' + country, async () => {
    const { win, calls } = browser({ languages: ['de-DE'], country });
    await locale.start(win);
    const expected = country === 'CN' ? '/zh-cn/' : ['DE', 'XX'].includes(country) ? null : '/ru/';
    assert.deepEqual(calls.redirects, expected ? ['https://example.test' + expected] : []);
    assert.equal(calls.fetches[0].config.credentials, 'omit');
    assert.equal(calls.fetches[0].config.referrerPolicy, 'no-referrer');
    assert.equal(win.localStorage.getItem('ip'), null);
  });
}

for (const options of [
  { path: '/ru/' }, { path: '/zh-cn/articles/' }, { path: '/articles/example/' },
  { path: '/FMA/' }, { referrer: 'https://example.test/FMA/' },
  { navigation: 'back_forward' }, { userAgent: 'Googlebot' }, { visited: true }
]) {
  test('explicit navigation remains stable: ' + JSON.stringify(options), async () => {
    const { win, calls } = browser({ languages: ['ru'], ...options });
    await locale.start(win);
    assert.equal(calls.redirects.length, 0);
    assert.equal(calls.fetches.length, 0);
  });
}

test('blocked storage still honors explicit English and keeps its marker', async () => {
  const { win, calls } = browser({ path: '/?lang=en&x=1#intro', languages: ['ru'], blocked: true });
  await locale.start(win);
  assert.equal(calls.redirects.length, 0);
  assert.equal(win.location.href, 'https://example.test/?lang=en&x=1#intro');
});

test('session choice wins when persistent storage becomes read-only', () => {
  const { win } = browser({ saved: 'ru' });
  win.localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  assert.equal(locale.savePreference(win, 'en'), true);
  assert.equal(locale.savedPreference(win), 'en');
});

test('explicit language is saved and control parameter removed without dropping query/hash', async () => {
  const { win, calls } = browser({ path: '/articles/?lang=ru&x=1#intro' });
  await locale.start(win);
  assert.equal(locale.savedPreference(win), 'ru');
  assert.deepEqual(calls.redirects, ['https://example.test/ru/articles/?x=1#intro']);
});

test('language-switch links carry choice into new tabs even without storage', async () => {
  const link = { href: '/?q=one#intro', getAttribute: () => 'en' };
  const { win } = browser({ path: '/ru/', links: [link] });
  await locale.start(win);
  assert.equal(link.href, 'https://example.test/?q=one&lang=en#intro');
});

test('geo error fails open without moving the page', async () => {
  const { win, calls } = browser({ languages: ['de'] });
  win.fetch = async () => { throw new Error('Offline'); };
  await locale.start(win);
  assert.equal(calls.redirects.length, 0);
});

test('geo request is aborted on timeout', async () => {
  const { win, calls } = browser({ languages: ['de'] });
  win.setTimeout = fn => setTimeout(fn, 5);
  win.fetch = (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('Aborted'))));
  await locale.start(win);
  assert.equal(calls.redirects.length, 0);
});

for (const event of ['pointerdown', 'keydown', 'wheel', 'touchstart']) test('late geo cannot interrupt ' + event, async () => {
  const { win, calls } = browser({ languages: ['de'] });
  let resolve;
  win.fetch = () => new Promise(done => { resolve = done; });
  const running = locale.start(win);
  calls.events.get(event)();
  resolve({ ok: true, text: async () => 'loc=RU\n' });
  await running;
  assert.equal(calls.redirects.length, 0);
});

test('late geo cannot override a new manual choice', async () => {
  const { win, calls } = browser({ languages: ['de'] });
  let resolve;
  win.fetch = () => new Promise(done => { resolve = done; });
  const running = locale.start(win);
  locale.savePreference(win, 'en');
  resolve({ ok: true, text: async () => 'loc=RU\n' });
  await running;
  assert.equal(calls.redirects.length, 0);
});
