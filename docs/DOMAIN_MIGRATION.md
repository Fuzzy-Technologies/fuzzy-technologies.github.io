# Domain-independent website navigation

Public navigation and assets use paths on the current origin: `/FMA/`, `/ru/FMA/`, `/articles/`, `/F-Layer/en/`, and `/static/...`. Do not write absolute company `github.io` URLs into published pages, templates, image metadata, scripts, or CSS. External services and source-code links remain explicit external URLs.

Canonical, alternate-language and social-image URLs must be absolute. The shared layouts generate them with Jekyll's `absolute_url` filter. `_config.yml` leaves `url: null` so the GitHub Pages metadata plugin supplies the configured site origin, including its custom domain. It must not be pinned to the former Pages hostname. A build hosted outside GitHub Pages must supply its public `url` in a configuration override.

The CI matrix builds both the normal Pages configuration and a simulated `https://www.example.test` origin. It verifies all rendered HTML references, local files, anchor fragments, canonical/alternate metadata, social-image metadata, runtime assets, FMA redirects and article navigation. The simulated domain is a test fixture and is never published.

## Organization project sites

GitHub Pages normally makes public project sites available below the organization site's custom domain, unless a project has its own custom domain. See [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

The root site's links to these separately built resources use the same current-origin paths. The deterministic checker registers their exact routes rather than treating missing local files as valid by prefix. Their destinations were checked over HTTP during this audit; network availability is not part of the deterministic PR gate.

| Resource | Paths used by this website | Source of deployed content |
| -------- | -------------------------- | -------------------------- |
| 1337 | `/1337/`, `/1337/zh-cn/` | [1337](https://github.com/Fuzzy-Technologies/1337) |
| F-Layer | `/F-Layer/en/`, `/F-Layer/ru/`, `/F-Layer/zh-CN/` | [F-Layer](https://github.com/Fuzzy-Technologies/F-Layer) |
| TKSBrokerAPI API | `/TKSBrokerAPI/docs/tksbrokerapi/TKSBrokerAPI.html`, `/TKSBrokerAPI/docs/tksbrokerapi/TradeRoutines.html` | [TKSBrokerAPI](https://github.com/Fuzzy-Technologies/TKSBrokerAPI) |

The former personal-account TKSBrokerAPI documentation URL returned 404; the organization paths returned 200 and replace it in both product-page languages.

## Remaining deployment work

This change prepares the root website; it does not configure a domain or DNS. Before the actual move, configure the organization site's custom domain and HTTPS in GitHub Pages and verify its project mounts.

The neighboring repositories have their own build inputs. The audit found absolute Pages URLs in [FuzzyRoutines' MkDocs navigation and site URL](https://github.com/Fuzzy-Technologies/FuzzyRoutines/blob/master/docs/site/mkdocs.yml), [1337's API language selector](https://github.com/Fuzzy-Technologies/1337/blob/master/docs/site/mkdocs.yml), and [F-Layer's MkDocs site URL and language selector](https://github.com/Fuzzy-Technologies/F-Layer/blob/master/docs/site/mkdocs.yml). Those files require changes and rebuilt project sites in their respective repositories before the entire documentation ecosystem can be declared domain-independent. PRs in this repository cannot modify them.

The repository README's website discovery links remain absolute so they work when read on GitHub. Update those destinations to the purchased domain when it is known; they are not internal navigation in the rendered website.

## Reproduce the checks

After a production Jekyll build, use the expected public origin:

```bash
python scripts/check_site_navigation.py _site --site-url https://www.example.test
python scripts/check_site_links.py _site --site-url https://www.example.test
```

Use the actual origin for a real build. Keep `baseurl` empty: this organization website is deployed at the domain root. A change to hosting under a path prefix is a separate routing change.
