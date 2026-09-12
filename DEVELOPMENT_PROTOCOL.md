# DEVELOPMENT_PROTOCOL.md

## Status and authority

Protocol version: `1.0`  
Project: **Fuzzy Technologies public website**

This file is the persistent development contract for the repository. Human contributors, AI agents, IDE assistants, automation, and CI are expected to follow it.

This protocol is owner-controlled. Automated agents must not modify it unless the project owner explicitly asks to change this file.

## 1. Core principle

The normal order is:

```text
canonical English meaning
→ implementation/content change
→ adaptive localization review
→ link and metadata validation
→ diff review
→ pull request
→ human merge
```

Do not change layout, styling, product claims, or project positioning merely to simplify an unrelated documentation edit.

A site change is complete only when the affected public pages, localized variants, links, and metadata have been checked.

## 2. Repository identity and language

This repository hosts the public Fuzzy Technologies website.

Internal repository language is English:

- development documentation;
- commit messages;
- pull-request technical text;
- scripts and configuration;
- comments;
- issue text;
- machine-readable identifiers.

Public site localization is the exception.

Canonical public language is English. Russian and Simplified Chinese are adaptive localizations governed by [docs/LOCALIZATION.md](docs/LOCALIZATION.md) and [docs/TERMINOLOGY.md](docs/TERMINOLOGY.md).

## 3. Public locales

Supported company-site locales:

- English — canonical and default;
- Russian — adaptive professional localization;
- Simplified Chinese (`zh-CN`) — adaptive professional localization.

A localized page must preserve the canonical meaning, maturity, limitations, and claims while using natural local professional language.

Do not localize code identifiers, package names, commands, repository paths, version numbers, API names, or protocol names unless a project explicitly defines a localized public name.

## 4. Branching and pull requests

The default branch is `master`.

Normal content/site changes use a short-lived branch and a pull request into `master`.

Rules:

- no normal direct push to `master`;
- keep one PR focused on one coherent site change;
- human owner review is the normal merge gate;
- automated agents must not self-merge unless explicitly instructed for that PR;
- do not force-push or rewrite `master` history;
- do not mix unrelated layout/CSS work into content/localization changes;
- if the owner says layout is frozen, treat HTML structure, templates, and CSS as out of scope.

## 5. Localization workflow

English is the source of truth.

For a public-copy change:

1. update or verify the canonical English meaning;
2. review the Russian adaptation;
3. review the Simplified Chinese adaptation;
4. preserve product names, versions, commands, URLs, and factual constraints;
5. validate that no locale introduces stronger or weaker claims;
6. validate cross-language navigation and metadata;
7. review the exact diff.

Do not use machine translation output as final public copy without practitioner-level review.

## 6. Content discipline

- Keep landing-page copy concise.
- Prefer engineering facts over promotional filler.
- Do not publish confidential implementation details.
- Do not claim roadmap work as shipped functionality.
- Do not imply guaranteed trading performance, guaranteed security, or universal legal conclusions.
- Product descriptions must remain consistent with their canonical repositories.
- Historical product pages may retain historical context when it is still factual, but stale operational instructions must be corrected.
- Do not broadly rewrite product pages during an unrelated patch.

## 7. Link policy

Every changed page must have its links checked before merge.

Validate:

- internal site paths;
- language-switch links;
- GitHub organization/repository links;
- product documentation links;
- release/package links;
- external project/community links;
- stale owner paths after repository transfers.

A redirect is not a substitute for updating a known stale canonical URL.

If an external destination cannot be verified, report it explicitly rather than assuming it works.

## 8. Layout and assets

- Reuse the existing site structure and CSS unless a design task explicitly authorizes a layout change.
- Do not change CSS, templates, image sizing, or page structure during copy/localization-only work.
- Reuse existing shared images and brand assets.
- Add a new asset only when it has a clear public purpose.
- Do not commit generated caches, local build output, editor state, or temporary files.

## 9. Metadata and SEO

For every public page, keep these aligned with visible content where applicable:

- `lang`;
- title;
- description;
- keywords;
- canonical URL;
- alternate-language references.

English remains the canonical default page. Localized metadata must use native professional wording, not literal translation.

## 10. Validation

For content-only work, validation should include at minimum:

- front-matter syntax review;
- internal-link/path review;
- external-link review for changed and high-value destinations;
- stale owner/repository URL search;
- cross-locale meaning review;
- exact diff review.

If local Jekyll/build tooling is configured, run it. If it is not available, report that fact rather than inventing a PASS.

## 11. Definition of done

A site change is done only when all applicable items are true:

- canonical English meaning is correct;
- Russian localization is reviewed where affected;
- Simplified Chinese localization is reviewed where affected;
- links are valid or unresolved destinations are explicitly reported;
- no stale repository-owner URLs remain in the changed scope;
- product maturity and claims are consistent across locales;
- layout/CSS were not changed unless explicitly requested;
- exact diff was reviewed;
- the PR accurately describes the change;
- human merge remains the final gate unless the owner explicitly directs otherwise.

## 12. Owner escalation

Stop and ask the owner before:

- changing company/product positioning beyond the requested scope;
- changing site layout or CSS when not explicitly authorized;
- removing a product page;
- changing a legal, licensing, financial, or security claim materially;
- changing the localization policy or this development protocol;
- publishing confidential or proprietary implementation details.
