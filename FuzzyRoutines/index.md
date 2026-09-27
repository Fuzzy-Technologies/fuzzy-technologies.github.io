---
layout: default
lang: en
title: FuzzyRoutines — Fuzzy computing for Python
description: FuzzyRoutines is an open-source Python library for membership functions, fuzzy sets, fuzzy scales, defuzzification, and fuzzy-logic operators.
keywords: FuzzyRoutines, Python, fuzzy logic, fuzzy sets, membership functions, fuzzy scales, defuzzification, scientific computing, open source
permalink: /FuzzyRoutines/
alternate_en: /FuzzyRoutines/
alternate_ru: /ru/FuzzyRoutines/
alternate_zh: /zh-cn/FuzzyRoutines/
---

<header class="site-header">
  <h1 class="site-title"><a href="/FuzzyRoutines/">🧮 FuzzyRoutines</a></h1>
  <div class="site-actions">
    <nav class="language-switch" aria-label="Language">
      <span class="active" aria-current="page">EN</span>
      <a href="/ru/FuzzyRoutines/" lang="ru">RU</a>
      <a href="/zh-cn/FuzzyRoutines/" lang="zh-CN">简中</a>
    </nav>
    <a class="brand-button" href="/" aria-label="Back to Fuzzy Technologies">
      <img src="/static/images/FuzzyTechnologies-Logo-transp.png" alt="Fuzzy Technologies" />
    </a>
  </div>
</header>

<section>
  <p class="eyebrow">Open Source · Python · Fuzzy Mathematics</p>
  <p class="hero-lead"><strong>FuzzyRoutines</strong> is a compact Python library for explicit, inspectable fuzzy calculations.</p>
  <p>It provides mathematical building blocks for membership functions, fuzzy sets, linguistic scales, defuzzification, and common fuzzy-logic operators. The project is intended for research, education, expert systems, and engineering prototypes where the calculation path should remain understandable.</p>
  <div class="hero-actions">
    <a class="button-neon" href="https://github.com/Fuzzy-Technologies/FuzzyRoutines">GitHub</a>
    <a class="button-neon" href="https://pypi.org/project/fuzzyroutines/">PyPI</a>
  </div>
</section>

## Core capabilities

<div class="direction-grid">
  <section class="direction-card">
    <h3>Membership functions</h3>
    <p>Hyperbolic, bell, parabolic, triangular, exponential, sigmoidal, desirability, and trapezoidal membership functions with explicit parameters.</p>
  </section>
  <section class="direction-card">
    <h3>Fuzzy sets and defuzzification</h3>
    <p>Fuzzy sets combine a membership function with a support interval and expose a numerical defuzzification result.</p>
  </section>
  <section class="direction-card">
    <h3>Linguistic scales</h3>
    <p>Build ordered fuzzy scales or use the predefined Min–Low–Med–High–Max universal scale to interpret normalized values.</p>
  </section>
  <section class="direction-card">
    <h3>Fuzzy operators</h3>
    <p>Fuzzy NOT, AND/OR, T-norms, S-conorms, and composition helpers for more than two fuzzy values.</p>
  </section>
</div>

## Install and try it

Install the published package from PyPI:

```bash
pip install fuzzyroutines
```

Create a universal fuzzy scale and classify a normalized value:

```python
from fuzzyroutines.FuzzyRoutines import UniversalFuzzyScale

scale = UniversalFuzzyScale()
result = scale.Fuzzy(0.7)
print(result["name"])
```

To work with the current repository version:

```bash
git clone https://github.com/Fuzzy-Technologies/FuzzyRoutines.git
cd FuzzyRoutines
python -m pip install .
```

## Project status

FuzzyRoutines is an open-source Beta project under the MIT License. The repository currently declares the `2.0.0.dev0` development line while its packaging is being modernized. This first modernization step preserves the existing runtime layout, mathematical behavior, and public API. The latest tagged release is `1.0.3`.

The project deliberately keeps its numerical objects readable: functions expose their parameters, fuzzy sets expose their support intervals, and scales expose their linguistic levels. This makes the library useful when a result must be examined rather than treated as a black box.

## Project links

- [Source code and usage examples](https://github.com/Fuzzy-Technologies/FuzzyRoutines)
- [Published package on PyPI](https://pypi.org/project/fuzzyroutines/)
- [Tests](https://github.com/Fuzzy-Technologies/FuzzyRoutines/tree/master/tests)
- [MIT License](https://github.com/Fuzzy-Technologies/FuzzyRoutines/blob/master/LICENSE)

<footer class="site-footer">
  <strong><a href="/">Fuzzy Technologies</a></strong>
  <span>Technologies · Knowledge · Science</span>
  <span class="footer-signature">— powered by math &amp; fuzzy logic</span>
</footer>
