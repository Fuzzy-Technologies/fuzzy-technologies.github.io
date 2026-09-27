# Article publishing contract

English is the canonical article language. Russian and Simplified Chinese articles are adaptive localizations and use the same metadata and public URL structure.

## Front matter

Article pages use `layout: article`. The article indexes discover pages with this layout, select the current `lang`, and sort them by `date` in descending order. No separate article registry is maintained.

| Field                | Intended use                                                                                                                                         |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `layout`             | Must be `article` for a published article and for automatic index inclusion.                                                                         |
| `lang`               | Page locale: `en`, `ru`, or `zh-CN`. It controls index membership, document language, and localized layout text.                                     |
| `title`              | Canonical website article title shown on the article page and index.                                                                                 |
| `market_title`       | Alternative title for MQL5/Market publication or export. It is preserved but is not shown as the website title.                                      |
| `description`        | Page description metadata for search and social previews. It is separate from the editorial index teaser.                                            |
| `keywords`           | Page keyword metadata.                                                                                                                               |
| `date`               | Publication date in `YYYY-MM-DD` form; also controls article-index ordering.                                                                         |
| `author`             | Visible article author name.                                                                                                                         |
| `author_url`         | Optional link for the visible author name.                                                                                                           |
| `series`             | Visible article series or category, such as `FMA Research`.                                                                                          |
| `series_url`         | Optional link from the series label to its project or series page.                                                                                   |
| `permalink`          | Stable public URL for the localized article.                                                                                                         |
| `alternate_en`       | English version URL, used by the language switch and `hreflang`.                                                                                     |
| `alternate_ru`       | Russian version URL, used by the language switch and `hreflang`.                                                                                     |
| `alternate_zh`       | Simplified Chinese version URL, used by the language switch and `hreflang="zh-CN"`.                                                                  |
| `preview_image`      | Editorial image shown on the Articles index. It is not rendered automatically inside the article.                                                    |
| `preview_text`       | Short editorial teaser shown on the Articles index. It must not contain figure numbering.                                                            |
| `cover_image`        | Separate social/share cover used for Open Graph and Twitter large-image metadata. It is not rendered in the article body or used as the index image. |
| `hero_image`         | Optional article-only hero image for articles that intentionally need one near the beginning. It is not the index or social image.                   |
| `hero_alt`           | Accessible alternative text for an optional `hero_image`.                                                                                            |
| `hero_caption`       | Optional visible caption for an optional `hero_image`.                                                                                               |
| `mql5_url`           | Optional URL of the MQL5 mirror/publication for future integrations. It is not canonical.                                                            |
| `translation_status` | Optional localization state. Use `placeholder` for a published translation placeholder so the index labels it clearly.                               |

## Article body convention

Keep article prose in Markdown and do not duplicate shared headers or footers. Use H2 section headings, Markdown blockquotes, centered formula blocks where the article already uses them, and Markdown images. Place each image caption immediately after its image in italic text. Keep a Related articles section at the end.

The first FMA Research article deliberately uses `00_FMA_Research_Intro.png` as its index preview and `00_FMA_Research_Intro_5.png` as its social cover. Its article body begins with numbered Fig. 1 and continues through Fig. 9.
