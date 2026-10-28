# First-entry language selection

The homepage (`/`) and article catalogue (`/articles/`) select a preferred
locale on the first external visit in a tab session. They retain separate,
stable English, Russian and Simplified Chinese URLs. This feature does not
replace or change the public translation policy.

Selection order:

1. An explicit language-switch query marker (`lang=en`, `ru`, or `zh-CN`).
2. A saved manual language choice (session storage, then persistent storage).
3. The first supported language in the browser's ordered preferences.
4. A bounded country-by-IP fallback: RU, BY, KZ, KG, UZ, TJ, TM, AM, AZ and MD
   select Russian; CN selects Simplified Chinese; other/unknown countries
   select English. This is a configured language-routing list, not a statement
   about political membership or users' nationality.
5. English when detection is unavailable or fails.

Direct localized URLs, individual articles, product pages, internal navigation,
history back/forward traversal and recognized search crawlers retain their
requested URL. The script never constructs an unverified article translation
URL, redirects to a translation placeholder, or sends a permanent redirect.
Queries and fragments survive automatic entry-page navigation.

The existing language switcher remembers manual choices, including English.
Its links carry an explicit query marker for new tabs and blocked-storage
browsers. The marker is removed when the preference can be stored; otherwise
it remains in the URL to make reloads stable. Automatic detection is not saved
as a permanent manual preference. With JavaScript disabled, the original page
and language-switch links remain usable.

Country lookup is an optional, fail-open request to Cloudflare's HTTPS
`https://www.cloudflare.com/cdn-cgi/trace` diagnostic endpoint. It is made only
when there is no manual choice or supported browser language. It omits
credentials and the referrer, accepts only the two-letter `loc` value, aborts
after one second, and stores neither the response nor the visitor's IP address.
Failure, blocking, malformed data and service changes leave English available.
User interaction cancels a pending automatic move. No browser GPS permission,
Cloudflare account changes, API key or additional hosted website is required.

## Validation

```sh
node --test scripts/test_locale.cjs
SITE_TEST_ORIGIN=http://127.0.0.1:8765 node scripts/test_site_browser.cjs
```

CI builds both configured origins, runs the deterministic policy tests, and
checks the production-origin build in Chromium. The browser dependency is
pinned to Playwright 1.62.1. Browser tests stub country responses and failures;
they never depend on the test runner's actual geographical location.

References:

- [HTML language preferences](https://html.spec.whatwg.org/dev/system-state.html#language-preferences)
- [Google multilingual site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Cloudflare diagnostic endpoints](https://developers.cloudflare.com/fundamentals/reference/cdn-cgi-endpoint/)
