# Domain migration and domain-independent navigation

## Registered domains

The owner confirmed purchasing the following four domains on **2026-10-16**. The registrar's account showed expiry on **2027-10-16** and auto-renewal enabled for all four. This records registration, not successful DNS, certificate issuance, or a completed website migration.

| Domain | Purpose | Website repository or destination |
| --- | --- | --- |
| `fuzzy-technologies.com` | Primary company website | `Fuzzy-Technologies/fuzzy-technologies.github.io` |
| `fuzzy-technologies.ru` | Defensive company domain; HTTPS redirect to the primary site's Russian version | `https://fuzzy-technologies.com/ru/` for the domain root; define deep-path handling before enabling redirects |
| `history-math.org` | Primary Mathematics with Mansur journal | `Fuzzy-Technologies/history_math` |
| `history-math.ru` | Defensive journal domain; HTTPS redirect to the primary journal | `https://history-math.org/`; preserve valid paths and query parameters |

The `.com` and `.org` apex domains are the intended canonical origins. Their `www` variants should redirect to the corresponding apex. The `.ru` registrations are separate domains, not aliases automatically handled by GitHub Pages. No additional TLDs or shortened brand domains are part of this inventory.

## Connection status on 2026-10-17 (Europe/Moscow)

The company repository's Pages settings now contain `fuzzy-technologies.com`; GitHub confirmed the setting was saved and added its `CNAME` file on `master`. Public Google and Cloudflare DNS queries returned the expected ownership TXT value, but the organization-level Verify action still reported that the TXT record could not be found. Treat ownership verification as pending, not complete. The serving A/www records still require the owner's REG.RU update, followed by a successful Pages DNS check and HTTPS provisioning. No journal or `.ru` custom-domain settings have been changed. The production-origin CI expectation is being updated in this PR to match the newly configured hostname.

## GitHub Pages connection runbook

This is a deployment plan. Publishing settings and DNS must be checked at execution time; this documentation change does not alter either service.

1. Complete the website portability work before directing production visitors to it. The company site's root-navigation work was merged in [PR #54](https://github.com/Fuzzy-Technologies/fuzzy-technologies.github.io/pull/54); the separately built documentation dependencies below remain a deployment prerequisite. For the journal, the reviewed `master` configuration currently uses `url: https://fuzzy-technologies.github.io` and `baseurl: /history_math`. Prepare a separate journal change to use `url: https://history-math.org` and an empty `baseurl`, then check article links, assets, search data, canonical URLs, sitemap, and any deployment overrides. Its configured source is `site`, so branch-based deployment would need a `CNAME` in the published source rather than an arbitrary repository directory.
2. In **Fuzzy-Technologies organization Settings > Pages > Add a domain**, verify ownership of each primary domain. Copy the exact TXT record and token GitHub generates into the authoritative DNS zone, click Verify, and retain the TXT record. Verification belongs to the organization that owns these repositories, not the maintainer's personal account. The separate organization-profile Verified badge is not a substitute for Pages verification.
3. In each repository's **Settings > Pages > Custom domain**, set only its primary hostname: `fuzzy-technologies.com` for the company repository, `history-math.org` for the journal. Save the repository setting before pointing its serving DNS at Pages. When publishing from a branch GitHub adds a `CNAME` file; for custom Actions publishing GitHub documents that the file is not required and is ignored. Check each repository's actual publishing mode instead of relying on the file alone.
4. In REG.RU, open the primary domain, then **Management > DNS servers and zone**. Edit records at the currently authoritative DNS provider. If that is REG.RU, add the records below there. Replace conflicting parking A/AAAA records and a conflicting `www` record; retain unrelated mail, ownership-verification, and other DNS records.

Apply this same record set independently to **both primary domains**:

| Type | Host / Subdomain | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `fuzzy-technologies.github.io.` |

The `www` CNAME destination is the organization hostname for both sites. It must contain neither `https://` nor a repository path such as `/history_math`. The repository's custom-domain mapping chooses which site serves each hostname. Do not add a wildcard pointing unconfigured names at Pages. IPv6 can be added using all current GitHub Pages AAAA addresses from the official documentation; do not leave an unrelated parking AAAA record in place.

