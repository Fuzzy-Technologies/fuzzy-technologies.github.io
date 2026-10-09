---
layout: article
math: true
lang: en
title: 'Fast anomaly detection without complex models: the Hampel method'
description: Measurement errors, network failures and price spikes are common. We show how to find these anomalies quickly using the median, MAD and a sliding window, from the basic idea of the Hampel filter to its applications in data analysis and algorithmic trading.
keywords: FMA Research, mathematics, data analysis, fuzzy logic, research archive
date: 2025-04-16
author: Timur & Mansur Gilmullin
series: FMA Research
series_url: /FMA/
permalink: /articles/2025-04-16-hampel-anomalies-filtering/
alternate_en: /articles/2025-04-16-hampel-anomalies-filtering/
alternate_ru: /ru/articles/2025-04-16-hampel-anomalies-filtering/
preview_image: /static/images/articles/2025-04-16-hampel-anomalies-filtering/Girls-and-Hampel.png
preview_text: Measurement errors, network failures and price spikes are common. We show how to find these anomalies quickly using the median, MAD and a sliding window, from the basic idea of the Hampel filter to its applications in data analysis and algorithmic trading.
cover_image: /static/images/articles/2025-04-16-hampel-anomalies-filtering/Girls-and-Hampel.png
source_url: https://teletype.in/@tgilmullin/hampel-anomalies-filtering
---
![Anomalies are everywhere around us!](/static/images/articles/2025-04-16-hampel-anomalies-filtering/Girls-and-Hampel.png)

*Anomalies are everywhere around us!*

When automating numerical data processing in data science, trading and cybersecurity, we often need to identify outliers: anomalous values that disrupt the overall picture. Real data contain them all the time: measurement errors, network failures, occasional price spikes or bursts of market activity. These anomalies distort the analysis, can impair model training and may lead to incorrect conclusions.

Before building complex machine-learning models or making trading decisions, it is important to remove obvious outliers from the data. The Hampel method offers a straightforward way to automate data cleaning and filter anomalies quickly and reliably without complex models. In this article, we explain how it works and how to use it in practice.

## The idea behind Hampel outlier detection

Why do conventional methods struggle with outliers? Numerical sequences are often analysed using the mean and standard deviation, a measure of dispersion. Yet even a single large outlier can substantially shift the mean and increase the dispersion, making the resulting statistics unreliable.

- Example: the sequence [10, 10, 10, 10, 1000].

The mean is 208, even though 4 of the 5 values are 10. This happens because the mean is sensitive to outliers.

To address this, Hampel proposed using a robust statistic: the median, the value that divides an ordered sequence into two halves.

- Example: for [1, 3, 6], the median is 3.

The method also uses the median absolute deviation (MAD): the median of the absolute deviations from the sequence's median.

- Example: for [1, 3, 6], the median is 3, the absolute deviations are [2, 0, 3], and their median is 2. We order the deviations as [0, 2, 3] and take the middle value.

Formally, MAD is defined as:

```math
\mathrm{MAD}(X)=\mathrm{Median}\left(\lvert x_1-\mathrm{Median}(X)\rvert,\ldots,\lvert x_n-\mathrm{Median}(X)\rvert\right)
```

Here, X is a sample of n observations x₁, …, xₙ.

## How the Hampel method works

The basic algorithm is:

1. For each element, take its neighbours within a sliding window—for example, a window of 5 values.

2. Calculate the median and MAD for that window.

3. If the current element's deviation from the median exceeds a threshold, classify it as an outlier. The threshold is usually s × k × MAD, with s = 3 and k ≈ 1.4826 for a normal distribution.

More formally, under the Hampel criterion, an outlier is a value x in a sample X whose absolute deviation from the sample median exceeds the sample MAD multiplied by a distribution-dependent scale factor k, approximately 1.4826 for a normal distribution.

