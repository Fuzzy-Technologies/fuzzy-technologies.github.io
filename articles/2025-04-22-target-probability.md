---
layout: article
math: true
lang: en
title: Will the price reach its target? Estimating probability instead of guessing
description: Real markets contain noise, outliers and uncertainty. We explain how to use historical data to estimate the probability of reaching a target, why prices need cleaning before calculation, and how to express the result as an understandable fuzzy assessment. With examples and diagrams.
keywords: FMA Research, mathematics, data analysis, fuzzy logic, research archive
date: 2025-04-22
author: Timur & Mansur Gilmullin
series: FMA Research
series_url: /FMA/
permalink: /articles/2025-04-22-target-probability/
alternate_en: /articles/2025-04-22-target-probability/
alternate_ru: /ru/articles/2025-04-22-target-probability/
preview_image: /static/images/articles/2025-04-22-target-probability/Girls-and-probability.png
preview_text: Real markets contain noise, outliers and uncertainty. We explain how to use historical data to estimate the probability of reaching a target, why prices need cleaning before calculation, and how to express the result as an understandable fuzzy assessment. With examples and diagrams.
cover_image: /static/images/articles/2025-04-22-target-probability/Girls-and-probability.png
source_url: https://teletype.in/@tgilmullin/target-probability
---
![Probable improbability—or improbable probability!](/static/images/articles/2025-04-22-target-probability/Girls-and-probability.png)

*Probable improbability—or improbable probability!*

In practical data analysis and trading, we often need to know how likely an asset's price is to reach a particular level. This is a key problem in algorithmic trading and risk management because it helps screen out unrealistic trade-entry signals. A simple prediction of will reach or will not reach is inadequate: markets are unstable and subject to random fluctuations, noise and anomalous price spikes.

It therefore makes sense to estimate the probability of reaching a target rather than make categorical predictions. Several approaches are available:

- conventional forecasting models, such as linear regression and ARIMA;

- machine learning and neural networks;

- a statistical approach: analysing the distribution of price changes and estimating the probability of reaching a target level.

The third approach is simpler, easier to explain and more reliable under real, noisy data conditions. It is also well suited to automated signal systems that need fast assessments of target attainability without computationally heavy models.

## Why we cannot simply say will reach or will not reach

Real market data are noisy and contain:

- random price spikes;

- rare, extreme outliers;

- quote-feed disruptions.

These outliers can substantially distort an estimate: a single brief move through a level in a thin market does not mean that the price consistently reaches its targets. Before estimating probabilities, we therefore clean the data to remove the influence of isolated random spikes.

One cleaning method is Hampel filtering, discussed in the [previous article](/articles/2025-04-16-hampel-anomalies-filtering/). Once filtering is complete, we can work with the cleaned sequence of price changes and calculate meaningful probability estimates. An anomalous price can be replaced, for example, by the mean of its two neighbours.

> Estimating the price at a specified horizon and estimating the probability of touching a level at least once before that horizon are different problems. The log-return model described below concerns the price at the end of the horizon; its result must not automatically be interpreted as a first-passage probability. The [article on the probabilistic approach](/articles/2026-09-27-a-trading-robot-is-not-a-magic-button/) explores this distinction in more detail.

## The target-probability estimation problem

The inputs are historical closing prices from standard OHLCV candles—open, high, low, close and volume—at five-minute and hourly intervals; in fact, any pair of timeframes can be selected. The target under analysis may come from an external forecast based on technical or fundamental analysis, or be specified as an expert's hypothesis without a formal derivation.

![Estimating the probability of reaching a target from the current price Cₜ over a forecast horizon H](/static/images/articles/2025-04-22-target-probability/Signals-Buy-Max-High-Med-with-probability-BW.png)

*A schematic view of the problem: starting from the current price Cₜ, we do not know exactly how the price will behave; we can only estimate the probability associated with a target level over the forecast horizon H*

The task is to obtain an overall assessment of the probability of reaching a target from the current price Cₜ over a horizon of H candles, using two price sequences: five-minute C₅ₘ(t) and hourly C₁ₕ(t). The figure illustrates this setup.

## Estimating the probability of reaching a target

We use the following approach to estimate the probability associated with a specified price level.

1. Collect historical data: construct sequences of closing prices from five-minute and hourly candles.

2. Remove anomalous price jumps using Hampel filtering.

3. Select the starting price from which all target-attainability calculations will be made.

4. Calculate statistics of price changes over the selected intervals:
   - logarithmic returns;
   - mean returns;
   - the standard deviation of returns, or volatility;
   - the standardised deviation.

5. Use the standard normal cumulative distribution function evaluated at the standardised deviation to calculate the probability of the price exceeding the target at the end of the horizon, under the assumed model of normally distributed log returns.

6. Aggregate the assessments for different timeframes, then produce an overall assessment as a number or a fuzzy level.

The detailed calculation is presented in the [research paper on estimating target-attainment probability](https://moitvivt.ru/ru/journal/pdf?id=1905).

## Why a probability should not always be expressed as a precise number

Sometimes a precise-looking probability, such as 74.3%, creates a false sense of confidence: the number suggests precision where uncertainty remains. Fuzzy probability scales are useful in practice, particularly when data are unstable or incomplete.

Fuzzy scales are qualitative, level-based scales in which each level is represented by a linguistic term—a named fuzzy set.

Instead of a precise number, we can specify a probability level:

- low probability;

- medium probability;

- high probability.

This approach:

- is easier for a person to interpret;

- reflects the underlying uncertainty;

- helps build more robust automated trading-decision systems.

We discussed fuzzy scales and their use in assessment in an [earlier article](/articles/2025-04-10-fuzzy-scales/).

## Practical applications

Estimating target-attainment probability is an engineering way to assess plausible price levels from real data, rather than an attempt to guess the future.

By removing outliers from historical data and analysing their statistical distributions, we can:

- construct appropriate probabilistic models;

- assess whether a target is attainable under real conditions;

- select more reliable trading scenarios.

The advantages of a probabilistic approach are:

- no need for complex training procedures or large machine-learning models;

- fast calculations based on elementary statistics;

- an adaptive, broadly applicable algorithm based on closing prices, which are available across exchanges and timeframes;

- straightforward implementation in any programming language for automated signal systems;

- easy integration with trading-signal generation algorithms and trading decision-support systems.

The overall assessment of target attainability can be expressed either numerically or on a fuzzy scale. Numerical estimates are convenient for trading algorithms, while fuzzy assessments are easier for experts to interpret.

This makes target-probability estimation a useful tool for both manual analysis and algorithmic trading.

## Useful links

- 🌐 The full signal FAQ and an explanation of FMA methods: [Fuzzy Market Analytics](https://fuzzy-technologies.github.io/FMA/)

- ⚙️ The TKSBrokerAPI platform: [TKSBrokerAPI](https://fuzzy-technologies.github.io/TKSBrokerAPI/)

## Further reading

- [Statistical estimation of the probability of reaching a target price using volatility and returns across timeframes (2025)](https://moitvivt.ru/ru/journal/pdf?id=1905)

- [Fast anomaly detection without complex models: the Hampel method (2025)](/articles/2025-04-16-hampel-anomalies-filtering/)

- [When yes and no are not enough: how fuzzy scales work (2025)](/articles/2025-04-10-fuzzy-scales/)