5. Wait for the GitHub DNS check and certificate provisioning, then enable **Enforce HTTPS** in each repository. GitHub documents that DNS propagation and HTTPS availability can each require up to 24 hours. GitHub supplies the Pages certificate; a separate REG.RU SSL purchase is not required for these Pages sites.
6. Configure the two `.ru` domains on an HTTPS-capable redirect endpoint. REG.RU explicitly documents that its Web-forwarding service cannot install SSL certificates and therefore cannot redirect incoming `https://` requests. A root-domain DNS CNAME alone does not create an HTTP redirect. Choose the redirect service or an existing web server separately and verify certificates, root/deep-path destinations, queries, and redirect loops. The company root should land on `/ru/`; do not blindly prepend `/ru/` to every request, because already localized and project-documentation paths need explicit handling.
7. Verify the live company and journal roots, their `www` redirects, HTTPS, language switches, assets, and canonical URLs. Verify organization project sites under the company domain, and confirm that the journal's explicit custom domain overrides organization-domain inheritance. Update the repository README discovery links after the new public destinations are live.

Official references:

- [GitHub Pages custom-domain and DNS configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages ownership verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Organization-domain inheritance and per-project overrides](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [REG.RU DNS resource records](https://help.reg.ru/support/dns-servery-i-nastroyka-zony/nastroyka-resursnykh-zapisey-dns/nastroyka-resursnykh-zapisey-v-lichnom-kabinete)
- [REG.RU Web-forwarding limitations](https://help.reg.ru/support/domains/dopolnitelnyye-uslugi-dlya-domena/pereadresatsiya-domena)

## Website navigation contract

Public navigation and assets use paths on the current origin: `/FMA/`, `/ru/FMA/`, `/articles/`, `/F-Layer/en/`, and `/static/...`. Do not write absolute company `github.io` URLs into published pages, templates, image metadata, scripts, or CSS. External services and source-code links remain explicit external URLs.

Canonical, alternate-language and social-image URLs must be absolute. The shared layouts generate them with Jekyll's `absolute_url` filter. `_config.yml` leaves `url: null` so the GitHub Pages metadata plugin supplies the configured site origin, including its custom domain. It must not be pinned to the former Pages hostname. A build hosted outside GitHub Pages must supply its public `url` in a configuration override.

The CI matrix builds both the normal Pages configuration and a simulated `https://www.example.test` origin. It verifies all rendered HTML references, local files, anchor fragments, canonical/alternate metadata, social-image metadata, runtime assets, FMA redirects and article navigation. The simulated domain is a test fixture and is never published.

## Organization project sites

GitHub Pages normally makes public project sites available below the organization site's custom domain, unless a project has its own custom domain. See [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

The root site's links to these separately built resources use the same current-origin paths. The deterministic checker registers their exact routes rather than treating missing local files as valid by prefix. Their destinations were checked over HTTP during this audit; network availability is not part of the deterministic PR gate.

| Resource         | Paths used by this website                                                                                | Source of deployed content                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1337             | `/1337/`, `/1337/zh-cn/`                                                                                  | [1337](https://github.com/Fuzzy-Technologies/1337)                 |
| F-Layer          | `/F-Layer/en/`, `/F-Layer/ru/`, `/F-Layer/zh-CN/`                                                         | [F-Layer](https://github.com/Fuzzy-Technologies/F-Layer)           |
| TKSBrokerAPI API | `/TKSBrokerAPI/docs/tksbrokerapi/TKSBrokerAPI.html`, `/TKSBrokerAPI/docs/tksbrokerapi/TradeRoutines.html` | [TKSBrokerAPI](https://github.com/Fuzzy-Technologies/TKSBrokerAPI) |

The former personal-account TKSBrokerAPI documentation URL returned 404; the organization paths returned 200 and replace it in both product-page languages.

## Remaining deployment work

This change prepares the root website; it does not configure a domain or DNS. Before the actual move, configure the organization site's custom domain and HTTPS in GitHub Pages and verify its project mounts.

The neighboring repositories have their own build inputs. The audit found absolute Pages URLs in [FuzzyRoutines' MkDocs navigation and site URL](https://github.com/Fuzzy-Technologies/FuzzyRoutines/blob/master/docs/site/mkdocs.yml), [1337's API language selector](https://github.com/Fuzzy-Technologies/1337/blob/master/docs/site/mkdocs.yml), and [F-Layer's MkDocs site URL and language selector](https://github.com/Fuzzy-Technologies/F-Layer/blob/master/docs/site/mkdocs.yml). Those files require changes and rebuilt project sites in their respective repositories before the entire documentation ecosystem can be declared domain-independent. PRs in this repository cannot modify them.

The repository README's website discovery links remain absolute so they work when read on GitHub. Update those destinations to `https://fuzzy-technologies.com` after the primary domain is live; they are not internal navigation in the rendered website.

## Reproduce the checks

After a production Jekyll build, use the expected public origin:

```bash
python scripts/check_site_navigation.py _site --site-url https://www.example.test
python scripts/check_site_links.py _site --site-url https://www.example.test
```

Use the actual origin for a real build. Keep `baseurl` empty: this organization website is deployed at the domain root. A change to hosting under a path prefix is a separate routing change.
