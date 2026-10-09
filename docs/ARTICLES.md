# Article publishing contract

English is the canonical article language. Russian and Simplified Chinese articles are adaptive localizations and use the same metadata and public URL structure.

Start with the [step-by-step publishing guide](ARTICLE_PUBLISHING.md) and [copyable templates](../_templates/articles/). The owner-approved archive migration publishes full Russian articles with clearly marked English placeholders.

For joint research authorship, use **Тимур и Мансур Гильмуллины** in Russian and **Timur & Mansur Gilmullin** in English. Keep single-author credits unchanged when only one person authored the article.

## Front matter

Article pages use `layout: article`. The article indexes discover pages with this layout, select the current `lang`, and sort them by `date` in descending order. No separate article registry is maintained.

The shared article layout adds navigation after the article and before the site footer, using the same language filter and date order as the index. “Previous article” links to the adjacent older article on the left (←); “Next article” links to the adjacent newer article on the right (→). Each link shows its title and publication date. On narrow screens the links stack. Missing neighbors are omitted without wrapping around. Labels follow the page language (EN, RU or Simplified Chinese), and translation placeholders participate only in their own language's sequence. No navigation metadata or manually maintained links are needed in article files.

| Field                | Intended use                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`             | Must be `article` for a published article and for automatic index inclusion.                                                                                  |
| `math`               | Set to `true` when the article uses LaTeX. This loads MathJax only for that page. Use `$...$` for inline math and fenced `math` blocks for display equations. |
| `lang`               | Page locale: `en`, `ru`, or `zh-CN`. It controls index membership, document language, and localized layout text.                                              |
| `title`              | Canonical website article title shown on the article page and index.                                                                                          |
| `market_title`       | Alternative title for MQL5/Market publication or export. It is preserved but is not shown as the website title.                                               |
| `description`        | Page description metadata for search and social previews. It is separate from the editorial index teaser.                                                     |
| `keywords`           | Page keyword metadata.                                                                                                                                        |
| `date`               | Publication date in `YYYY-MM-DD` form; also controls article-index ordering.                                                                                  |
| `author`             | Visible article author name.                                                                                                                                  |
| `author_url`         | Optional link for the visible author name.                                                                                                                    |
| `series`             | Visible article series or category, such as `FMA Research`.                                                                                                   |
| `series_url`         | Optional link from the series label to its project or series page.                                                                                            |
| `permalink`          | Stable public URL for the localized article.                                                                                                                  |
| `alternate_en`       | English version URL, used by the language switch and `hreflang`.                                                                                              |
| `alternate_ru`       | Russian version URL, used by the language switch and `hreflang`.                                                                                              |
| `alternate_zh`       | Simplified Chinese version URL, used by the language switch and `hreflang="zh-CN"`.                                                                           |
| `preview_image`      | Editorial image shown on the Articles index. It is not rendered automatically inside the article.                                                             |
| `preview_text`       | Short editorial teaser shown on the Articles index. It must not contain figure numbering.                                                                     |
| `cover_image`        | Separate social/share cover used for Open Graph and Twitter large-image metadata. It is not rendered in the article body or used as the index image.          |
| `hero_image`         | Optional article-only hero image for articles that intentionally need one near the beginning. It is not the index or social image.                            |
| `hero_alt`           | Accessible alternative text for an optional `hero_image`.                                                                                                     |
| `hero_caption`       | Optional visible caption for an optional `hero_image`.                                                                                                        |
| `mql5_url`           | Optional URL of the MQL5 mirror/publication for future integrations. It is not canonical.                                                                     |
| `translation_status` | Optional localization state. Use `placeholder` for a published translation placeholder so the index labels it clearly.                                        |

## Article body convention

Keep article prose in Markdown and do not duplicate shared headers or footers. Use H2 section headings, Markdown blockquotes, MathJax/LaTeX for mathematical notation (`$...$` inline, fenced `math` blocks for display equations; see [math formatting](ARTICLE_MATH.md)), and Markdown images. Place each image caption in a separate italic paragraph after its image, with a blank line between them. A single newline is a soft break and can place a caption beside a narrow image in Markdown previews. Shared article styles center images at their natural width and shrink them to fit the available column; enlargement belongs in the lightbox. Illustration-led articles can opt into `full_width_images: true` to fill the column without changing aspect ratios. Keep a Related articles section at the end.

The first FMA Research article deliberately uses `00_FMA_Research_Intro.png` as its index preview and `00_FMA_Research_Intro_5.png` as its social cover. Its article body begins with numbered Fig. 1 and continues through Fig. 9.

Keep Markdown tables readable in source: pad every column to its widest cell, align all vertical separators, and size the header separator row to the same widths. Preserve alignment markers and table content. Apply this convention to article text, templates, and publishing documentation, and check the raw diff as well as the rendered table.

Use descriptive Markdown links on the relevant term, title, author or resource name in both prose and reference lists. Do not append a bare URL or URL-only autolink after the text it describes. Preserve the original destination when restoring a link. Check the rendered article body for visible URL strings; metadata and code examples are separate from reader-facing prose. Numbered citations should link to the corresponding bibliography entry when one is present.

Keep reader-facing prose, teasers and translation notices free of migration or editing commentary. Do not describe source folders, date recovery, preserved wording, merged drafts or publication mechanics. Keep that information in repository documentation or the PR. Preserve useful historical context, scientific qualifications and source links in natural editorial language; translation notices should simply state availability and link to the readable version.

## Supplemental comments in archived sources

Inspect the full article and every `post*.txt` variant, including text after signatures, hashtags and source links. Markers such as “Опубликовать в комментариях”, including repeated blocks, are editorial instructions; their substantive content belongs in the migrated article.

- Preserve each unique explanation, example, formula, reference and relevant illustration.
- Integrate a clarification into the passage it explains. Put independent additions after the main text under “Примечания” (Notes) or “Послесловие” (Afterword), according to their meaning.
- Combine overlapping variants without losing unique information or changing the author's argument. Flag conflicting versions for review.
- Keep the index teaser concise; put these additions in the full article. Remove the editorial marker once its content has been incorporated.

Before deleting temporary sources, compare every supplemental block with the final article and confirm that all substantive additions are accounted for. Add corrections to the article's existing branch and pull request.

## Pull request handoff

Immediately after creating a project-owned pull request, assign it to `Tim55667757` and add the `documentation` label. Preserve any other assignees and relevant labels, and verify both required fields before handing the PR to the owner for review.