In practice, Hampel filters extend this definition using sliding windows and a threshold parameter s, or sigma, expressed as a number of standard deviations. The median and MAD are calculated for every sliding window of sample values. Each value's absolute deviation from the median is then compared with the MAD multiplied by k and s. A higher threshold s makes the filter less aggressive; a lower threshold identifies more values as outliers.

## Checking whether an element is anomalous

An anomaly in a numerical sequence is a value x in a sequence X whose absolute deviation from the median of a sliding window exceeds s times that window's MAD multiplied by the scale factor k.

All anomalies in the sequence form a subset A:

```math
A=\left\{a\in X:\lvert a-\mathrm{Median}(X_i)\rvert>s\,k\,\mathrm{MAD}(X_i)\right\}
```

Here, a is an anomalous element of X, X is the original sequence, and Xᵢ contains the values in the i-th sliding window. There are (n − w + 1) windows, where w is the window size.

In other words, we look for points that lie unusually far from the local median.

An anomaly filter for a numerical sequence is defined as:

```math
F:X\to\{\mathrm{True},\mathrm{False}\},\qquad F(x_i)=\begin{cases}\mathrm{True},&x_i\in A,\\\mathrm{False},&x_i\notin A.\end{cases}
```

Here, X is the original sequence of n elements xᵢ, and A is the set of anomalies.

In simple terms, we check whether an element is anomalous as follows:

- calculate the typical value—the median—of the neighbouring points;

- compare the current point's distance from the median with the deviations of its neighbours;

- if it is sufficiently far away, classify it as an anomaly.

## How the modified Hampel method works

The Hampel method has been adapted for practical applications:

- sliding windows of a fixed size w provide a local assessment;

- a configurable threshold s specifies how many deviations are acceptable;

- a scale factor k normalises the MAD;

- the method also handles anomalies at the first and last positions of a sequence.

These features are implemented in Python by HampelFilter() and HampelAnomalyDetection(), from the [TradeRoutines](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/tksbrokerapi/TradeRoutines.py) library in the ⚙️[TKSBrokerAPI](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/tree/develop) platform.

## Hampel filter examples

HampelFilter() identifies anomalies according to the definition above. Its configurable parameters are:

- window (w in the equations): the sliding-window size, 5 by default;

- sigma (s): the threshold in standard deviations, 3 by default;

- scaleFactor (k): the distribution-dependent scale factor, 1.4826 by default.

The filter returns a sequence F of True or False values, where True marks an anomalous element at the corresponding position in the input.

For example, in [10, 10, 10, 10, 1000]:

- the median is 10;

- MAD = 0;

- 1000 is an obvious outlier;

- the filter correctly identifies it as an anomaly: F = [False, False, False, False, True]. True in the last position indicates precisely that.

Example inputs and filtering results for HampelFilter(window=5, sigma=3, scaleFactor=1.4826):

```text
Input data                  Function output

[10, 10, 10, 10, 10]        [False, False, False, False, False]
[1, 10, 10, 10, 10]         [True, False, False, False, False]
[1, 5, 10, 10, 10]          [True, True, False, False, False]
[1, 5, 1, 1, 1]             [False, True, False, False, False]
```

Example inputs and filtering results for HampelFilter(window=3, sigma=3, scaleFactor=1.4826):

```text
Input data                  Function output

[1, 5, 1, 1, 1]             [False, True, False, False, False]
[1, 10, 10, 1, 10, 1]       [True, False, False, False, False, False]
[1, 10, 10, 10, 10, 1]      [True, False, False, False, False, True]
[1, 1, 1, 10, 10, 10]       [False, False, False, False, False, False]
```

## Finding the index of the first anomalous element

In practice, we often need only the first anomalous element or the first occurrence of a maximum value in a sequence. HampelAnomalyDetection() serves this purpose. It returns the smallest index among the detected anomalies, or the index of the first maximum in the input if that occurs earlier. If the sequence contains no anomalies, or all its values are equal and there is no distinct maximum, the function returns None.

