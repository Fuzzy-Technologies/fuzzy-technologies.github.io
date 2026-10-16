"""Validate rendered FMA locale routes and shared article navigation."""

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

LOCALES = {
    "en": ("/FMA/", "/articles/", "All articles"),
    "ru": ("/ru/FMA/", "/ru/articles/", "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u044c\u0438"),
    "zh-CN": ("/zh-cn/FMA/", "/zh-cn/articles/", "\u6240\u6709\u6587\u7ae0"),
}
REDIRECTS = {
    "/FMA/en/": "/FMA/",
    "/FMA/en/instruments.html": "/FMA/instruments.html",
    "/FMA/zh-cn/": "/zh-cn/FMA/",
    "/FMA/zh-cn/instruments.html": "/zh-cn/FMA/instruments.html",
}


class HtmlPage(HTMLParser):
    """Collect document metadata and visible navigation from built HTML."""

    def __init__(self, text):
        """Parse a single rendered document."""

        super().__init__()
        self.lang = None
        self.canonical = None
        self.alternates = {}
        self.links = []
        self.references = []
        self.ids = set()
        self.metadata_urls = []
        self.active_link = None
        self.is_article = False
        self.text = text
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        """Read metadata and anchor attributes using HTMLParser callbacks."""

        attributes = dict(attrs)

        for name in ("href", "src", "action", "poster", "data-full-src"):
            if attributes.get(name):
                self.references.append((tag, name, attributes[name]))

        for candidate in attributes.get("srcset", "").split(","):
            if candidate.strip():
                self.references.append((tag, "srcset", candidate.strip().split()[0]))

        if attributes.get("id"):
            self.ids.add(attributes["id"])

        if tag == "a" and attributes.get("name"):
            self.ids.add(attributes["name"])

        if tag == "meta" and attributes.get("property") in ("og:url", "og:image"):
            self.metadata_urls.append((attributes["property"], attributes.get("content", "")))

        if tag == "meta" and attributes.get("name") == "twitter:image":
            self.metadata_urls.append(("twitter:image", attributes.get("content", "")))

        if tag == "html":
            self.lang = attributes.get("lang")

        elif tag == "article":
            self.is_article = "article-content" in attributes.get("class", "").split()

        elif tag == "link" and attributes.get("rel") == "canonical":
            self.canonical = attributes.get("href")

        elif tag == "link" and attributes.get("rel") == "alternate":
            self.alternates[attributes.get("hreflang")] = attributes.get("href")

        elif tag == "a":
            self.active_link = {**attributes, "text": ""}
            self.links.append(self.active_link)

    def handle_data(self, data):
        """Collect the readable label of the current link."""

        if self.active_link is not None:
            self.active_link["text"] += data

    def handle_endtag(self, tag):
        """Finish the current link without relying on visual presentation."""

        if tag == "a":
            self.active_link = None


def ReadPage(site_dir, url):
    """Read an exact public route, failing on missing generated output."""

    relative_path = url.lstrip("/")

    if url.endswith("/"):
        relative_path += "index.html"

    path = site_dir / relative_path
    assert path.is_file(), f"Missing rendered route {url}; check page location and permalink."

    return HtmlPage(path.read_text(encoding="utf-8"))


def Validate(site_dir, site_url):
    """Check canonical routes, locale-preserving links and article returns."""

    fma_pages = 0

    for lang, (fma_url, articles_url, _) in LOCALES.items():
        for suffix in ("", "instruments.html"):
            url = fma_url + suffix
            page = ReadPage(site_dir, url)
            assert page.lang == lang, f"Wrong document language at {url}: {page.lang}."
            assert page.canonical == site_url + url, f"Wrong canonical URL at {url}."

            for alternate_lang, (alternate_fma, _, _) in LOCALES.items():
                assert page.alternates.get(alternate_lang) == site_url + alternate_fma + suffix, (
                    f"Wrong {alternate_lang} alternate at {url}; locale switches may be reversed."
                )

            assert page.alternates.get("x-default") == site_url + "/FMA/" + suffix, (
                f"English must be the default alternate at {url}."
            )
            ReadPage(site_dir, articles_url)
            fma_pages += 1

    for old_url, target in REDIRECTS.items():
        page = ReadPage(site_dir, old_url)
        assert page.canonical == site_url + target, f"Wrong redirect canonical at {old_url}."
        assert any(link.get("href") == target for link in page.links), f"Missing fallback at {old_url}."
        assert "window.location.replace" in page.text, f"Missing redirect at {old_url}."
        assert "window.location.search + window.location.hash" in page.text, (
            f"Redirect {old_url} must preserve query strings and fragments."
        )

    article_count = 0
    fma_links = 0

    for path in site_dir.rglob("*.html"):
        page = HtmlPage(path.read_text(encoding="utf-8"))
        public_path = "/" + path.relative_to(site_dir).as_posix()
        public_path = public_path.removesuffix("index.html")

        if public_path in REDIRECTS:
            continue

        for link in page.links:
            destination = urlsplit(urljoin(site_url + public_path, link.get("href", "")))

            if destination.netloc != urlsplit(site_url).netloc or "FMA" not in destination.path.split("/"):
                continue

            link_lang = link.get("lang", page.lang)
            expected_fma = LOCALES[link_lang][0]
            assert destination.path in (expected_fma, expected_fma + "instruments.html"), (
                f"Wrong FMA locale link in {public_path}: {link.get('href')} ({link_lang})."
            )
            ReadPage(site_dir, destination.path)
            fma_links += 1

        if not page.is_article:
            continue

        _, articles_url, label = LOCALES[page.lang]
        index_links = [link for link in page.links if "article-index-link__anchor" in link.get("class", "").split()]
        assert len(index_links) == 2, f"Expected top and bottom index links at {public_path}."

        for link in index_links:
            assert link.get("href") == articles_url, f"Wrong article index locale at {public_path}."
            assert link["text"].strip() == label, (
                f"Wrong article index label at {public_path}."
            )

        assert page.text.index("article-index-link--top") < page.text.index("<h1>"), (
            f"Top index link must precede the article title at {public_path}."
        )
        assert page.text.index("article-index-link--bottom") > page.text.index("</article>"), (
            f"Bottom index link must follow the article at {public_path}."
        )
        article_count += 1

    assert article_count > 0, "No rendered articles were checked; verify the Jekyll build destination."
    print(f"PASS: {fma_pages} FMA pages, {len(REDIRECTS)} redirects, {fma_links} FMA links, {article_count} articles.")


def Main():
    """Run deterministic navigation checks against a Jekyll build."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_dir", type=Path, nargs="?", default=Path("_site"))
    parser.add_argument("--site-url", required=True, help="Expected public origin for this build.")
    args = parser.parse_args()
    Validate(args.site_dir, args.site_url.rstrip("/"))


if __name__ == "__main__":
    Main()
