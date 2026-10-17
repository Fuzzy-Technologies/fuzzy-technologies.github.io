---
layout: default
lang: ru
title: FuzzyRoutines — нечёткие вычисления на Python
description: FuzzyRoutines — открытая Python-библиотека для функций принадлежности, нечётких множеств и шкал, дефаззификации и операторов нечёткой логики.
keywords: FuzzyRoutines, Python, нечёткая логика, нечёткие множества, функции принадлежности, нечёткие шкалы, дефаззификация, научные вычисления, открытый код
permalink: /ru/FuzzyRoutines/
alternate_en: /FuzzyRoutines/
alternate_ru: /ru/FuzzyRoutines/
alternate_zh: /zh-cn/FuzzyRoutines/
---

<header class="site-header">
  <h1 class="site-title"><a href="/ru/FuzzyRoutines/">🧮 FuzzyRoutines</a></h1>
  <div class="site-actions">
    <nav class="language-switch" aria-label="Язык">
      <a href="/FuzzyRoutines/" lang="en">EN</a>
      <span class="active" aria-current="page">RU</span>
      <a href="/zh-cn/FuzzyRoutines/" lang="zh-CN">简中</a>
    </nav>
    <a class="brand-button" href="/ru/" aria-label="Назад на Fuzzy Technologies">
      <img src="/static/images/FuzzyTechnologies-Logo-transp.png" alt="Fuzzy Technologies" />
    </a>
  </div>
</header>

<section>
  <p class="eyebrow">Открытый код · Python · Нечёткая математика</p>
  <p class="hero-lead"><strong>FuzzyRoutines</strong> — компактная Python-библиотека для явных и проверяемых нечётких вычислений.</p>
  <p>Она предоставляет математические компоненты для функций принадлежности, нечётких множеств, лингвистических шкал, дефаззификации и основных операторов нечёткой логики. Проект рассчитан на исследования, обучение, экспертные системы и инженерные прототипы, в которых ход вычислений должен оставаться понятным.</p>
  <div class="hero-actions">
    <a class="button-neon" href="https://github.com/Fuzzy-Technologies/FuzzyRoutines">GitHub</a>
    <a class="button-neon" href="https://pypi.org/project/fuzzyroutines/">PyPI</a>
  </div>
</section>

## Основные возможности

<div class="direction-grid">
  <section class="direction-card">
    <h3>Функции принадлежности</h3>
    <p>Гиперболическая, колоколообразная, параболическая, треугольная, экспоненциальная, сигмоидальная, функция желательности и трапециевидная функция с явными параметрами.</p>
  </section>
  <section class="direction-card">
    <h3>Нечёткие множества и дефаззификация</h3>
    <p>Нечёткое множество объединяет функцию принадлежности с интервалом носителя и позволяет получить численный результат дефаззификации.</p>
  </section>
  <section class="direction-card">
    <h3>Лингвистические шкалы</h3>
    <p>Можно создавать упорядоченные нечёткие шкалы или использовать готовую универсальную шкалу Min–Low–Med–High–Max для интерпретации нормированных значений.</p>
  </section>
  <section class="direction-card">
    <h3>Операторы нечёткой логики</h3>
    <p>Нечёткие NOT, AND/OR, T-нормы, S-конормы и функции композиции для наборов из нескольких нечётких значений.</p>
  </section>
</div>

## Установка и первый пример

Установка опубликованного пакета из PyPI:

```bash
python -m pip install fuzzyroutines==2.0.0
```

Создайте небольшую лингвистическую шкалу и классифицируйте температуру:

```python
from fuzzyroutines import (
    ContinuousUniverse, LinguisticScale, LinguisticTerm, ScalarFuzzySet, Triangle,
)

universe = ContinuousUniverse(0, 40, True, True)
scale = LinguisticScale((
    LinguisticTerm("Comfort", ScalarFuzzySet(universe, Triangle(16, 22, 28))),
))
result = scale.Fuzzify(24)
print(result.selectedTerms[0].name)  # Comfort
```

Для работы с текущей версией репозитория:

```bash
git clone https://github.com/Fuzzy-Technologies/FuzzyRoutines.git
cd FuzzyRoutines
python -m pip install .
```

## Состояние проекта

FuzzyRoutines распространяется под лицензией Apache-2.0. Стабильная версия в PyPI — `2.0.0`; поддерживаются CPython 3.13 и 3.14, обязательных зависимостей нет. Современный скалярный API позволяет явно задавать области определения и неизменяемые параметры вычислений, а также проверять результаты. Для существующих приложений сохранены совместимые исторические импорты.

Численные объекты библиотеки намеренно остаются читаемыми: функции показывают свои параметры, нечёткие множества — интервалы носителя, а шкалы — лингвистические уровни. Это полезно в задачах, где результат требуется проверить, а не получить из непрозрачной модели.

## Ссылки проекта

- [Исходный код и примеры использования](https://github.com/Fuzzy-Technologies/FuzzyRoutines)
- [Пакет в PyPI](https://pypi.org/project/fuzzyroutines/)
- [Документация](https://fuzzy-technologies.github.io/FuzzyRoutines/api/latest/ru/)
- [Тесты](https://github.com/Fuzzy-Technologies/FuzzyRoutines/tree/master/tests)
- [Лицензия Apache-2.0](https://github.com/Fuzzy-Technologies/FuzzyRoutines/blob/master/LICENSE)

<footer class="site-footer">
  <strong><a href="/ru/">Fuzzy Technologies</a></strong>
  <span>Технологии · Знания · Наука</span>
  <span class="footer-signature">— powered by math &amp; fuzzy logic</span>
</footer>
