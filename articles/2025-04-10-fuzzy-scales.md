---
layout: article
math: true
lang: en
title: 'When yes and no are not enough: how fuzzy scales work'
description: How do you assess a system that is mostly secure, with a moderate level of risk? We explain fuzzy measurement scales, membership functions and transitions between levels, using examples from cybersecurity, data analysis and trading-signal assessment.
keywords: FMA Research, mathematics, data analysis, fuzzy logic, research archive
date: 2025-04-10
author: Timur & Mansur Gilmullin
series: FMA Research
series_url: /FMA/
permalink: /articles/2025-04-10-fuzzy-scales/
alternate_en: /articles/2025-04-10-fuzzy-scales/
alternate_ru: /ru/articles/2025-04-10-fuzzy-scales/
preview_image: /static/images/articles/2025-04-10-fuzzy-scales/Girls-and-scales.png
preview_text: How do you assess a system that is mostly secure, with a moderate level of risk? We explain fuzzy measurement scales, membership functions and transitions between levels, using examples from cybersecurity, data analysis and trading-signal assessment.
cover_image: /static/images/articles/2025-04-10-fuzzy-scales/Girls-and-scales.png
source_url: https://teletype.in/@tgilmullin/fuzzy-scales
---
![A moment of philosophy: judging the girls' beauty is a kind of fuzzy assessment, too](/static/images/articles/2025-04-10-fuzzy-scales/Girls-and-scales.png)

*A moment of philosophy: judging the girls' beauty is a kind of fuzzy assessment, too*

When automating processes—whether assessing security threats, analysing data or evaluating financial risk in trading—we constantly deal with incomplete, missing or imprecise information. We often have to make decisions when the data are contradictory or insufficiently precise. In such situations, a simple yes/no scale or a score from 0 to 1 becomes inadequate.

Fuzzy measurement scales help us handle uncertainty and build reliable signalling and decision-making systems. In this article, we will briefly explain what they are, why we need them and what they look like in practice.

## Why ordinary scales fall short

A typical scale is a set of numbers, usually non-negative integers. For example: {0, 1}.

If we use this scale to assess security, we might interpret zero as insecure and one as fully secure. If needed, we can extend it to 0, 1, 2, 3, 4, ... N and ask an expert to choose one number to describe the security level.

In practice, however, there are plenty of intermediate states:

- What if a system is mostly secure but fails in certain situations?

- How do we assess an asset that looks promising, but without complete confidence?

Many real-world characteristics are vague and gradual rather than fixed. An ordinary scale demands a definite number, while real situations call for flexibility.

## What is a desirability scale?

There is a special class of scales known as qualitative scales. These usually divide the interval [0, 1] into levels, each described by a word that makes sense to the assessing expert. Examples include a high or low level, or good or poor quality for a particular property of the object being assessed.

A well-known qualitative scale for intermediate degrees of quality on [0, 1] is Harrington's desirability scale. It is a psychophysical scale that relates physical properties of an object to experts' subjective judgements about how desirable particular values of those properties are.

![Harrington's desirability scale and its desirability function](/static/images/articles/2025-04-10-fuzzy-scales/Harrington_scale_en.png)

*Harrington's desirability scale for assessing degrees of quality on [0, 1]. It is defined over [−3, 5] by the desirability function d(y) = exp(−exp(−y)). The function arose from observations of how experts preferred to map experimental results onto values in [0, 1]. It supports preference assessments for objects with different dimensions and properties. Its sensitivity near 0 and 1 is substantially lower than in the middle of the range. The values 0.37 and 0.63 are convenient for calculation because 0.37 ≈ e⁻¹ and 0.63 ≈ 1 − e⁻¹. The inflection point is usually taken as the reference: d(0) ≈ 0.37. The boundaries between desirability levels may vary by ±0.03*

## How a fuzzy scale works

A fuzzy scale describes a property through a range of values with different degrees of membership, rather than through a single category. For example, a reliability assessment can belong to the high level with a degree of 80% and to the medium level with a degree of 20% at the same time.

The transitions between levels are gradual rather than sharply defined.

A membership function associates each possible assessment value with a degree of membership. It shows how strongly that value belongs to each level.

For example, on a chosen scale, water at 50 °C might have a membership degree of 0.7 in hot and 0.3 in warm. These are degrees of membership in fuzzy sets, not probabilities.

This approach helps an expert make more robust decisions in real conditions, where most of the quantities involved are imprecisely defined.

## Examples of membership functions

Common choices include:

- hyperbolic functions, which provide a gradual increase;

- parabolic functions, which produce a sharper change in the middle;

- bell-shaped functions, which peak at the centre of the scale;

- triangular functions, which have a precisely located peak.

![Hyperbolic, parabolic, bell-shaped and triangular membership functions](/static/images/articles/2025-04-10-fuzzy-scales/mju_graphs.png)

*Examples of parameterised membership functions: 1 — hyperbolic: μ_hyperbolic(x; 3; 5; 0.1); 2 — parabolic: μ_parabolic(x; 0; 1); 3 — bell-shaped: μ_bell(x; 0; 0.3; 0.4); 4 — triangular: μ_triangle(x; 0.25; 0.5; 0.75)*

An expert chooses the function's shape according to the problem: some applications need gradual changes, others sharper transitions.

## Defining a simple fuzzy scale

Suppose we need to assess the probability that a trading signal succeeds: will the price reach its target? How the target was obtained does not matter here. It might come from an external forecast based on technical or fundamental analysis, or from an expert judgement without a formal derivation.

To construct a scale:

1. Define the measurement range. For example, all numbers from 0 to 1.

2. Choose the scale's levels. A common general-purpose scale uses {Min, Low, Med, High, Max}. Here, Min represents the minimum probability of reaching the price target, Low a low probability, Med a medium one, High a high one and Max the maximum. These labels let us express the assessment without long fractional values while keeping it understandable to a human expert.

3. Construct the membership functions. Triangular or bell-shaped functions are convenient starting points.

4. Define the overlaps. For example, a value of 0.5 might belong to Med with a degree of 80% and to High with a degree of 20%.

5. Test the scale on real data. Check whether the numerical assessments and their mapping onto the fuzzy scale meet our needs.

![A crisp scale and its corresponding fuzzy measurement scale](/static/images/articles/2025-04-10-fuzzy-scales/scales.png)

*A crisp scale [0, 1] and its corresponding general-purpose fuzzy measurement scale: Min — minimum, Low — low, Med — medium, High — high, Max — maximum*

## Where fuzzy scales are used

Fuzzy scales have applications across scientific disciplines and practical systems.

- Analysing anomalies in market data: assessing deviations without rigid thresholds.

- Trading-signal systems: estimating the probability of reaching price targets.

- Automated decision-making: deriving an overall assessment from several contributing factors.

- Assessing operational risk: balancing the precision of the data against their reliability.

- Expert assessment: describing an object's characteristics in language a person can understand, rather than as long decimal values.

## Fuzzy scales in cybersecurity

In cybersecurity, fuzzy scales help assess threat levels when the signs of an attack are vague or ambiguous. This improves the detection of complex attacks, reduces false positives and helps security systems remain robust even when information is incomplete.

## Fuzzy scales in data analysis

In data science, fuzzy scales help us work with noisy or incomplete datasets. They support models that can make decisions in the presence of noise and ambiguity, rather than relying solely on precise labels. This is particularly important with real data, which are rarely perfectly structured.

## Fuzzy scales in trading services

When developing an automated signal service or an algorithmic trading robot, you cannot rely on crisp metrics alone: the market offers no 100% guarantees. Fuzzy scales let an expert account for uncertainty and make more considered decisions, minimising false signals and avoiding unnecessary overconfidence.

Fuzzy scales therefore offer a way to teach a system to reason approximately, as a person does when faced with incomplete information. This is essential when building reliable algorithms for security systems, data analysis and algorithmic trading.

## Useful links

- 🌐 The full signal FAQ and an explanation of FMA methods: [Fuzzy Market Analytics](https://fuzzy-technologies.github.io/FMA/)

- ⚙️ The TKSBrokerAPI platform: [TKSBrokerAPI](https://fuzzy-technologies.github.io/TKSBrokerAPI/)

P. S. If you would like to see how fuzzy scales are applied in cybersecurity, take a look at these articles:

- [Approaches to automating the validation of vulnerabilities found by automated security scanners using fuzzy sets and neural networks (2014)](https://s.fundamental-research.ru/pdf/2014/11-2/35511.pdf)

- [Security scanners: automated vulnerability validation using fuzzy sets and neural networks (2014)](https://habr.com/ru/companies/pt/articles/246197/)

- [Security scanners: automated vulnerability classification (2015)](https://habr.com/ru/companies/pt/articles/274241/)

- [How we analyse vulnerabilities using neural networks and fuzzy logic (2017)](https://habr.com/ru/companies/pt/articles/323436/)
