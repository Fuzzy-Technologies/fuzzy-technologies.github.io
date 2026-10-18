"""Protect project-card language selection without network or browser access."""

from pathlib import Path
import tempfile
import unittest

from check_site_navigation import ValidateProjectNavigation


class TestProjectNavigation(unittest.TestCase):
    """Exercise matching routes and the reported fallback to English."""

    def setUp(self):
        """Create independent rendered company-homepage fixtures."""

        temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(temporary_directory.cleanup)
        self.site_dir = Path(temporary_directory.name)
        self._WriteHome("en", "", "/FuzzyRoutines/")
        self._WriteHome("ru", "ru", "/FuzzyRoutines/ru/")
        self._WriteHome("zh-CN", "zh-cn", "/FuzzyRoutines/zh-CN/")

    def _WriteHome(self, lang, directory, target, *, duplicate=False):
        """Write a minimal HTML route, keeping external repository links separate."""

        path = self.site_dir / directory / "index.html"
        path.parent.mkdir(parents=True, exist_ok=True)
        project_link = f'<a href="{target}">Project website</a>' if target else ""

        if duplicate:
            project_link *= 2

        path.write_text(
            f'<html lang="{lang}"><body>{project_link}'
            '<a href="https://github.com/Fuzzy-Technologies/FuzzyRoutines">GitHub</a>'
            "</body></html>",
            encoding="utf-8",
        )

    def test_SelectedLanguageWorksOnBothOrigins(self):
        """Keep routes independent of production and preview hostnames."""

        for origin in ("https://fuzzy-technologies.com", "https://www.example.test"):
            with self.subTest(origin=origin):
                self.assertEqual(ValidateProjectNavigation(self.site_dir, origin), 3)

    def test_RussianEnglishFallbackIsRejected(self):
        """Reproduce the Russian card incorrectly opening the English project."""

        self._WriteHome("ru", "ru", "/FuzzyRoutines/")

        with self.assertRaisesRegex(AssertionError, "Wrong FuzzyRoutines locale at /ru/"):
            ValidateProjectNavigation(self.site_dir, "https://fuzzy-technologies.com")

    def test_ChineseRouteCaseIsProtected(self):
        """Distinguish the company zh-cn prefix from the project's zh-CN path."""

        self._WriteHome("zh-CN", "zh-cn", "/FuzzyRoutines/zh-cn/")

        with self.assertRaisesRegex(AssertionError, "expected /FuzzyRoutines/zh-CN/"):
            ValidateProjectNavigation(self.site_dir, "https://fuzzy-technologies.com")

    def test_MissingProjectLinkIsRejected(self):
        """Fail when the card loses its project destination entirely."""

        self._WriteHome("ru", "ru", "")

        with self.assertRaisesRegex(AssertionError, "Expected one FuzzyRoutines project link"):
            ValidateProjectNavigation(self.site_dir, "https://fuzzy-technologies.com")

    def test_DuplicateProjectLinksAreRejected(self):
        """Prevent a correct link from hiding a conflicting extra destination."""

        self._WriteHome("ru", "ru", "/FuzzyRoutines/ru/", duplicate=True)

        with self.assertRaisesRegex(AssertionError, "Expected one FuzzyRoutines project link"):
            ValidateProjectNavigation(self.site_dir, "https://fuzzy-technologies.com")

    def test_WrongCompanyLanguageIsRejected(self):
        """Ensure a locale route actually renders its selected document language."""

        self._WriteHome("en", "ru", "/FuzzyRoutines/ru/")

        with self.assertRaisesRegex(AssertionError, "Wrong company language at /ru/"):
            ValidateProjectNavigation(self.site_dir, "https://fuzzy-technologies.com")


if __name__ == "__main__":
    unittest.main()
