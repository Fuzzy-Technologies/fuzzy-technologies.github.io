---
layout: article
math: true
lang: en
title: 'An engineering view of trading: how a trading robot''s signal algorithm works'
description: 'How do market data become a trading signal? We follow the whole process: outlier filtering, target-attainability estimates, fuzzy signal strength, rules for opening and closing positions, and capital management. The architecture of our algorithm as it stood in 2025.'
keywords: FMA Research, mathematics, data analysis, fuzzy logic, research archive
date: 2025-04-28
author: Timur & Mansur Gilmullin
series: FMA Research
series_url: /FMA/
permalink: /articles/2025-04-28-trading-algorithm/
alternate_en: /articles/2025-04-28-trading-algorithm/
alternate_ru: /ru/articles/2025-04-28-trading-algorithm/
preview_image: /static/images/articles/2025-04-28-trading-algorithm/Girls-and-signals.png
preview_text: 'How do market data become a trading signal? We follow the whole process: outlier filtering, target-attainability estimates, fuzzy signal strength, rules for opening and closing positions, and capital management. The architecture of our algorithm as it stood in 2025.'
cover_image: /static/images/articles/2025-04-28-trading-algorithm/Girls-and-signals.png
source_url: https://teletype.in/@tgilmullin/trading-algorithm
---
> The FMA algorithm as of April 2025: the position-averaging, stop-level and money-management rules used at that time.

![The algorithm determines fuzzy signal strength and the probability level of reaching a target price](/static/images/articles/2025-04-28-trading-algorithm/Girls-and-signals.png)

*The algorithm determines fuzzy signal strength and the probability level of reaching a target price*