Put simply, it finds the first suspicious point in the sequence.

Example inputs and results for HampelAnomalyDetection():

```text
Input data                  Function output

[1, 1, 1, 1, 111, 1]        4
[1, 1, 10, 1, 1, 1]         2
[111, 1, 1, 1, 1, 1]        0
[111, 1, 1, 1, 1, 111]      0
[1, 11, 1, 111, 1, 1]       1
[1, 1, 1, 111, 99, 11]      3
[-111, 1, 1, 1, 1]          0
[1, 2, 1, -1, 1]            1
[1]                         None
[1, 2]                      None
[1, 1, 1, 1, 1, 1]          None
```

## Where the Hampel method is used

### Cybersecurity

When monitoring network events, the Hampel method helps detect suspicious spikes in activity without first training a model. This is useful in systems that provide early warnings of potential attacks.

### Data science

The filter helps clean machine-learning training sets by automatically removing outliers that impair the models. This is particularly important when data arrive in real time and may contain input errors, network anomalies or sensor faults.

### Algorithmic trading

The Hampel method is used to filter anomalies in streams of market data: prices, trade volumes and OHLCV candle parameters. This allows accidental outliers—such as occasional price spikes caused by broker errors or spurious volume surges—to be removed automatically before the signals reach the trading algorithm. Filtering helps a trading robot avoid false entries and reduces erroneous trades.

The method is used in real time for fast quote-stream preprocessing, preparing data for target-reaching probability estimates, and removing anomalies before generating trading signals.

In our trading-automation and signal-generation project, it serves as a basic filter:

- removing accidental price outliers and finding anomalies in the order book;

- cleaning historical data used to estimate the probability of reaching targets;

- helping algorithms behave more robustly under real market conditions.

![Modified Hampel filtering of anomalous OHLCV candles and anomaly detection in the order book](/static/images/articles/2025-04-16-hampel-anomalies-filtering/Hampel-Filtering-and-Order-Book.png)

*Modified Hampel filtering of anomalous OHLCV candles and anomaly detection in the order book*

The modified Hampel method is therefore a simple, effective tool for fast anomaly detection in real numerical sequences. It is an established data-processing technique that provides a reliable foundation for more complex processing. It is straightforward to implement, its sensitivity is easy to adjust, and it can be adapted and scaled to large datasets. This makes it a useful choice for automated market-price analysis, time-series processing and predictive analytics without building complex forecasting models.

The Hampel method does not replace machine learning; it is a basic filter that improves the data supplied to models. Its use can substantially improve the quality of automated analysis and the accuracy of anomaly detection.

## Useful links

- 🌐 The full signal FAQ and an explanation of FMA methods: [Fuzzy Market Analytics](https://fuzzy-technologies.github.io/FMA/)

- ⚙️ The TKSBrokerAPI platform: [TKSBrokerAPI](https://fuzzy-technologies.github.io/TKSBrokerAPI/)

## Further reading

- [Fast anomaly detection in numerical sequences with a modified Hampel filter (2023)](https://moitvivt.ru/ru/journal/pdf?id=1482).

- [Research notebook on Kaggle (2023)](https://www.kaggle.com/code/timurgilmullin/how-to-quickly-find-anomalies-in-number-series).

- [PriceGenerator: a synthetic market-data generator](https://github.com/Fuzzy-Technologies/PriceGenerator).

- [A Jupyter Notebook laboratory exercise on Hampel anomaly filtering](https://nbviewer.org/github/Tim55667757/TKSBrokerAPI/blob/develop/docs/examples/HampelFilteringExample.ipynb).

- [The Hampel anomaly-filtering implementation in the ⚙️ TKSBrokerAPI library](https://fuzzy-technologies.github.io/TKSBrokerAPI/docs/tksbrokerapi/TradeRoutines.html).
