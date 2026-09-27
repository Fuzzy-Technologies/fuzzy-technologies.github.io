---
layout: default
lang: zh-CN
title: FuzzyRoutines — Python 模糊计算库
description: FuzzyRoutines 是一个开源 Python 库，提供隶属函数、模糊集、模糊量表、去模糊化和常用模糊逻辑算子。
keywords: FuzzyRoutines, Python, 模糊逻辑, 模糊集, 隶属函数, 模糊量表, 去模糊化, 科学计算, 开源
permalink: /zh-cn/FuzzyRoutines/
alternate_en: /FuzzyRoutines/
alternate_ru: /ru/FuzzyRoutines/
alternate_zh: /zh-cn/FuzzyRoutines/
---

<header class="site-header">
  <h1 class="site-title"><a href="/zh-cn/FuzzyRoutines/">🧮 FuzzyRoutines</a></h1>
  <div class="site-actions">
    <nav class="language-switch" aria-label="语言">
      <a href="/FuzzyRoutines/" lang="en">EN</a>
      <a href="/ru/FuzzyRoutines/" lang="ru">RU</a>
      <span class="active" aria-current="page">简中</span>
    </nav>
    <a class="brand-button" href="/zh-cn/" aria-label="返回 Fuzzy Technologies">
      <img src="/static/images/FuzzyTechnologies-Logo-transp.png" alt="Fuzzy Technologies" />
    </a>
  </div>
</header>

<section>
  <p class="eyebrow">开源 · Python · 模糊数学</p>
  <p class="hero-lead"><strong>FuzzyRoutines</strong> 是一个紧凑的 Python 库，用于构建明确、可检查的模糊计算。</p>
  <p>它提供隶属函数、模糊集、语言量表、去模糊化以及常用模糊逻辑算子等数学组件。项目面向研究、教学、专家系统和工程原型，适用于需要理解与检查计算过程的场景。</p>
  <div class="hero-actions">
    <a class="button-neon" href="https://github.com/Fuzzy-Technologies/FuzzyRoutines">GitHub</a>
    <a class="button-neon" href="https://pypi.org/project/fuzzyroutines/">PyPI</a>
  </div>
</section>

## 核心能力

<div class="direction-grid">
  <section class="direction-card">
    <h3>隶属函数</h3>
    <p>提供双曲型、钟形、抛物线型、三角形、指数型、S 形、满意度和梯形隶属函数，并显式保留其参数。</p>
  </section>
  <section class="direction-card">
    <h3>模糊集与去模糊化</h3>
    <p>模糊集将隶属函数与支撑区间组合起来，并可给出数值化的去模糊化结果。</p>
  </section>
  <section class="direction-card">
    <h3>语言量表</h3>
    <p>可以构建有序模糊量表，也可以使用预定义的 Min–Low–Med–High–Max 通用量表解释归一化数值。</p>
  </section>
  <section class="direction-card">
    <h3>模糊逻辑算子</h3>
    <p>提供模糊 NOT、AND/OR、T-范数、S-余范数，以及处理多个模糊值的组合函数。</p>
  </section>
</div>

## 安装与快速体验

从 PyPI 安装已发布的软件包：

```bash
pip install fuzzyroutines
```

创建通用模糊量表并对归一化数值进行分类：

```python
from fuzzyroutines.FuzzyRoutines import UniversalFuzzyScale

scale = UniversalFuzzyScale()
result = scale.Fuzzy(0.7)
print(result["name"])
```

如需使用仓库中的当前版本：

```bash
git clone https://github.com/Fuzzy-Technologies/FuzzyRoutines.git
cd FuzzyRoutines
python -m pip install .
```

## 项目状态

FuzzyRoutines 是采用 MIT 许可证的开源 Beta 项目。仓库当前声明的开发版本线为 `2.0.0.dev0`，正在推进软件包构建与发布方式的现代化。第一阶段保持现有运行时代码结构、数学行为和公共 API 不变。最新标签版本为 `1.0.3`。

库中的数值对象有意保持可读：函数显示自身参数，模糊集显示支撑区间，量表显示语言层级。因此，它适合需要检查计算依据、而不是把结果交给黑盒模型的任务。

## 项目链接

- [源代码与使用示例](https://github.com/Fuzzy-Technologies/FuzzyRoutines)
- [PyPI 软件包](https://pypi.org/project/fuzzyroutines/)
- [测试](https://github.com/Fuzzy-Technologies/FuzzyRoutines/tree/master/tests)
- [MIT 许可证](https://github.com/Fuzzy-Technologies/FuzzyRoutines/blob/master/LICENSE)

<footer class="site-footer">
  <strong><a href="/zh-cn/">Fuzzy Technologies</a></strong>
  <span>技术 · 知识 · 科学</span>
  <span class="footer-signature">— powered by math &amp; fuzzy logic</span>
</footer>
