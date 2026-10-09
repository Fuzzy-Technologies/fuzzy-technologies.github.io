# Article math formatting

Set `math: true` in article front matter. Check both the GitHub Markdown preview and the website rendering before publishing mathematical content.

Use fenced `math` blocks for display equations. Do not wrap them in raw HTML, and do not add `$$` inside the fence:

````markdown
```math
u=\sum_{i=0}^{n}w_i x_i\qquad\text{(1)}
```
````

GitHub renders these blocks as mathematics. The website's CommonMark renderer preserves the original TeX inside a code block; the MathJax startup hook converts that block into a display equation before typesetting. Existing `math-display` HTML blocks remain supported on the website.

Inline formulas use `$...$`. In ordinary Markdown text, escape underscores and double TeX backslashes where CommonMark would otherwise interpret them. For example, the Markdown source `$x=(x\_0,\\ldots,x\_n)$` must reach MathJax as `$x=(x_0,\ldots,x_n)$`. Do not apply this Markdown escaping inside fenced math blocks.

For numbered equations, append `\qquad\text{(1)}` (with the appropriate number). GitHub's current MathML preview can stack terms vertically when `\tag` produces a labeled table row, so check the visual layout as well as parser errors.

For named functions such as MAD and Median, use `\mathrm{MAD}` and `\mathrm{Median}`. GitHub's math renderer rejects `\operatorname` even though the website's MathJax supports it. Check for GitHub error banners as well as rendered formula counts.

Check every display equation and inline expression for rendering errors, preserved subscripts, fractions, cases, and equation numbers. Verify the rendered result rather than only matching delimiters in the source.

References: [GitHub math syntax](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions) and [MathJax startup hooks](https://docs.mathjax.org/en/v3.2/web/configuration.html#performing-actions-during-initialization).
