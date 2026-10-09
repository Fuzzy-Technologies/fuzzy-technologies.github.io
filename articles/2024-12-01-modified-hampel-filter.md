---
layout: article
math: true
lang: en
title: Fast anomaly detection in numerical sequences with a modified Hampel filter
description: 'What makes a value anomalous, and how do we detect it? We examine a modified Hampel filter: the robustness of the median, MAD, sliding windows and threshold selection. With formal definitions, Python examples and an experiment using synthetic market data.'
keywords: FMA Research, mathematics, data analysis, fuzzy logic, research archive
date: 2024-12-01
author: Timur & Mansur Gilmullin
series: FMA Research
series_url: /FMA/
permalink: /articles/2024-12-01-modified-hampel-filter/
alternate_en: /articles/2024-12-01-modified-hampel-filter/
alternate_ru: /ru/articles/2024-12-01-modified-hampel-filter/
preview_image: /static/images/articles/2024-12-01-modified-hampel-filter/digest-robot-1200x630.png
preview_text: 'What makes a value anomalous, and how do we detect it? We examine a modified Hampel filter: the robustness of the median, MAD, sliding windows and threshold selection. With formal definitions, Python examples and an experiment using synthetic market data.'
cover_image: /static/images/articles/2024-12-01-modified-hampel-filter/digest-robot-1200x630.png
source_url: https://teletype.in/@tgilmullin/anomaly
---
## Abstract

This article examines and formally defines an anomaly in a numerical sequence and an anomaly-filtering function. The work is motivated by the lack of a unified approach to defining an anomaly. At the same time, this concept plays a key role in solving many practical problems.

We assess the robustness of a chosen statistical estimator to outliers using breakdown points and sliding windows. The proposed approach to detecting outliers in a numerical sequence combines the median and the median absolute deviation. We introduce a modification of the Hampel method for identifying sample outliers across a broad range of IT automation tasks.

We have developed Python functions to detect anomalies in a numerical sequence and identify the index of its first anomalous element. As a practical example, a Jupyter Notebook demonstrates fast anomaly detection in market prices using the modified Hampel method.

We use our own library for generating synthetic market data to obtain a sample containing outliers. The experimental results show that the proposed algorithms reliably identify anomalies across different parameter settings.

We discuss the method's advantages and limitations. The Hampel filter is well suited to optimisation and parallelisation. The material has practical applications in automating anomaly detection in numerical sequences.

## Introduction

Many practical problems require us to find anomalies in numerical sequences. Put simply, these are values that differ in some respect from most of the other numbers in a sequence: outliers, unusual values or departures from the norm. Such problems arise in many fields:

