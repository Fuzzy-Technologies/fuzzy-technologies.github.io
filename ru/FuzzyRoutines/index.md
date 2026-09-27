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
pip install fuzzyroutines
```

Создание универсальной нечёткой шкалы и классификация нормированного значения:

```python
from fuzzyroutines.FuzzyRoutines import UniversalFuzzyScale

scale = UniversalFuzzyScale()
result = scale.Fuzzy(0.7)
print(result["name"])
```

Для работы с текущей версией репозитория:

```bash
git clone https://github.com/Fuzzy-Technologies/FuzzyRoutines.git
cd FuzzyRoutines
python -m pip install .
```

## Состояние проекта

FuzzyRoutines — открытый проект со статусом Beta под лицензией MIT. В репозитории сейчас объявлена линия разработки `2.0.0.dev0`, для которой модернизируется сборка и публикация пакета. Первый этап этой работы сохраняет существующую структуру исполняемого кода, математическое поведение и публичный API. Последний опубликованный тег — `1.0.3`.

Численные объекты библиотеки намеренно остаются читаемыми: функции показывают свои параметры, нечёткие множества — интервалы носителя, а шкалы — лингвистические уровни. Это полезно в задачах, где результат требуется проверить, а не получить из непрозрачной модели.

## Ссылки проекта

- [Исходный код и примеры использования](https://github.com/Fuzzy-Technologies/FuzzyRoutines)
- [Пакет в PyPI](https://pypi.org/project/fuzzyroutines/)
- [Тесты](https://github.com/Fuzzy-Technologies/FuzzyRoutines/tree/master/tests)
- [Лицензия MIT](https://github.com/Fuzzy-Technologies/FuzzyRoutines/blob/master/LICENSE)

<footer class="site-footer">
  <strong><a href="/ru/">Fuzzy Technologies</a></strong>
  <span>Технологии · Знания · Наука</span>
  <span class="footer-signature">— powered by math &amp; fuzzy logic</span>
</footer>