[Timur Gilmullin](https://www.linkedin.com/in/tgilmullin), co-authored with [Mansur Gilmullin](https://www.linkedin.com/in/mgilmullin)

Automating the analysis of exchange data makes trading decisions faster and more accurate. But a market is a complex system: real price movements involve noise, outliers and instability. A simple forecast that the price will or will not reach its target means little here. Nor is it possible to predict future price behaviour with 100% certainty. Yet we still need some way to trade, so a reliable approach requires estimating the probability of reaching targets rather than simply guessing the direction of movement.

We have already discussed three key components on this blog that form the basis of a working trading algorithm:

- [anomaly filtering](/articles/2025-04-16-hampel-anomalies-filtering/) using the modified Hampel method—to remove outliers that distort calculations;

- [fuzzy measurement scales](/articles/2025-04-10-fuzzy-scales/)—to interpret risk and probability through understandable levels as well as numbers;

- [estimating target-price attainability](/articles/2025-04-22-target-probability/)—to work with actual probabilities of success rather than categorical, often inaccurate forecasts, using the mathematical tools of probability estimation, statistics and data analysis.

Combining these elements makes it possible to build a reasonably reliable automated signal system that:

- applies money management rules (MMR) on its own;

- automatically analyses market price movements and produces target forecasts;

- estimates signal strength and the probability of reaching forecast targets;

- interprets signals and risks on a fuzzy scale that people can understand;

- and decides whether to open or average a position, hold it, or realise the current profit according to predefined rules.

In this article, we will show how the algorithm itself works: how it analyses data, makes decisions and manages trades.

## Main stages of the algorithm

An algorithmic trading robot performs the following tasks.

1. Select trading signals with a high probability of reaching the target price by analysing statistics of historical price series.

2. Remove anomalous price spikes using filtering methods, such as the modified Hampel method.

3. Account for market dynamics across timeframes to estimate target-attainment probabilities correctly. For this purpose, analyse statistics of five-minute and hourly candles for a short-term trading algorithm, or hourly and daily candles for a long-term investment algorithm.

4. Convert numerical probabilities into understandable signal-quality levels using the universal fuzzy scale {Min, Low, Med, High, Max}.

5. Filter and adjust trading signal strength according to the current probability of success, adapting dynamically to changing market conditions.

6. Apply strict rules for holding or opening positions, averaging and taking profit on each trade, removing human bias and emotional decisions.

7. Control and reallocate capital across the portfolio using global rules:
    - close losing positions or a sufficient number of profitable positions under specified conditions;
    - manage idle cash by moving it into money market funds to improve the resilience of the trading system.

## Algorithm flowchart

![Trading algorithm flowchart](/static/images/articles/2025-04-28-trading-algorithm/S3-Trader-Scheme.png)

*Trading algorithm flowchart*

## How trading signals are generated

Once the data have been cleaned of anomalies and target-attainment probabilities calculated, the algorithm proceeds to generate trading signals: it checks opportunities to close existing positions and open new ones. During each trading iteration, it evaluates numerous price-series characteristics for dozens of instruments in parallel according to the Open / Close Rules, using both conventional technical analysis—constructing Bollinger Bands and calculating the Parabolic SAR indicator—and probabilistic price characteristics: logarithmic returns, mean returns, volatility and the standardised deviation. The result is a desired target price and a strength value for a buy or sell signal.

Each signal is also analysed in several ways:

- the probability of reaching the target price is estimated;

- numerical probability and signal strength are converted into levels on the fuzzy scale {Min, Low, Med, High, Max};

- signal strength is filtered according to target-attainment probability.

Weak or unstable signals are screened out at this stage. A signal reaches the trade-entry decision stage only if the probability is sufficiently high and the additional conditions are met. Signal strength also directly affects the quantity of the instrument used in trading.

Immediately before executing the trade, the algorithm also analyses the current order book:

- whether sufficient buy-side and sell-side volume is available;

- whether the selected direction is favoured;

- whether there are anomalously large volumes in the order book.

Order-book analysis provides another reason to cancel a trade. For example, if a buy signal is received but sell-side volume is several times larger than buy-side volume, it is worth postponing the purchase. The same applies if the order book contains too many anomalously large sell orders. When anomalous volumes are present, however, a buy order can also be placed just above the anomaly, or a sell order just below it, using the approach referred to here as front-running a large visible order.

## Rules for opening and closing positions

As mentioned above, signal strength affects both the trade size and the way orders are submitted to the order book.

1. For a Max-level signal:
    - use the maximum permitted trade size for a single instrument;
    - submit a market order:
      - at the best ask for a buy trade;
	  - or at the best bid for a sell trade.

2. For a High-level signal:
    - use a reduced share of the permitted trade size for a single instrument;
    - submit a stop order:
      - at the best bid for a buy trade;
	  - or at the best ask for a sell trade;

3. For a Med-level signal:
    - use half the size permitted for a single trade;
	- submit a stop order
	  - one tick above the first anomalously large buy-side volume for a buy trade;
	  - or one tick below the first anomalously large sell-side volume for a sell trade.

The colour-coded diagrams of position-opening and closing rules show how progressively stricter conditions are applied as signal strength increases.

### Opening and averaging positions

1. Open a trade only when a signal is sufficiently strong, or of sufficient quality. This usually means Med, High or Max.

2. Check the per-trade risk limits before opening a position.

3. Allow position averaging if the following conditions hold:
    - the instrument's drawdown is within acceptable limits;
    - signal strength remains sufficient after averaging.

![Basic rules for opening or averaging Buy positions](/static/images/articles/2025-04-28-trading-algorithm/OpenRules.png)

*Basic rules for opening or averaging positions [Buy]*

### Holding positions or taking profit

1. Take profit when either the target, or desired, level or a sufficient profit level is reached.

2. Force a trade to close if the probability of reaching the target has fallen substantially.

3. Limit losses when stop levels are reached or the acceptable risk is exceeded.

![Basic rules for holding and closing Sell positions](/static/images/articles/2025-04-28-trading-algorithm/CloseRules.png)

*Basic rules for holding and closing positions [Sell]*

## Money management rules

### Why capital management matters

Alongside the management of individual trades, a crucial part of a trading system is overall capital management: managing the funds available in the portfolio for allocation to assets. Even if every individual trade looks profitable and has a high probability of reaching its target, risks can quickly grow without portfolio-wide oversight.

### How the Money Management Rules work

The basic rules are fairly simple and aim to grow the portfolio's value steadily:

1. Close all positions in the portfolio when the total profit exceeds a specified level.

2. Close losing positions, offsetting their losses with a number of profitable positions, if the loss exceeds the acceptable threshold.

3. Manage idle cash:
    - when there are no buy signals, temporarily move available funds into money market funds with daily compounding;
    - when a purchase is required, withdraw some of the money from those funds.

The Money Management Rules run automatically on a schedule, usually once or twice a day.

## Why use probabilistic estimates and a fuzzy scale?

### Do not rely on categorical forecasts

A market is inherently a system with considerable uncertainty: it is unstable and subject to random fluctuations, including those caused by fake news, and anomalous price jumps. Even a strong signal cannot guarantee success or that the target price will be reached. Analytical systems therefore estimate the probability of reaching a target rather than make categorical predictions.

Why use a probabilistic estimate?

- The number represents confidence in the target's attainability, not the fact that it will be reached.

- It allows the most reliable trades to be selected.

- It reduces the share of risky decisions and minimises human bias.

### How the fuzzy scale is used

Probabilities are mapped to levels on a fuzzy scale:

![Supports of the levels on a fuzzy probability scale](/static/images/articles/2025-04-28-trading-algorithm/level-sets.png)

*Supports of the levels on a fuzzy probability scale*

These supports are approximate and may overlap. Correct interpretation uses fuzzification: evaluating the degree of membership in each level.

The universal fuzzy measurement scale itself can then look like this:

![A universal fuzzy measurement scale with the levels Min, Low, Med, High and Max. It is constructed using supports and several types of membership function: hyperbolic, bell-shaped and parabolic](/static/images/articles/2025-04-28-trading-algorithm/02_scale_fuzzy.png)

*A universal fuzzy measurement scale with the levels Min—minimum, Low—low, Med—medium, High—high and Max—maximum. It is constructed using supports and several types of membership function: hyperbolic, bell-shaped and parabolic*

## Filtering signal strength

Once signal strength has been assessed on a fuzzy scale, it is easy to adjust it according to target-attainment probability:

![Adjusting signal strength according to probability](/static/images/articles/2025-04-28-trading-algorithm/filtering.png)

*Adjusting signal strength according to probability*

An example of a simple signal filter:

```python
signalFilter = {
    "Max": {"Max": "Max", "High": "High", "Med": "Med", "Low": "Low", "Min": "Min"},
    "High": {"Max": "High", "High": "Med", "Med": "Low", "Low": "Min", "Min": "Min"},
    "Med": {"Max": "Med", "High": "Low", "Med": "Min", "Low": "Min", "Min": "Min"},
    "Low": {"Max": "Low", "High": "Min", "Med": "Min", "Low": "Min", "Min": "Min"},
    "Min": {"Max": "Min", "High": "Min", "Med": "Min", "Low": "Min", "Min": "Min"},
}
```

## Using the algorithm in practice

A trading system built on probabilistic estimates of target attainability and fuzzy scales:

- cleans outliers from the data;

- assesses target attainability using statistics from real data;

- makes cautious decisions based on probabilities rather than categorical forecasts;

- manages trades and capital within predefined rules.

This approach:

- improves the reliability of trading decisions;

- reduces random errors and the influence of human bias;

- controls risks systematically;

- adapts dynamically to changing real-world market conditions.

An engineering approach to trading is not about guesswork. It means handling uncertainty carefully through mathematics: statistics, probabilities, fuzzy sets and strict rules. The algorithm described here formed the basis of automated trading-signal services and a bot for trading on an exchange.

## Useful links

- 🌐 The full signal FAQ and an explanation of FMA methods: [Fuzzy Market Analytics](https://fuzzy-technologies.github.io/FMA/)

- ⚙️ The TKSBrokerAPI platform: [TKSBrokerAPI](https://fuzzy-technologies.github.io/TKSBrokerAPI/)

## Further reading

- [What are fuzzy measurement scales?](/articles/2025-04-10-fuzzy-scales/)

- [How to find anomalies in numerical sequences](/articles/2025-04-16-hampel-anomalies-filtering/)

- [How to estimate the probability of reaching a target](/articles/2025-04-22-target-probability/)

- [Through hardships to the stars: the story of a trading algorithm](/articles/2025-05-13-trading-algorithm-history/)
