# How to publish an article

You can publish an article yourself using GitHub's web editor. No AI assistant, local terminal, or manual edit to the Articles index is required. An article is a Markdown text file with a metadata block between the first two `---` lines.

## 1. Choose the date and file name

Use the original publication date for an archived article, including a date recovered from its source folder. Do not replace it with the migration date. For a new article, use its publication date.

Choose a short lowercase English slug with hyphens. This guide uses `2025-05-13-my-research` as an example; replace it everywhere with your own date and slug. Keep a published URL stable when editing its text later.

| What                                    | Copy from                                                                       | Save as (paths from the repository root)         |
| --------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| Full Russian article                    | [`article.ru.md`](../_templates/articles/article.ru.md)                         | `ru/articles/2025-05-13-my-research.md`          |
| English translation placeholder         | [`article.en-placeholder.md`](../_templates/articles/article.en-placeholder.md) | `articles/2025-05-13-my-research.md`             |
| Illustrations, preview and social cover | Your selected image files                                                       | `static/images/articles/2025-05-13-my-research/` |

The templates support the owner-approved Russian-first archive workflow. For a normal English-first article, use the same metadata structure, write the complete English body, remove `translation_status: placeholder`, and review its localizations under [LOCALIZATION.md](LOCALIZATION.md). Do not claim an unfinished translation is complete. Add a Chinese alternate only when its page exists.

## 2. Create a branch and upload the pictures

1. Open the repository on GitHub. Select `master` in the branch selector, then create a branch such as `content/2025-05-13-my-research`.
2. Select that branch. Keep all files for this article on it.
3. Open `static/images/articles/`, choose **Add file → Upload files**, and upload a local folder named `2025-05-13-my-research` with the selected pictures inside. Check that GitHub preserves this folder in the displayed paths before committing. If your browser cannot upload a folder, use GitHub Desktop to copy the folder into the same location.
4. Commit the upload to your article branch. Never upload the complete source archive, duplicate drafts, or unrelated files.

Prefer descriptive image names without spaces. PNG, JPG and WebP work as ordinary article images. Reuse a selected image where appropriate; do not duplicate it for each language.

## 3. Copy and fill the two Markdown files

Open each linked template, use **Raw** or **Copy raw file**, and copy its entire contents, including the metadata block. On your branch, choose **Add file → Create new file**, enter the destination path from the table, and paste the template. Do not edit the template itself to publish an article.

Replace every `REPLACE_...` value and every example date/slug. The templates are excluded from the website build, so they cannot appear as sample articles.

| Field                          | What to put here                                                                                                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                        | The title in this page's language. The layout displays it; do not repeat it as an H1 in the body.                                                                                                         |
| `date`                         | Original publication date, e.g. `2025-05-13`, identical in both files. This is what the index sorts by.                                                                                                   |
| `author`                       | Joint research: `Тимур и Мансур Гильмуллины` / `Timur & Mansur Gilmullin`. For a single author: `Тимур Гильмуллин` / `Timur Gilmullin` or `Мансур Гильмуллин` / `Mansur Gilmullin`.                       |
| `description`                  | A concise description for search engines and link previews.                                                                                                                                               |
| `preview_text`                 | The editorial digest shown on the Articles page, usually one compact paragraph of a few sentences. Use the existing research cards as the length reference; omit figure numbers and service instructions. |
| `permalink`                    | This file's public address, with a leading and trailing slash. RU starts `/ru/articles/`; EN starts `/articles/`.                                                                                         |
| `alternate_en`, `alternate_ru` | The same matching pair of public addresses in both files.                                                                                                                                                 |
| `preview_image`                | Image for the article card. Use an existing path starting `/static/images/articles/`.                                                                                                                     |
| `cover_image`                  | Image for social sharing. It may reuse the preview file, but it has a separate purpose.                                                                                                                   |
| `math`                         | `true` if the full article contains formulas; otherwise `false` or omit it.                                                                                                                               |
| `series`, `series_url`         | Keep `FMA Research` and `/FMA/` for that series. Change or remove both for another topic.                                                                                                                 |
| `translation_status`           | Keep `placeholder` only on an unfinished translation. Remove it when the full translation is ready.                                                                                                       |

