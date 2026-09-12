# Public terminology guide

This guide defines preferred public terminology for the Fuzzy Technologies website.

It complements [LOCALIZATION.md](LOCALIZATION.md). English is canonical; Russian and Simplified Chinese are adaptive public localizations.

## General principles

- Prefer established practitioner terminology over literal translation.
- Preserve product names, protocol names, API names, standard acronyms, commands, package names, and version numbers.
- Do not introduce stronger technical, security, financial, legal, or performance claims during localization.
- When a project has its own terminology contract, that project contract wins for project-specific architecture terms.
- For 1337-specific security architecture terminology, follow the 1337 Security Workbench `docs/TERMINOLOGY.md` guide.

## Company directions

| Concept | English | Russian | Simplified Chinese |
|---|---|---|---|
| Research and development | applied R&D | прикладные исследования и разработка | 应用研发 |
| Trading systems | trading systems | торговые системы | 交易系统 |
| Algorithmic trading | algorithmic trading | алгоритмическая торговля | 算法交易 |
| Quantitative analysis | quantitative analysis | количественный анализ | 量化分析 |
| Risk estimation | risk estimation / risk assessment | оценка риска | 风险评估 |
| Fuzzy logic | fuzzy logic | нечёткая логика | 模糊逻辑 |
| Engineering automation | engineering automation | инженерная автоматизация | 工程自动化 |
| Artificial intelligence | AI | ИИ | AI / 人工智能 |
| Agent systems | agent systems | агентные системы | 智能体系统 |
| Open source | open source | открытый код / ПО с открытым исходным кодом | 开源 |

## Cybersecurity

Prefer terminology already established among security practitioners.

| Concept | English | Russian | Simplified Chinese |
|---|---|---|---|
| Cybersecurity | cybersecurity / security engineering | информационная безопасность / инженерия ИБ | 网络安全 / 安全工程 |
| Penetration testing | penetration testing / pentest | тестирование на проникновение / пентест | 渗透测试 |
| Attack surface | attack surface | поверхность атаки | 攻击面 |
| Reachability | reachability / reachability analysis | достижимость / анализ достижимости | 网络可达性 |
| Attack path | attack path | путь атаки | 攻击路径 |
| Lateral movement | lateral movement | перемещение по инфраструктуре | 横向移动 |
| Security control | security control | мера защиты | 安全控制 / 防护控制 |
| Digital forensics | digital forensics | цифровая криминалистика | 数字取证 |
| Incident response | incident response | реагирование на инциденты | 事件响应 |
| Evidence | evidence | доказательства / материалы | 证据 / 取证材料 |
| Timeline | timeline | хронология | 时间线 |
| Retest | retest | повторная проверка | 复测 |
| Software supply chain | software supply chain | цепочка поставки ПО | 软件供应链 |

## English style

Use native technical English, not internal architecture prose or generic startup marketing.

Prefer concise, concrete wording. Explain what the system does before exposing implementation terminology.

## Russian style

Write natural professional Russian. Do not preserve English sentence structure merely because English is canonical.

Avoid generic English nouns in running prose when a normal professional Russian equivalent exists. Standard acronyms such as API, SDK, MCP, CI/CD, SBOM, DFIR, DevSecOps, Docker, Kubernetes, Nmap, and Nuclei may remain in English.

## Simplified Chinese style

Write natural Simplified Chinese for technical practitioners. Do not translate English syntax word-for-word.

Avoid generic English nouns in running Chinese prose when a normal established Chinese term exists. Standard acronyms and product names may remain in English where customary.

For a project-defined architecture term, use a natural Chinese term and include the canonical English name on first use when useful, for example **安全对象模型（Security Object Model）**.