- cleaning noisy data in [data science](https://en.wikipedia.org/wiki/Data_science);

- filtering outliers from neural-network training sets in [machine learning](https://en.wikipedia.org/wiki/Machine_learning);

- detecting anomalous network attack activity when monitoring traffic and events in [cybersecurity](https://en.wikipedia.org/wiki/Cyber_security);

- identifying outliers or extreme values in streams of market data in [algorithmic trading](https://en.wikipedia.org/wiki/Algorithmic_trading);

- and any other anomaly-detection problem in which the data can be represented as a numerical sequence.

The term numerical series has different meanings in mathematical analysis and statistics. Here, we use its statistical meaning: a finite sequence of numbers, analogous to a sample.

There are various interpretations of anomalies in numerical sequences. Much of the literature deals with time series [[1](#reference-1), [2](#reference-2), [3](#reference-3), [4](#reference-4)]. A time series is a collection of observations of a process variable recorded at different times. Anomalies are then defined as data patterns that do not conform to an expected, clearly defined notion of normal behaviour. What counts as normal or abnormal can change over time.

Various prediction-based methods are used to detect anomalies, including statistical approaches and neural networks [[1](#reference-1)].

Individual studies use different measures of how anomalous an observation is. Some address anomaly detection through ensembles of algorithms: combining methods whose different errors can compensate for one another [[2](#reference-2)].

Anomaly detection is often treated as an unsupervised learning problem. Time-series analysis is commonly understood as the application of statistical and machine-learning methods to identify patterns in a series and predict the future behaviour of the system it describes [[3](#reference-3)].

One application of anomalies is their use as diagnostic indicators [[4](#reference-4)]. Different fields use different terms: anomalies, outliers, discordant observations, exceptions, aberrations, surprises, peculiarities or contaminants [[5](#reference-5)]. The lack of a unified interpretation of an anomaly therefore motivates this work.

Some of these approaches were brought together in [[6](#reference-6), [7](#reference-7)]. We developed our own definition of an anomaly suitable for practical use across a wide range of problems. We will also define and implement a configurable anomaly filter that is as independent as possible of the particular application [[8](#reference-8)].

The following sections use market data to demonstrate how to find anomalies in numerical sequences quickly and efficiently with a modification of F. R. Hampel's method [[9](#reference-9), [10](#reference-10)].

## Theory

Outlier assessment for univariate data has been studied extensively in the statistical literature. The [sample mean](https://en.wikipedia.org/wiki/Sample_mean_and_covariance) and [sample variance](https://en.wikipedia.org/wiki/Variance) are traditionally among the most useful statistics for characterising data. They provide useful estimates of location and dispersion, provided the sample is not contaminated by outliers. Even a single observation that differs substantially from the others can cause the sample mean to deviate considerably from the mean calculated without that outlier.

To measure an estimator's robustness to outliers, Hampel introduced the concept of the [breakdown point](https://en.wikipedia.org/wiki/Robust_statistics#Breakdown_point). For a location estimator, the finite-sample replacement breakdown point is the smallest fraction of observations that can be replaced by arbitrary values to make the estimate unbounded. Such contamination may include arbitrarily large aberrant values [[6](#reference-6)].

Intuitively, 50% is the limiting robustness barrier for location estimation: if more than half the observations are contaminated, we cannot distinguish the underlying distribution from the contaminating one. The maximum asymptotic breakdown point is therefore 0.5. Some statistics attain this maximum. For example, the [median](https://en.wikipedia.org/wiki/Median) has a finite-sample breakdown point approaching 0.5, whereas the sample mean has a breakdown point of 1/n, where n is the sample size.

In general, a higher breakdown point means greater resistance to contamination. A statistic with a high breakdown point is described as robust.

For more reliable estimates of sample location and dispersion, a common recommendation is to combine the median with the [median absolute deviation](https://en.wikipedia.org/wiki/Median_absolute_deviation), or MAD. These two statistics form the basis of Hampel outlier filtering.

MAD is calculated as follows:

```math
\mathrm{MAD}(X)=\mathrm{Median}\left(\lvert x_1-\mathrm{Median}(X)\rvert,\ldots,\lvert x_n-\mathrm{Median}(X)\rvert\right)\qquad\text{(1)}
```

Here, X is a sample of n observations x₁, …, xₙ.

Under the Hampel criterion, an [outlier](https://en.wikipedia.org/wiki/Outlier) is a value x in a sample X whose absolute deviation from the sample median exceeds the MAD in equation (1), multiplied by a distribution-dependent [scale factor k](https://en.wikipedia.org/wiki/Scale_parameter#Estimation), approximately 1.4826 for a normal distribution [[7](#reference-7)].

In practical Hampel filters, this definition is extended using [sliding windows](https://www.geeksforgeeks.org/dsa/window-sliding-technique/) and a [threshold multiplier s](https://en.wikipedia.org/wiki/Standard_deviation), expressed in units of the robust standard-deviation estimate k × MAD. The median and MAD are calculated for each sliding window of sample values. Each value's absolute deviation from the median is then compared with the MAD multiplied by both k and s [[8](#reference-8)].

A higher threshold s makes the filter less aggressive, while a lower threshold identifies more values as outliers.

We can now define the central concept: an anomaly in a finite numerical sequence for practical applications.

Definition 1. An anomaly in a numerical sequence is a value a in a sequence X whose absolute deviation from the median of a sliding window exceeds s times the window's MAD multiplied by the scale factor k.

To make the filter as general and application-independent as possible, we propose the following set-theoretic interpretation.

By Definition 1, all anomalies in the sequence form a subset A:

```math
A=\left\{a\in X:\lvert a-\mathrm{Median}(W_i)\rvert>s\,k\,\mathrm{MAD}(W_i)\right\}\qquad\text{(2)}
```

Here, X is the original numerical sequence, Wᵢ contains the values in the i-th sliding window, and the total number of windows is (n − w + 1), where w is the window size.

Definition 2. An anomaly filter for a numerical sequence is the function:

```math
F:X\to\{\mathrm{True},\mathrm{False}\},\qquad F(x_i)=\begin{cases}\mathrm{True},&x_i\in A,\\\mathrm{False},&x_i\notin A.\end{cases}\qquad\text{(3)}
```

Here, X is the original sequence of n elements xᵢ, and A is the anomaly set defined in (2).

To detect anomalies in numerical sequences, we propose our Python implementation of [HampelFilter()](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/tksbrokerapi/TradeRoutines.py). It applies the modified Hampel method to identify anomalies among the values of a numerical sequence. The filter detects all anomalies defined by expression (2).

Its configurable parameters are:

- window (w in the equations): the sliding-window size, 5 by default;

- sigma (s): the multiplier applied to the robust standard-deviation estimate, 3 by default;

- scaleFactor (k): the distribution-dependent scale factor, 1.4826 by default.

As specified in expression (3), HampelFilter() returns a sequence F of True or False values, where True marks the position of an anomalous element in the original sequence.

In practice, we often need only the first anomalous element or the first occurrence of a maximum value. For this purpose, we propose our Python implementation of [HampelAnomalyDetection()](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/tksbrokerapi/TradeRoutines.py). It returns the smallest index among detected anomalies, or the index of the first maximum in the input sequence if that occurs earlier. If the sequence contains no anomalies, or all its values are equal and no distinct maximum exists, it returns None.

## Examples

Concrete numerical examples make it easier to understand how HampelFilter() works and what it considers an anomaly. We will present them as Python scripts.

First, consider filtering with the default parameter values.

HampelFilter(window=5, sigma=3, scaleFactor=1.4826):

```python
import pandas as pd
from tksbrokerapi.TradeRoutines import HampelFilter

testData1 = [
    # All values are equal, with no
    # suspicious observations, so there
    # should be no anomalies:
    pd.Series([10, 10, 10, 10, 10]),

    # The first value clearly differs
    # from the others, so it is anomalous:
    pd.Series([1, 10, 10, 10, 10]),

    # Most values in this sequence are 10;
    # the first two stand out from the rest,
    # so both are anomalous:
    pd.Series([1, 5, 10, 10, 10]),

    # As in the second example,
    # the second value is anomalous because
    # it differs from most of the sequence:
    pd.Series([1, 5, 1, 1, 1]),
]

for i, test in enumerate(testData1):
    print("Input {}: {}".format(i + 1, list(test)))
    print("--> {}".format(list(HampelFilter(test))))
```

To check our expectations about which values are anomalous, we run the code above and obtain the expected result:

```text
>>> Input 1: [10, 10, 10, 10, 10]
>>> --> [False, False, False, False, False]
>>> Input 2: [1, 10, 10, 10, 10]
>>> --> [True, False, False, False, False]
>>> Input 3: [1, 5, 10, 10, 10]
>>> --> [True, True, False, False, False]
>>> Input 4: [1, 5, 1, 1, 1]
>>> --> [False, True, False, False, False]
```

The default window size is 5, which matches the length of the sequences in this example. Let us reduce it to 3, first using the same sequences and then adding new ones.

HampelFilter(window=3, sigma=3, scaleFactor=1.4826):

```python
testData2 = [
    # The result should not change
    # because there are no anomalies:
    pd.Series([10, 10, 10, 10, 10]),

    # No change: there is
    # one anomalous element:
    pd.Series([1, 10, 10, 10, 10]),

    # Here the first values should no longer
    # be classified as anomalies at sigma = 3:
    pd.Series([1, 5, 10, 10, 10]),

    # No change: there is one
    # clearly anomalous element:
    pd.Series([1, 5, 1, 1, 1]),

    # Additional numerical sequences:
    pd.Series([1, 10, 10, 1, 10, 1]),
    pd.Series([1, 10, 10, 10, 10, 1]),
    pd.Series([1, 1, 1, 10, 10, 10]),
]

for i, test in enumerate(testData2):
    print("Input {}: {}".format(i + 1, list(test)))
    print("--> {}".format(list(HampelFilter(test, window=3))))
```

Running the code above produces:

```text
>>> Input 1: [10, 10, 10, 10, 10]
>>> --> [False, False, False, False, False]
>>> Input 2: [1, 10, 10, 10, 10]
>>> --> [True, False, False, False, False]
>>> Input 3: [1, 5, 10, 10, 10]
>>> --> [False, False, False, False, False]
>>> Input 4: [1, 5, 1, 1, 1]
>>> --> [False, True, False, False, False]
>>> Input 5: [1, 10, 10, 1, 10, 1]
>>> --> [True, False, False, False, False, False]
>>> Input 6: [1, 10, 10, 10, 10, 1]
>>> --> [True, False, False, False, False, True]
>>> Input 7: [1, 1, 1, 10, 10, 10]
>>> --> [False, False, False, False, False, False]
```

The first, second and fourth sequences give the same results as before. Notice the third sequence. Its first two values, previously identified as anomalies, are now ignored. This follows directly from equations (1) and (2).

Similarly, only one anomalous element is found in the fifth sequence, although at first glance we might expect more. The small sliding window also prevents the filter from detecting anomalies in the seventh sequence.

To understand HampelAnomalyDetection(), consider a few more examples. An important difference from HampelFilter() is that this function also takes into account the presence and position of maximum values.

HampelAnomalyDetection(), with default parameters:

```python
import pandas as pd
from tksbrokerapi.TradeRoutines import HampelAnomalyDetection

testData3 = [
    pd.Series([1, 1, 1, 1, 111, 1]),
    pd.Series([1, 1, 10, 1, 1, 1]),
    pd.Series([111, 1, 1, 1, 1, 111]),
    pd.Series([1, 11, 1, 111, 1, 1]),
    pd.Series([1, 2]),
    pd.Series([1, 1, 1, 1, 1, 1]),
]

for i, test in enumerate(testData3):
    print("Input {}: {}".format(i + 1, list(test)))
    print("--> {}".format(HampelAnomalyDetection(test)))
```

Running the code above produces:

```text
>>> Input 1: [1, 1, 1, 1, 111, 1] --> 4
>>> Input 2: [1, 1, 10, 1, 1, 1] --> 2
>>> Input 3: [111, 1, 1, 1, 1, 111] --> 0
>>> Input 4: [1, 11, 1, 111, 1, 1] --> 1
>>> Input 5: [1, 2] --> None
>>> Input 6: [1, 1, 1, 1, 1, 1] --> None
```

## Practical application

To interpret the results, let us apply Hampel filtering to a practical problem: detecting anomalies in a sequence of market prices. To obtain a sequence containing outliers, we will use our synthetic market-data library, [PriceGenerator](https://github.com/Fuzzy-Technologies/PriceGenerator/blob/master/README_RU.md).

Traders and market analysts commonly represent prices as a time series of OHLCV candlesticks: open, high, low, close and volume, also known as Japanese candlesticks. Each row contains the data for one candle: its opening timestamp, opening price, highest price, lowest price, closing price for the interval, and trading volume over that interval.

PriceGenerator can be used as a Python module or run from the command line to generate random price data that resemble real prices while having predefined statistical properties. Its settings include the overall price trend, candle timeframe, minimum and maximum prices, maximum candle size, the probability of the next candle's direction, the probability of price outliers, the number of candles to generate and many other parameters.

For this experiment, we developed [HampelFilteringExample](https://nbviewer.org/github/Tim55667757/TKSBrokerAPI/blob/develop/docs/examples/HampelFilteringExample.ipynb), a Jupyter Notebook demonstrating fast anomaly detection in market prices with HampelFilter(), our modified Hampel filter.

The notebook generates a price series with the following properties:

- integer prices only, for simplicity;

- candle interval: 1 day; generation horizon: 75 candles;

- minimum and maximum closing prices: 40 and 140;

- initial closing price: 50;

- maximum candle-wick outlier: 35;

- maximum candle body size: 25;

- probability that the next candle closes higher than it opens: 51.5%;

- probability that the next candle contains an outlier: 10%;

- overall trend: initially downwards for 40 candles, then upwards for 35 candles.

To obtain these properties, run PriceGenerator with the following parameters:

```bash
PriceGenerator --debug-level 10 --ticker "TEST_DATA_OF_OHLCV" --precision 0 --timeframe 1440 --horizon 75 --max-close 140 --min-close 40 --init-close 50 --max-outlier 35 --max-body 25 --max-volume 4000000 --up-candles-prob 0.515 --outliers-prob 0.1 --trend-deviation 0.005 --split-trend "down-up" --split-count 40 35 --generate --render-google index.html
```

The generated OHLCV candles are stored in a pandas DataFrame and are ready for further analysis in Python.

To examine the series produced by PriceGenerator, we generate a static or interactive chart and automatically calculate several descriptive statistics, as shown in Figure 1.

![Figure 1 — A candlestick series generated with PriceGenerator](/static/images/articles/2024-12-01-modified-hampel-filter/1-Hampel-Data-overview.png)

*Figure 1 — A candlestick series generated with PriceGenerator*

The price chart clearly shows outliers above and below some candles. We are interested in a particular subset: excessively long wicks, also called shadows, or unusually large candle bodies.

We then use standard pandas operations to remove unnecessary fields from the OHLCV DataFrame, retaining only the price columns. From the OHLCV values, we calculate:

- candle body size: body = |close − open|;

- upper wick: upper = high − max(open, close);

- lower wick: lower = min(open, close) − low.

These calculations turn the potentially anomalous features previously identified by eye into numerical sequences stored in the DataFrame. We can then apply HampelFilter() to those sequences.

Let us see how the modified Hampel filter detects anomalous price excursions and candle sizes with its default parameters: window = 5, sigma = 3, scaleFactor = 1.4826.

As the examples above showed, both very small and very large values can be classified as anomalies relative to the other values in the sliding window. We mark anomalous candles with ⮾, lower wicks with ↑ and upper wicks with ↓, and examine the results in Figure 2.

![Figure 2 — Filtering results with default parameters](/static/images/articles/2024-12-01-modified-hampel-filter/2-Hampel-Detect-Anomalies-Default-Parameters.png)

*Figure 2 — Filtering results with default parameters*

At first glance, the filter appears to have worked well: anomalies have been found and marked. However, the results may be puzzling to someone unaware of the small sliding-window size. Some marked elements appear unnecessary. Let us expand the window to cover the entire series—window = 75 in this example—and detect anomalies again, as shown in Figure 3.

![Figure 3 — Filtering results after expanding the sliding window](/static/images/articles/2024-12-01-modified-hampel-filter/3-Hampel-Detect-Anomalies-Custom-Parameters.png)

*Figure 3 — Filtering results after expanding the sliding window*

The chart now marks only those elements that most observers considering the whole picture would probably identify as anomalies relative to the other values in the visible series.

## Conclusion

The Hampel method does have limitations. For example, when implementing the original algorithm, anomalies at the first or last position in a sequence may be ignored. This is a consequence of using a sliding window. To handle these boundary cases in our implementation of HampelFilter(), we first had to extend the sequence at both ends by the window size. Only then could we detect anomalies at the beginning and end of the original sequence as well.

In practice, however, the Hampel filter is highly effective. With modern libraries such as [pandas](https://pandas.pydata.org/), it can process sequences containing tens of thousands of elements in seconds and is amenable to optimisation and parallelisation—for example, using [CUDA Python](https://developer.nvidia.com/cuda/python) and Numba's [@cuda.jit](https://numba.readthedocs.io/en/stable/user/jit.html#compiling-python-code-with-jit) decorator, or a [Python multiprocessing ThreadPool](https://superfastpython.com/threadpool-python/).

The modified Hampel filter therefore provides an effective solution to anomaly detection in numerical sequences. It produces results quickly and is straightforward to understand and implement.

## References

1. <span id="reference-1"></span> Laxman S., Sastry P.S. A survey of temporal data mining. Sadhana. 2006;31:173–198. DOI: [10.1007/BF02719780](https://doi.org/10.1007/BF02719780).

2. <span id="reference-2"></span> Chesnokov M.Yu. [Anomaly detection in time series using ensembles of DBSCAN4 algorithms](http://www.isa.ru/aidt/images/documents/2018-01/99-107.pdf). Moscow; 2018. (In Russian; accessed 1 October 2023).

3. <span id="reference-3"></span> Mastitsky S.E. [Time series analysis with R](https://ranalytics.github.io/tsa-with-r/ch-anomaly-detection.html); 2020. (In Russian; accessed 1 October 2023).

4. <span id="reference-4"></span> Vlad Ardelean. [Outliers in Time Series](https://www.statistik.rw.fau.de/files/2016/03/v01-2011.pdf). Department of Statistics and Econometrics, University of Erlangen-Nuremberg; 2011. (Accessed 1 October 2023).

5. <span id="reference-5"></span> Varun Chandola, Arindam Banerjee, Vipin Kumar. [Anomaly Detection: A Survey](https://cucis.ece.northwestern.edu/projects/DMS/publications/AnomalyDetection.pdf), ACM Computing Surveys; 2009. (Accessed 1 October 2023).

6. <span id="reference-6"></span> Hampel F.R. The Influence Curve and Its Role in Robust Estimation. Journal of the American Statistical Association. 1974;69:383–393. DOI: [10.2307/2285666](https://doi.org/10.2307/2285666).

7. <span id="reference-7"></span> Hancong Liu, Sirish Shah and Wei Jiang. [On-line outlier detection and data cleaning](https://sites.ualberta.ca/~slshah/files/on_line_outlier_det.pdf). Computers & Chemical Engineering. 2004;28(9):1635–1647. (Accessed 1 October 2023).

8. <span id="reference-8"></span> Lewinson E. Python for Finance Cookbook — Second Edition. Birmingham, Packt; 2022. 740 p.

9. <span id="reference-9"></span> Hampel F.R. A General Qualitative Definition of Robustness. Ann. Math. Stat. 1971;42:1887–1896.

10. <span id="reference-10"></span> Hampel F.R., Ronchetti E.M., Rousseeuw P.J., Stahel W.A. Robust Statistics: The Approach Based on Influence Functions. New York, Wiley & Sons; 1986. 536 p.

## Links

- [Article in the journal Modelling, Optimization and Information Technology](https://moitvivt.ru/ru/journal/pdf?id=1482). DOI: 10.26102/2310-6018/2023.43.4.030
  - [English translation](https://math-n-algo.blogspot.com/2023/01/how-to-quickly-find-anomalies-in-number.html)

- Jupyter Notebooks covering the theory and practical examples:
  - [Russian](https://nbviewer.org/github/Tim55667757/TKSBrokerAPI/blob/develop/docs/examples/HampelFilteringExample.ipynb)
  - [English](https://www.kaggle.com/code/timurgilmullin/how-to-quickly-find-anomalies-in-number-series)

- [Test script demonstrating modified Hampel filtering of anomalies in an OHLCV candlestick time series](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/docs/examples/TestAnomalyFilter.py)

- [TKSBrokerAPI: a Python platform for automating exchange trading](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/README.md)

- [PriceGenerator: a Python platform for generating time series resembling random market prices with anomalies](https://github.com/Fuzzy-Technologies/PriceGenerator/blob/master/README_RU.md)

- Function implementations:
  - [HampelFilter(): detecting anomalies in a numerical sequence](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/tksbrokerapi/TradeRoutines.py)
  - [HampelAnomalyDetection(): finding the index of the first anomalous element](https://github.com/Fuzzy-Technologies/TKSBrokerAPI/blob/develop/tksbrokerapi/TradeRoutines.py)
