# Public localization and terminology policy

This policy governs public website localization for Fuzzy Technologies.

## Canonical language

English is the canonical source for public product meaning, technical claims, release facts, links, and positioning.

Russian and Simplified Chinese are derived public editions. They must preserve the canonical meaning, but they are adaptive localizations rather than word-for-word translations.

When canonical English copy changes, the corresponding Russian and Simplified Chinese copy should be reviewed in the same pull request whenever practical.

## General rules

- Write for native technical practitioners in each language.
- Translate intent and practitioner meaning rather than English sentence structure.
- Prefer established local engineering, trading, AI, and cybersecurity terminology over literal calques or invented wording.
- Keep product names, trademarks, protocol names, standard acronyms, code identifiers, commands, package names, version numbers, and repository paths unchanged where appropriate.
- Do not strengthen or weaken claims during localization.
- Product maturity, roadmap status, limitations, disclaimers, financial wording, and security claims must remain equivalent across locales.
- Internal code, API identifiers, engineering contracts, ADRs, issues, and pull-request technical text remain English unless a project explicitly defines otherwise.
- Layout and visual structure remain locale-independent unless a separate design change is requested.

## English style

Public English should read like native engineering and security product copy, not an internal architecture memo or generic marketing text.

Prefer concrete practitioner-facing wording. Keep sentences compact and avoid inflated claims.

## Russian style

Russian public copy must read as original professional Russian rather than translated English syntax.

Prefer established terminology such as:

- информационная безопасность;
- анализ защищённости;
- тестирование на проникновение / пентест;
- поверхность атаки;
- анализ достижимости;
- пути атаки;
- меры защиты;
- торговые системы;
- алгоритмическая торговля;
- количественный анализ;
- оценка риска;
- нечёткая логика;
- автоматизация;
- прикладные исследования и разработка.

Avoid generic English nouns in running Russian prose when a normal professional Russian equivalent exists.

## Simplified Chinese style

Simplified Chinese public copy must use terminology and sentence structure natural to Chinese engineering and security practitioners rather than mechanically mirroring English.

Prefer established terms such as:

- 网络安全;
- 安全工程;
- 渗透测试;
- 攻击面;
- 网络可达性;
- 攻击路径;
- 横向移动;
- 安全控制 / 防护控制;
- 取证材料;
- 时间线;
- 复测;
- 交易系统;
- 算法交易;
- 量化分析;
- 风险评估;
- 模糊逻辑;
- 工程自动化;
- 应用研发.

Avoid mixing generic English nouns into normal Chinese prose when an established Chinese term exists. Standard acronyms and product names may remain in English where that is normal professional usage.

For cybersecurity-specific wording, the canonical reference is the 1337 Security Workbench terminology guide in `docs/TERMINOLOGY.md` of the 1337 repository.

## Cross-locale review checklist

1. English remains the canonical source and is factually current.
2. Russian and Simplified Chinese preserve the same meaning without copying English syntax.
3. Product maturity, roadmap status, limitations, and disclaimers remain equivalent.
4. Security, trading, AI, and automation terminology is natural for the target audience.
5. Product names, commands, API names, versions, repository paths, and package names remain exact.
6. Links point to the current canonical project owner and destination.
7. Page titles, descriptions, keywords, and visible copy do not contradict one another.
8. No locale retains stale claims removed from canonical English.
9. No translation introduces stronger performance, financial, security, or legal claims.
10. Layout and visual structure remain unchanged unless separately requested.
