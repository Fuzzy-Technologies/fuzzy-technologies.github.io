# Neural-network illustrations

The 2024-10-13 classification article uses one biological illustration and eleven SVG diagrams. Figure numbers and localized captions belong in Markdown; labels inside shared illustrations are English. The English translation remains a placeholder. A PNG copy of the perceptron diagram is retained for social-image metadata.

The article opts into `full_width_images: true`. This expands images to the available article column while preserving their aspect ratio. Other articles retain their existing sizing.

Reproduce the mathematical diagrams with Python, Matplotlib and NumPy:

```sh
python _tools/render_neural_figures.py
```

The script checks all Boolean input combinations and 961 exact-rational samples for the triangle classifier before exporting the SVG files. Review the visual output after changes. Temporary PNG previews are written outside the repository.

The biological illustration is a separate raster asset. Its WebP encoding is lossless. Mathematical diagrams are generated from explicit coordinates and weights, not by image generation.

The tables and diagrams use activation at zero consistently with equation (2). For the triangular region, the third hidden neuron's bias is +1: its boundary is `1 - x1 - x2 = 0`. The output AND neuron uses bias -2.5. The XOR output neuron's boundary is in hidden-output coordinates, not the original input plane.
