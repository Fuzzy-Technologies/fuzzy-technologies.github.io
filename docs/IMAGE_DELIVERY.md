# Article image delivery

Keep the original PNG/JPEG files and their existing Markdown paths. Article and article-index layouts wrap supported images in `picture` elements at build time. Browsers select lossless WebP variants using their viewport and pixel density; the original remains the fallback and opens in the image viewer.

The variants use widths up to 480, 960 and 1920 pixels without upscaling. Smaller variants are resized for reading, so they are not pixel-identical to the source. WebP encoding itself is lossless, and original-size variants are checked pixel by pixel. Full-resolution source files are never overwritten by this process.

After adding or replacing a large image, run:

```sh
python -m pip install -r requirements-media.txt
python scripts/build_image_variants.py
python scripts/build_image_variants.py --check
```

Commit the resulting `_data/image_variants.json` and `static/media/` files with the image change. The original-content hash in variant filenames prevents stale cached derivatives after an original file is replaced. No custom Jekyll plugin or production JavaScript is required for responsive delivery. Images below 200 kB keep their existing markup.

Dimensions reserve space before decoding. The first optimized image loads eagerly; subsequent images load lazily and decode asynchronously. Social-image metadata keeps the original PNG/JPEG for crawler compatibility.

Long-form article pages use a solid dark canvas, static glow and a static gradient. Continuous image/text glitches, animated shadows and the fixed scan texture are disabled on these reading pages to reduce painting/compositing work during scrolling. Other product pages retain their effects.

Validation should cover the generated picture markup, original-file lightbox behavior, small-image fallback and unchanged article destinations. Measure transfers and inspect scrolling on the affected device; a lower image/paint workload does not prove that a device-specific graphics-driver problem is fixed.
