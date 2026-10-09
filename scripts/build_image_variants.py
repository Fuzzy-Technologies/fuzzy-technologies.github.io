"""Build lossless WebP reading variants while preserving original images."""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "static/media"
MANIFEST = ROOT / "_data/image_variants.json"
WIDTHS = (480, 960, 1920)


def BuildVariants(checkOnly=False):
    metadata = {}
    originalBytes = 0
    readingBytes = 0
    for source in sorted((ROOT / "static/images").rglob("*")):
        if source.suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp"):
            continue
        if source.stat().st_size < 200_000:
            continue
        sourceBytes = source.read_bytes()
        digest = hashlib.sha256(sourceBytes).hexdigest()[:16]
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGBA")
            width, height = image.size
            variants = []
            for variantWidth in sorted({min(width, limit) for limit in WIDTHS}):
                variantHeight = max(1, round(height * variantWidth / width))
                destination = OUTPUT / f"{digest}-{variantWidth}.webp"
                if checkOnly:
                    if not destination.exists():
                        raise ValueError(f"Missing variant: {destination.relative_to(ROOT)}")
                    with Image.open(destination) as saved:
                        if saved.size != (variantWidth, variantHeight):
                            raise ValueError(f"Incorrect dimensions: {destination}")
                        expected = image if variantWidth == width else image.resize(
                            (variantWidth, variantHeight), Image.Resampling.LANCZOS
                        )
                        if saved.convert("RGBA").tobytes() != expected.tobytes():
                            raise ValueError(f"Lossless pixel mismatch: {destination}")
                elif not destination.exists():
                    OUTPUT.mkdir(parents=True, exist_ok=True)
                    resized = image if variantWidth == width else image.resize(
                        (variantWidth, variantHeight), Image.Resampling.LANCZOS
                    )
                    temporary = destination.with_suffix(".tmp")
                    resized.save(temporary, "WEBP", lossless=True, quality=100, method=6, exact=True)
                    temporary.replace(destination)
                variants.append({"url": "/" + str(destination.relative_to(ROOT)), "width": variantWidth})
            metadata["/" + str(source.relative_to(ROOT))] = {
                "width": width,
                "height": height,
                "srcset": ", ".join(f"{item['url']} {item['width']}w" for item in variants),
            }
            originalBytes += len(sourceBytes)
            selected = min(variants, key=lambda item: abs(item["width"] - 960))
            readingBytes += (ROOT / selected["url"].lstrip("/")).stat().st_size
    serialized = json.dumps(metadata, ensure_ascii=False, indent=2) + "\n"
    if checkOnly:
        if not MANIFEST.exists() or MANIFEST.read_text() != serialized:
            raise ValueError("Image manifest is stale; rebuild the variants")
    else:
        MANIFEST.parent.mkdir(parents=True, exist_ok=True)
        MANIFEST.write_text(serialized)
    print(json.dumps({"images": len(metadata), "originalBytes": originalBytes,
                      "reading960Bytes": readingBytes, "checkOnly": checkOnly}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate dimensions, lossless pixels and source hashes")
    arguments = parser.parse_args()
    BuildVariants(arguments.check)
