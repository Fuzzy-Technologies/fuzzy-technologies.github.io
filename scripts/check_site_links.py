"""Check all built internal destinations, assets, fragments and domain metadata."""

import argparse
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from check_site_navigation import REDIRECTS, HtmlPage

LEGACY_HOSTS = {"fuzzy-technologies.github.io", "tim55667757.github.io"}
# These exact routes are served by other organization repositories on Pages.
PROJECT_ROUTES = {
    "/1337/",
    "/1337/zh-cn/",
    "/F-Layer/en/",
    "/F-Layer/ru/",
    "/F-Layer/zh-CN/",
    "/TKSBrokerAPI/docs/tksbrokerapi/TKSBrokerAPI.html",
    "/TKSBrokerAPI/docs/tksbrokerapi/TradeRoutines.html",
}


def LocalPath(site_dir, public_path):
    """Map a URL path to its generated file or directory index."""

    path = site_dir / unquote(public_path).lstrip("/")

    if path.is_dir():
        path /= "index.html"

    return path


def Validate(site_dir, site_url):
    """Reject missing local targets and links that escape to a legacy host."""

    origin = urlsplit(site_url)
    assert origin.scheme in ("https", "http") and origin.netloc and origin.path in ("", "/"), (
        "Expected a public origin without a deployment path; this site is hosted at the domain root."
    )
    pages = {path: HtmlPage(path.read_text(encoding="utf-8")) for path in site_dir.rglob("*.html")}
    internal_count = 0
    fragment_count = 0
    project_routes = set()
    metadata_count = 0

    for path, page in pages.items():
        public_path = "/" + path.relative_to(site_dir).as_posix().removesuffix("index.html")

        if page.lang:
            canonical_path = REDIRECTS.get(public_path, public_path)
            assert page.canonical == site_url + canonical_path, f"Wrong canonical origin or path at {public_path}."

        for name, value in page.metadata_urls:
            destination = urlsplit(value)
            assert (destination.scheme, destination.netloc) == (origin.scheme, origin.netloc), (
                f"Wrong {name} origin at {public_path}: {value}."
            )
            assert LocalPath(site_dir, destination.path).is_file(), (
                f"Missing {name} destination at {public_path}: {value}."
            )
            metadata_count += 1

        for tag, attribute, value in page.references:
            raw = urlsplit(value)
            assert raw.hostname not in LEGACY_HOSTS or raw.netloc == origin.netloc, (
                f"Legacy Pages host in {public_path} ({tag}.{attribute}): {value}."
            )
            destination = urlsplit(urljoin(site_url + public_path, value))

            if destination.scheme not in ("http", "https") or destination.netloc != origin.netloc:
                continue

            if tag == "a" or attribute in ("src", "srcset", "action", "poster", "data-full-src"):
                assert not raw.netloc, f"Internal navigation/assets must use domain-independent paths at {public_path}: {value}."

            assert destination.scheme == origin.scheme, f"Internal scheme mismatch at {public_path}: {value}."
            local_path = LocalPath(site_dir, destination.path)

            if destination.path in PROJECT_ROUTES and not local_path.is_file():
                project_routes.add(destination.path)
                continue

            assert local_path.is_file(), f"Missing internal destination in {public_path} ({tag}.{attribute}): {value}."

            if destination.fragment and local_path in pages:
                fragment = unquote(destination.fragment)
                assert fragment in pages[local_path].ids, f"Missing fragment in {public_path}: {value}."
                fragment_count += 1

            internal_count += 1

    for path in (site_dir / "static").rglob("*"):
        if path.suffix not in (".js", ".css", ".json", ".svg"):
            continue

        text = path.read_text(encoding="utf-8")
        assert not any(host in text.lower() for host in LEGACY_HOSTS), f"Legacy host in runtime asset {path}."

    assert pages and internal_count, "No built HTML/internal references checked; verify the build destination."
    print(f"PASS: {len(pages)} HTML pages, {internal_count} local references, {fragment_count} fragments, {metadata_count} metadata URLs at {site_url}.")
    print("Separately hosted project routes: " + ", ".join(sorted(project_routes)))


def Main():
    """Run a deterministic link audit without making network requests."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_dir", type=Path, nargs="?", default=Path("_site"))
    parser.add_argument("--site-url", required=True, help="Expected public origin for this build.")
    args = parser.parse_args()
    Validate(args.site_dir, args.site_url.rstrip("/"))


if __name__ == "__main__":
    Main()
