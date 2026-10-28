/* Exercise published HTML and real browser navigation, using deterministic geo responses. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const origin = new URL(process.env.SITE_TEST_ORIGIN || 'http://127.0.0.1:8765').origin;
const output = process.env.SITE_BROWSER_OUTPUT || '_browser-test-results';

(async function () {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  fs.mkdirSync(output, { recursive: true });

  async function setup(options = {}) {
    const context = await browser.newContext({ locale: options.locale || 'en-US', viewport: { width: options.width || 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    const geoRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route(/https:\/\/(?:mc\.yandex\.ru|fonts\.googleapis\.com|cdn\.jsdelivr\.net)\//, route => route.abort());
    await context.route('https://www.cloudflare.com/cdn-cgi/trace', async route => {
      geoRequests.push(route.request().url());
      if (options.geo === 'error') return route.abort();
      if (options.geo === 'timeout') return; // The page's AbortController must end this request.
      return route.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: options.geo === 'malformed' ? 'missing country' : 'loc=' + (options.country || 'US') + '\n' });
    });
    if (options.blocked) await context.addInitScript(() => {
      for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(window, key, { get() { throw new DOMException('Storage denied', 'SecurityError'); } });
    });
    if (options.saved) await context.addInitScript(value => localStorage.setItem('ft.language.v1', value), options.saved);
    return { context, page, errors, geoRequests };
  }

  async function check(name, options, route, expected) {
    const session = await setup(options);
    try {
      await session.page.goto(origin + route, { waitUntil: 'domcontentloaded' });
      await session.page.waitForURL(url => url.pathname === expected, { timeout: 10000 });
      // Allow the bounded fallback to finish before asserting an English result.
      if (options.geo || (options.locale || '').startsWith('de')) await session.page.waitForTimeout(1200);
      assert.equal(new URL(session.page.url()).pathname, expected, name);
      assert.deepEqual(session.errors, [], name + ': unexpected browser errors');
      if (options.noGeo) assert.equal(session.geoRequests.length, 0, name + ': geo must not override browser/manual language');
      if (options.query) {
        assert.equal(new URL(session.page.url()).search, '?q=a%20b');
        assert.equal(new URL(session.page.url()).hash, '#anchor');
      }
      const canonical = await session.page.locator('link[rel="canonical"]').getAttribute('href');
      assert.ok(canonical.endsWith(expected), name + ': canonical must match rendered locale');
      if (options.screenshot) {
        await session.page.locator('.site-header').screenshot({ path: path.join(output, name + '.png') });
      }
      results.push({ name, path: expected, status: 'passed' });
    } finally { await session.context.close(); }
  }

  for (const width of [1440, 390]) {
    for (const [language, prefix] of [['ru-RU', '/ru'], ['zh-CN', '/zh-cn'], ['en-US', '']]) {
      await check('home-' + language + '-' + width, { locale: language, width, noGeo: true, screenshot: true }, '/', prefix + '/');
      await check('catalogue-' + language + '-' + width, { locale: language, width, noGeo: true, query: true }, '/articles/?q=a%20b#anchor', prefix + '/articles/');
    }
  }
  for (const [country, prefix] of [['RU','/ru'], ['KZ','/ru'], ['CN','/zh-cn'], ['DE','']]) {
    await check('geo-' + country, { locale: 'de-DE', country }, '/articles/', prefix + '/articles/');
  }
  for (const geo of ['error', 'timeout', 'malformed']) await check('geo-' + geo, { locale: 'de-DE', geo }, '/', '/');
  await check('saved-English', { locale: 'ru-RU', saved: 'en', country: 'RU', noGeo: true }, '/', '/');
  await check('saved-Russian', { locale: 'en-US', saved: 'ru', noGeo: true }, '/articles/', '/ru/articles/');
  await check('explicit-Russian-URL', { locale: 'zh-CN', noGeo: true }, '/ru/', '/ru/');
  await check('explicit-Chinese-URL', { locale: 'ru-RU', noGeo: true }, '/zh-cn/articles/', '/zh-cn/articles/');
  await check('deep-English-article', { locale: 'ru-RU', noGeo: true }, '/articles/2025-04-10-fuzzy-scales/', '/articles/2025-04-10-fuzzy-scales/');
  await check('deep-product', { locale: 'ru-RU', noGeo: true }, '/FMA/', '/FMA/');

  for (const blocked of [false, true]) {
    const session = await setup({ locale: 'ru-RU', blocked });
    try {
      await session.page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
      await session.page.waitForURL(url => url.pathname === '/ru/');
      const english = session.page.locator('.language-switch a[lang="en"]');
      await english.waitFor();
      const href = await english.getAttribute('href');
      assert.equal(new URL(href, origin).searchParams.get('lang'), 'en');
      await english.click();
      await session.page.waitForURL(url => url.pathname === '/');
      await session.page.reload({ waitUntil: 'domcontentloaded' });
      assert.equal(new URL(session.page.url()).pathname, '/');
      const tab = await session.context.newPage();
      await tab.goto(href, { waitUntil: 'domcontentloaded' });
      assert.equal(new URL(tab.url()).pathname, '/');
      assert.deepEqual(session.errors, []);
      results.push({ name: 'manual-English-reload-new-tab-' + blocked, status: 'passed' });
    } finally { await session.context.close(); }
  }

  const session = await setup({ locale: 'ru-RU' });
  try {
    await session.page.goto(origin + '/FMA/', { waitUntil: 'domcontentloaded' });
    await session.page.locator('.hero-actions a[href="/articles/"]').click();
    await session.page.waitForURL(url => url.pathname === '/articles/');
    assert.equal(new URL(session.page.url()).pathname, '/articles/');
    assert.equal(session.geoRequests.length, 0);
    results.push({ name: 'internal-English-navigation', status: 'passed' });
  } finally { await session.context.close(); }

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const page = await noScript.newPage();
  await page.goto(origin + '/articles/', { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.ok((await page.locator('.language-switch a[lang="ru"]').getAttribute('href')).includes('/ru/articles/'));
  await noScript.close();
  results.push({ name: 'no-JavaScript-navigation', status: 'passed' });

  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ origin, browser: browser.version(), tests: results }, null, 2));
  console.log('PASS: ' + results.length + ' real-browser locale scenarios at ' + origin);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
