---
layout: default
lang: en
title: TKSBrokerAPI
description: Open-source Python platform for T-Investments REST API, market-data collection, analytics and trading automation.
alternate_en: /TKSBrokerAPI/en/
alternate_ru: /TKSBrokerAPI/
---

<header class="site-header">
  <h1 class="site-title"><a href="/TKSBrokerAPI/en/">⚙️ TKSBrokerAPI</a></h1>
  <div class="site-actions">
    <nav class="language-switch" aria-label="Language">
      <span class="active" aria-current="page">EN</span>
      <a href="/TKSBrokerAPI/" lang="ru">RU</a>
    </nav>
    <a class="brand-button" href="/" aria-label="Back to Fuzzy Technologies">
      <img src="/static/images/FuzzyTechnologies-Logo-transp.png" alt="Fuzzy Technologies" />
    </a>
  </div>
</header>

*By [Fuzzy Technologies](/)*

<a href="/TKSBrokerAPI/en/">
  <img src="/static/images/TKSBrokerAPI-Logo.png" alt="TKSBrokerAPI Logo">
</a>

<a href="https://t.me/TKSBrokerAPI/19"><i>Developer channel: ➤ @TKSBrokerAPI</i></a>

⚙️ **TKSBrokerAPI** is an open-source Python platform for working with the T-Investments REST API, collecting market data and automating analytical and trading scenarios.

It provides one interface for common tasks: connecting to the broker, reading portfolio and market data, retrieving operations, preparing reports and sending trading commands.

TKSBrokerAPI can be used from the command line or imported as a Python module. It also serves as an infrastructure layer for some Fuzzy Market Analytics workflows.

### 📦 Installation

Stable PyPI release:

```shell
pip install tksbrokerapi==1.6.268
```

Docker:

```shell
docker pull tim55667757/tksbrokerapi:1.6.268
```

Current development build:

```shell
pip install tksbrokerapi==1.6.dev269
```

```shell
docker pull tim55667757/tksbrokerapi:1.6.dev269
```

### 📚 Documentation

- [Source code on GitHub](https://github.com/Tim55667757/TKSBrokerAPI/tree/develop)
- [README and examples](https://github.com/Tim55667757/TKSBrokerAPI/blob/develop/README.md)
- [Generated API documentation](https://tim55667757.github.io/TKSBrokerAPI/docs/tksbrokerapi/TKSBrokerAPI.html)
- [CHANGELOG](https://github.com/Tim55667757/TKSBrokerAPI/blob/develop/CHANGELOG.md)

### Why TKSBrokerAPI exists

When a trading or analytical system needs portfolio state, quotes, orders and market history, the useful part of the work should be the strategy itself — not repeatedly rebuilding broker integration.

> Build the strategy; let the platform handle the broker plumbing.

#### 💡 Typical workflow

<img src="/static/images/TKSBrokerAPI-flow.png" alt="TKSBrokerAPI Flow">

1. Define the trading or analytical idea.
2. Describe it as a sequence of steps.
3. Implement the scenario in Python using TKSBrokerAPI.
4. Let the platform handle broker connectivity and data processing.
5. Produce analytics, actions and reports.

#### 📊 Data collection and enrichment

<img src="/static/images/TKSBrokerAPI-extend-data-flow.png" alt="TKSBrokerAPI Analytics"/>

TKSBrokerAPI can collect raw data for shares, bonds, funds, futures and currencies and expose it in formats useful for further analysis:

- 📈 CSV and XLSX
- 📄 Markdown reports
- 🧠 Pandas DataFrame

A common pipeline is:

1. Request data from the broker.
2. Calculate derived fields, statistics and aggregates.
3. Export or display the result.
4. Analyze it in Excel, Jupyter, Power BI or Python.
5. Turn the analysis into a strategy.
6. Automate the strategy with a Python scenario.

### 🛠 Usage

The platform supports two main modes.

#### 1. Command line

Use the CLI for portfolio reports, data export and scripted operations.

```shell
tksbrokerapi --overview
```

The command can produce a Markdown portfolio report with positions, orders, portfolio value and allocation statistics.

#### 2. Python module

Import the platform and build your own analytical or trading workflow:

```python
from tksbrokerapi.TKSBrokerAPI import TinkoffBrokerServer, uLogger
from tksbrokerapi.TradeRoutines import *


class TradeScenario(TinkoffBrokerServer):
    def __init__(self, **kwargs):
        super().__init__(
            token=kwargs["userToken"],
            accountId=kwargs["userAccount"],
        )
        self.tickers = []
        self.curTicker = None

    def Steps(self):
        uLogger.info(f"Working with: [{self.curTicker}]")
        pass

    def Run(self):
        for ticker in self.tickers:
            self.curTicker = ticker
            self.Steps()


def Trade():
    trader = TradeScenario(
        userToken="",
        userAccount="",
    )
    trader.tickers = ["YNDX", "IBM", "GAZP"]
    trader.Run()


if __name__ == "__main__":
    Trade()
```

More examples are available in the [project README](https://github.com/Tim55667757/TKSBrokerAPI).

<div style="text-align: center; margin-top: 2em;">
  <a href="/">
    <img src="/static/images/Technologies-Knowledge-Science.png" alt="Technologies · Knowledge · Science" width="200"/>
  </a>
  <p style="font-size: 0.9em; color: #666;">Fuzzy Technologies</p>
</div>
