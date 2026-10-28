"""Validate registered company branding on every rendered site page."""

import argparse
from html.parser import HTMLParser
from pathlib import Path

CERTIFICATE_URL = "https://fips.ru/EGD/e3ee2ab0-72e9-4524-a4b9-7123356f06fe"
LOGO_URL = "/static/images/FuzzyTechnologies-Logo-registered.svg"
HINTS = {
    "en": "Trademark No. 1276641 — registration certificate (Russian FIPS/Rospatent website)",
    "ru": "Товарный знак № 1276641 — свидетельство Роспатента",
    "zh-CN": "第 1276641 号商标 — 注册证书（俄罗斯 FIPS/Rospatent 网站）",
}


class BrandingParser(HTMLParser):
    """Collect public header logos and accessible certificate links."""

    def __init__(self):
        """Initialize independent state for one HTML document."""

        super().__init__()
        self.lang = "en"
        self.has_header = False
        self.logos = []
        self.links = []
        self.current_link = None
        self.in_brand_button = False
        self.button_images = []

    def handle_starttag(self, tag, attrs):
        """Collect branding attributes without relying on source indentation."""

        attrs = dict(attrs)
        classes = attrs.get("class", "").split()

        if tag == "html":
            self.lang = attrs.get("lang", "en")

        if tag == "header" and "site-header" in classes:
            self.has_header = True

        if tag == "img" and "FuzzyTechnologies-Logo-" in attrs.get("src", ""):
            self.logos.append(attrs)

        if tag == "a" and "brand-button" in classes:
            self.in_brand_button = True

        if tag == "img" and self.in_brand_button:
            self.button_images.append(attrs)

        if tag == "a" and "trademark-link" in classes:
            self.current_link = {"attrs": attrs, "text": "", "superscript": False}
            self.links.append(self.current_link)

        if tag == "sup" and self.current_link is not None:
            self.current_link["superscript"] = "trademark-symbol" in classes

    def handle_startendtag(self, tag, attrs):
        """Support both HTML and XHTML image serialization."""

        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        """Stop collecting the certificate link's visible text at its boundary."""

        if tag == "a":
            self.current_link = None
            self.in_brand_button = False

    def handle_data(self, data):
        """Capture the full linked brand name, including its registration mark."""

        if self.current_link is not None:
            self.current_link["text"] += data


def ValidatePage(path):
    """Return failures for branded pages; ignore legacy redirect documents."""

    parser = BrandingParser()
    parser.feed(path.read_text(encoding="utf-8"))

    if not parser.has_header:
        return None

    errors = []

    if len(parser.logos) != 1 or parser.logos[0].get("src") != LOGO_URL:
        errors.append("header must use the registered logo exactly once")

    if len(parser.button_images) != 1 or parser.button_images[0].get("src") != LOGO_URL:
        errors.append("brand button must wrap only its logo; check inline include whitespace")

    if len(parser.links) != 1:
        errors.append("footer must contain exactly one certificate link")

    else:
        link = parser.links[0]
        attrs = link["attrs"]
        hint = HINTS.get(parser.lang)

        if attrs.get("href") != CERTIFICATE_URL:
            errors.append("certificate URL does not match the registered document")

        if not hint or attrs.get("title") != hint or attrs.get("aria-description") != hint:
            errors.append("certificate tooltip and accessible description must match the page language")

        if link["text"].strip() != "Fuzzy Technologies®" or not link["superscript"]:
            errors.append("full linked brand name must include a superscript registration mark")

    return errors


def Main():
    """Check the build directory and fail on missing or inconsistent branding."""

    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("site_dir", type=Path)
    args = cli.parse_args()
    checked = 0
    failures = []

    for path in sorted(args.site_dir.rglob("*.html")):
        errors = ValidatePage(path)

        if errors is None:
            continue

        checked += 1
        failures.extend(f"{path}: {error}" for error in errors)

    if not checked:
        failures.append("No branded pages found; check the build directory.")

    if failures:
        raise SystemExit("\n".join(failures))

    print(f"PASS: {checked} pages use registered branding and localized certificate links.")


if __name__ == "__main__":
    Main()
