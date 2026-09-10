---
layout: default
lang: en
title: Fuzzy Market Analytics
description: Fuzzy Market Analytics services use statistics, probability models, anomaly filtering and fuzzy logic for market analysis and trading automation.
alternate_en: /FMA/en/
alternate_ru: /FMA/
---

<header class="site-header">
  <h1 class="site-title"><a href="/FMA/en/">📊 Fuzzy Market Analytics</a></h1>
  <div class="site-actions">
    <nav class="language-switch" aria-label="Language">
      <span class="active" aria-current="page">EN</span>
      <a href="/FMA/" lang="ru">RU</a>
    </nav>
    <a class="brand-button" href="/" aria-label="Back to Fuzzy Technologies">
      <img src="/static/images/FuzzyTechnologies-Logo-transp.png" alt="Fuzzy Technologies" />
    </a>
  </div>
</header>

<table class="table-clean">
  <tr>
    <td style="width: 280px;">
      <img class="fuzzy-avatar" src="/static/images/FMA-purple-pink.png" alt="Fuzzy Market Analytics Logo">
    </td>
    <td>
      <p><strong>Fuzzy Market Analytics</strong> (FMA) is a family of tools and services for market analysis and trading automation.</p>
      <p>FMA methods combine probability models, Bayesian updates, modified Hampel filtering, target-reachability estimates and fuzzy decision rules adapted to real-time market data.</p>
      <p>The goal is practical: reduce noise, keep the logic interpretable and make risk and target estimates explicit.</p>
    </td>
  </tr>
</table>

## Products & services

<div class="fma-product-grid">
  <section class="project-card fma-product-card featured">
    <span class="card-label">Signals · Analytics · Free</span>
    <a class="product-art-link" href="https://t.me/FuzzyMarketAnalytics">
      <img class="fuzzy-avatar product-art" src="/static/images/0001-Ева-и-Мария.png" alt="Fuzzy Market Analytics signal service">
    </a>
    <h3>📈 Short-term signals for Russian equities</h3>
    <p>🤖 The service watches the Russian market and reports short-term entry setups together with target prices, estimated probability, and signal strength. It combines technical analysis, fuzzy rules, and anomaly detection.</p>
    <p>📊 Strong signals are filtered by market phase, trend, and the built-in risk model instead of publishing every price movement.</p>
    <p>📡 Signals are generated automatically during the trading day. <a href="/FMA/en/instruments.html"><strong>Tracked instruments →</strong></a></p>
    <div class="project-links">
      <a href="https://t.me/FuzzyMarketAnalytics">🔔 Follow on Telegram →</a>
    </div>
  </section>

  <section class="project-card fma-product-card">
    <span class="card-label">Automated Trading · Robot · In Development</span>
    <a class="product-art-link" href="https://t.me/fuzzy_technologies">
      <img class="fuzzy-avatar product-art" src="/static/images/0000-Вера-и-Дарина.png" alt="Fuzzy Market Analytics trading robot">
    </a>
    <h3>🤖 Automated trading robot</h3>
    <p>FMA research is also used in automated trading systems and strategy prototypes running on a user's brokerage account.</p>
    <p>The goal is to automate strategy execution while keeping risk rules and operating assumptions explicit.</p>
    <p>The current commercial direction combines a fixed rental fee with performance-based compensation. Product availability depends on the platform and development stage.</p>
    <div class="project-links">
      <a href="https://t.me/fuzzy_technologies">💬 Discuss access →</a>
    </div>
  </section>
</div>

### ❓ FAQ

#### 🤖 Who is the signal service for?

It is aimed at traders working intraday or holding positions for roughly 1–5 trading days.

The analysis uses 5-minute and 1-hour timeframes. The internal probability model uses a limited forecast horizon rather than pretending to predict an exact time of arrival.

#### 💼 Which instruments are tracked?

The current service covers selected Russian shares, funds, currencies and metals. See the <a href="/FMA/en/instruments.html"><strong>instrument list</strong></a>.

#### 📆 When does the service run?

- Weekdays: 07:00–23:55, updates every 5 minutes.
- Weekends: 10:00–18:00, updates every 15 minutes.

#### 🔔 When is a signal published?

A new message may appear when the rule set is satisfied, when signal strength increases, or when the estimated probability changes materially.

#### 🤔 Why do signals fail?

Because markets are probabilistic. News, liquidity and broader market conditions can invalidate even a strong statistical setup. FMA reduces noise and formalizes decisions; it does not predict the future.

#### 📈 How should signals be used?

Signals are analytical output, not an instruction to trade. They can be used as an additional filter, a way to watch changing probability estimates, or an input to your own strategy and risk process.

#### ⚠️ Disclaimer

*Information published on this site and in the Telegram channel is automatically generated statistical analysis and is not individualized investment advice. Trading decisions and the associated risks remain with the user.*

### ⚡ Reading an FMA signal

Each FMA signal is a **statistical estimate of the probability of reaching a target price**, based on trend behavior, volatility, fuzzy risk assessment and price anomalies on **5-minute and 1-hour timeframes**.

A signal estimates target reachability; it does **not** promise an exact arrival time.

> 🕔🔔📈 *A signal is usually intended for a horizon of roughly **1–5 trading days**, depending on the instrument and market conditions.*

<table class="table-clean">
<tr>
  <td style="width: 280px; vertical-align: top;">

#### 🟩 Signal example

  <img class="fuzzy-avatar" src="/static/images/signal-example.png" alt="Signal Example">
  </td>
  <td>

#### 🟩 Signal structure

- 📈 **Entry price**
- 🎯 **Target price** and expected move (%)
- 💪 **Signal strength** and **target probability**

Signal strength uses a fuzzy scale:

| Level | Meaning |
|---|---|
| 🔵 | medium |
| 🟡🟡 | high |
| 🟢🟢🟢 | maximum |

The message also includes the model probability (%) and the internal forecast horizon.

  </td>
</tr>
</table>

#### ℹ️ Target and horizon

The target is an **estimate**, not a guaranteed price. The horizon is an internal model assumption, not a hard deadline.

A medium signal can strengthen later; a high or maximum signal may resolve quickly; any signal can fail when conditions change.

### 💡 Methodology

FMA is built around engineering mathematics and explicit data-processing rules:

- **Target probability:** volatility and returns are converted into probability estimates and combined using Bayesian updates.
- **Noise filtering:** a modified Hampel filter is used to reduce the effect of outliers and abnormal observations.
- **Decision rules:** reachability and risk estimates are converted into fuzzy levels used by the trading rules.
- **Real-time operation:** the model accounts for current volatility, session activity and the lifetime of market observations.
- **Efficient implementation:** calculations are optimized for repeated processing of large market datasets.

> **FMA: mathematics, engineering and real markets — without magic promises.**

<div style="text-align: center; margin-top: 2em;">
  <a href="/">
    <img src="/static/images/Technologies-Knowledge-Science.png" alt="Technologies · Knowledge · Science" width="200"/>
  </a>
  <p style="font-size: 0.9em; color: #666;">Fuzzy Technologies</p>
</div>