Keep text values quoted if they contain `:` or other YAML punctuation. Inside a single-quoted YAML value, write an apostrophe twice: `'Author''s article'`. Long metadata text can use `>-` followed by indented lines, as in the templates.

The body starts after the second `---`. Write the full article there, replacing the sample sections. A teaser belongs in `preview_text`; the full text belongs in the body.

### Markdown, images and formulas

```markdown
## A section heading

Ordinary text with **emphasis** and [a link](/FMA/).

![What the illustration shows](/static/images/articles/2025-05-13-my-research/figure-01.png)

*Figure 1. A short explanation of the illustration.*

> An important clarification or historical context.
```

Keep the blank line between the image and its caption: it makes the caption a separate paragraph below the image in both GitHub's Markdown preview and the website. Article images are centered, keep their natural width when small, and shrink to fit the column when large.

Images in the article open in the shared full-screen preview automatically. No image links or JavaScript are needed. `preview_image` and `cover_image` do not insert an image into the body: add it in Markdown when needed. Use `hero_image` only if you intentionally want the layout to insert a hero; do not also repeat that image at the start of the body.

For simple inline math, use `$x$`. Set `math: true` on the page. To preserve LaTeX backslashes and underscores in a display equation with this site's CommonMark parser, use this raw HTML wrapper:

```html
<div class="math-display">
$$
P(A)=\frac{n_A}{n}
$$
</div>
```

For complex inline LaTeX, check the rendered page carefully: CommonMark can interpret backslashes and underscores before MathJax sees them. GitHub's Markdown preview is useful for prose but does not reproduce the site's layouts, formula processing, or image viewer.

### Moving an archived article

Use `long.txt` as the full text and compare all `post*.txt` variants when composing the digest. Preserve the author's argument, examples, useful references, illustrations and original date. Light rewriting should retain the author's voice.

Read the entire source, including text after signatures and links. Integrate valuable blocks marked “Опубликовать в комментариях” into the relevant section or under “Примечания” / “Послесловие”. Combine duplicate variants without losing unique information. See the [supplemental-comments rules](ARTICLES.md#supplemental-comments-in-archived-sources).

Add a source link near the end. The optional `source_url` metadata can preserve the original address, but does not display it automatically. Keep related links at the end and prefer site versions once they are published. Do not publish unrelated reposts or obsolete development tutorials as FMA research.

## 4. Review and open a pull request

Commit both article files to the same branch. In **Compare & pull request**, choose `master` as the base. Review **Files changed** before submitting:

- No `REPLACE_...` markers or example paths remain.
- Dates, slugs, author credits and language links agree between the two files.
- Every image path matches an uploaded file exactly, including letter case.
- The Russian body is complete and the English placeholder links to it.
- Captions, formulas, sources and supplemental notes are preserved.
- Links are attached to meaningful terms or titles in the body and reference lists; no raw URL strings remain in reader-facing prose.
- Only the intended article files and useful images are included.

Use an English PR title and technical description. Assign the PR to **Tim55667757** and add **documentation** immediately. The owner reviews and merges it. Keep subsequent corrections for this article in the same branch while its PR is open.

## 5. Check the published result

After merge, wait for GitHub Pages deployment to finish (check the repository's Actions/deployment status). Then open:

- `/ru/articles/` and the new Russian article;
- `/articles/` and its English placeholder;
- the language switch in both directions;
- the image preview, including a picture far down the page;
- any formulas and changed links.

The card appears automatically from `layout: article` and `lang`. The index sorts `date` from newest to oldest. There is no list or digest page to edit manually. If an article is missing, first check the deployment, `layout`, `lang`, and valid `date`. If an image is missing, compare its URL with the actual uploaded filename.

For metadata details, see [ARTICLES.md](ARTICLES.md). For repository-wide rules, see [DEVELOPMENT_PROTOCOL.md](../DEVELOPMENT_PROTOCOL.md).
