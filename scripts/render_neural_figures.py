"""Reproduce the article's vector figures and validate its classifier examples."""

from pathlib import Path
import itertools
import json
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch, Polygon
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "static/images/articles/2024-10-13-neural-network-classification"
BG, PANEL = "#080e17", "#101d2c"
TEXT, MUTED = "#ecf5fb", "#8aabc0"
CYAN, PINK, GREEN, AMBER = "#55e7ff", "#ff63ce", "#76f5b2", "#ffd17c"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 19,
                     "mathtext.fontset": "dejavusans", "svg.fonttype": "none",
                     "svg.hashsalt": "fuzzy-neural-figures", "axes.unicode_minus": False})


def Canvas():
    figure, axis = plt.subplots(figsize=(16, 9), dpi=100, facecolor=BG)
    axis.set_facecolor(BG)
    figure.subplots_adjust(left=0.07, right=0.95, bottom=0.09, top=0.95)
    return figure, axis


def Text(axis, x, y, label, color=TEXT, size=21, **kwargs):
    return axis.text(x, y, label, color=color, fontsize=size, va="center", **kwargs)


def Arrow(axis, start, end, color=TEXT, width=2.4, **kwargs):
    axis.annotate("", xy=end, xytext=start,
                  arrowprops={"arrowstyle": "-|>", "color": color, "lw": width,
                              "mutation_scale": 20, "shrinkA": 0, "shrinkB": 0, **kwargs})


def Save(figure, name, png=False):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    figure.savefig(OUTPUT / (name + ".svg"), facecolor=BG, metadata={"Date": None})
    if png:
        figure.savefig(OUTPUT / (name + ".png"), facecolor=BG, dpi=100)
    preview = ROOT.parent / "neural-review"
    preview.mkdir(exist_ok=True)
    figure.savefig(preview / (name + ".png"), facecolor=BG, dpi=100)
    plt.close(figure)


def Axes(axis, xRange, yRange):
    axis.set_xlim(*xRange)
    axis.set_ylim(*yRange)
    axis.set_aspect("equal", adjustable="box")
    axis.axis("off")
    for x in np.arange(np.ceil(xRange[0]), xRange[1], 1):
        axis.plot([x, x], yRange, color="#132538", lw=0.8, zorder=0)
    for y in np.arange(np.ceil(yRange[0]), yRange[1], 1):
        axis.plot(xRange, [y, y], color="#132538", lw=0.8, zorder=0)
    Arrow(axis, (xRange[0], 0), (xRange[1] - 0.06, 0), MUTED, 1.5)
    Arrow(axis, (0, yRange[0]), (0, yRange[1] - 0.08), MUTED, 1.5)
    Text(axis, xRange[1] - 0.23, -0.24, "$x_1$", MUTED)
    Text(axis, -0.25, yRange[1] - 0.18, "$x_2$", MUTED, ha="right")


def Boundary(axis, bias, color=TEXT, label=None, at=None):
    x = np.linspace(*axis.get_xlim(), 200)
    axis.plot(x, bias - x, color=color, lw=2.7, zorder=2)
    if label and at:
        Text(axis, *at, label, color, 21, rotation=-45, rotation_mode="anchor",
             bbox={"facecolor": BG, "edgecolor": "none", "pad": 3})


def Point(axis, coordinate, label=None, color=CYAN, offset=(0.1, 0.12), size=110):
    axis.scatter(*coordinate, s=size, color=color, edgecolors=BG, linewidth=1.6, zorder=6)
    if label:
        Text(axis, coordinate[0] + offset[0], coordinate[1] + offset[1], label, color, 20)


def BooleanPlane(name, gate, threshold):
    figure, axis = Canvas()
    Axes(axis, (-0.85, 2.85), (-0.65, 1.9))
    x = np.linspace(-0.85, 2.85, 200)
    axis.fill_between(x, threshold - x, 1.9, color=PINK, alpha=0.055)
    Boundary(axis, threshold, label=rf"$x_1+x_2={threshold:g}$", at=(0.95, threshold - 0.95 + 0.15))
    for a, b in itertools.product((0, 1), repeat=2):
        result = int(a + b >= threshold)
        offsets = {(0, 0): (-0.55, -0.23), (0, 1): (-0.57, 0.17),
                   (1, 0): (0.1, -0.23), (1, 1): (0.1, 0.17)}
        Point(axis, (a, b), f"$({a},{b})$", PINK if result else CYAN, offsets[a, b], 180)
    Arrow(axis, (1.85, 0.95), (2.25, 1.35), GREEN, 3)
    Text(axis, 1.82, 1.55, "$w'=(1,1)$", GREEN)
    Text(axis, -0.7, 1.68, "$y=0$", CYAN, 19)
    Text(axis, -0.15, 1.68, "$y=1$", PINK, 19)
    Save(figure, name)


def Node(axis, center, label, radius=0.57, color=CYAN):
    axis.add_patch(Circle(center, radius + 0.09, color=color, alpha=0.06))
    axis.add_patch(Circle(center, radius, facecolor=PANEL, edgecolor=color, lw=2.7, zorder=4))
    Text(axis, *center, label, color, 23, ha="center", zorder=5)


def Link(axis, start, end, label=None, labelAt=None, color=CYAN, endRadius=0.6, startRadius=0):
    start, end = np.array(start, float), np.array(end, float)
    direction = (end - start) / np.linalg.norm(end - start)
    Arrow(axis, start + direction * startRadius, end - direction * endRadius, color)
    if label:
        at = labelAt if labelAt else (start + end) / 2
        Text(axis, *at, label, color, 20,
             bbox={"facecolor": BG, "edgecolor": "none", "pad": 2.5})


def DiagramAxes(axis):
    axis.set_xlim(0, 16)
    axis.set_ylim(0, 9)
    axis.axis("off")


def Perceptron():
    figure, axis = Canvas()
    DiagramAxes(axis)
    center = (7, 4.4)
    Node(axis, center, "$\Sigma$", 0.8)
    for subscript, y, weight in [("1", 6.8, "1"), ("2", 4.4, "2"), ("n", 1.8, "n")]:
        Text(axis, 1, y, "$x_" + subscript + "$", CYAN, 27)
        Link(axis, (1.9, y), center, "$w_" + weight + "$", (3.6, y + 0.18), endRadius=0.83)
    Text(axis, 1.15, 3.0, "$\vdots$", MUTED, 25)
    Text(axis, 4.0, 3.0, "$\vdots$", MUTED, 25)
    Text(axis, 1.0, 8.2, "Inputs", MUTED)
    Text(axis, 3.5, 8.2, "Weights", MUTED)
    Text(axis, 7, 8.2, "Bias", MUTED, ha="center")
    Link(axis, (7, 7.5), center, "$x_0=1\quad w_0$", (7.3, 6.7), endRadius=0.83)
    Link(axis, center, (10.1, 4.4), "$u$", (8.55, 4.78), endRadius=0, startRadius=0.83)
    axis.add_patch(FancyBboxPatch((10.1, 3.35), 2, 2.1, boxstyle="round,pad=0.12", facecolor=PANEL, edgecolor=PINK, lw=2.7))
    Text(axis, 11.1, 4.4, "$f(u)$", PINK, 32, ha="center")
    Link(axis, (12.25, 4.4), (14.7, 4.4), endRadius=0, color=GREEN)
    Text(axis, 15, 4.4, "$y$", GREEN, 29)
    Text(axis, 7, 1.0, "$u=\sum_{i=0}^{n} w_i x_i$", CYAN, 26, ha="center")
    Text(axis, 11.15, 2.4, "Activation", PINK, ha="center")
    Text(axis, 14.6, 2.4, "Output", GREEN, ha="center")
    Save(figure, "02-perceptron", png=True)


def SingleGate(name, gate, bias):
    figure, axis = Canvas()
    DiagramAxes(axis)
    center = (7.4, 4.3)
    for i, y in [(1, 6.5), (2, 2.1)]:
        Text(axis, 1.15, y, rf"$x_{i}$", CYAN, 28)
        Link(axis, (2.0, y), center, rf"$w_{i}=1$", (3.6, y + 0.05), endRadius=0.86)
    Node(axis, center, gate, 0.84, PINK)
    Link(axis, (7.4, 8.0), center, rf"$x_0=1$" + "\n" + rf"$w_0={bias:g}$", (7.85, 7.1), color=GREEN, endRadius=0.88)
    Link(axis, center, (11.4, 4.3), color=GREEN, endRadius=0, startRadius=0.87)
    Text(axis, 11.65, 4.3, rf"$y=x_1\;\mathrm{{{gate}}}\;x_2$", GREEN, 25)
    Text(axis, 7.4, 1.0, rf"$u={bias:g}+x_1+x_2$", MUTED, 23, ha="center")
    Save(figure, name)


def Geometry():
    figure, axis = Canvas()
    Axes(axis, (-4.0, 5.8), (-3.0, 4.7))
    normal = np.array([1.6, 1.0])
    t = np.linspace(-3.0, 4.0, 100)
    axis.plot(t * normal[0], t * normal[1], "--", color=MUTED, lw=1.5)
    x = np.linspace(-4, 5.8, 200)
    axis.plot(x, 1.4 - 1.6 * x, color=TEXT, lw=3)
    Text(axis, 1.7, -0.7, "$w_1x_1+w_2x_2+w_0=0$", TEXT, 20, rotation=-58,
         bbox={"facecolor": BG, "edgecolor": "none", "pad": 3})
    first, second = np.array([-2.7, 0.65]), np.array([2.35, 3.2])
    blue = [first, (-2.7, -0.75), (-2.95, -1.04), (-1.85, -0.75), (-2.1, -1.65), (-1.6, -1.95), (-1.32, -1.95), (-2.38, -2.45)]
    red = [second, (2.0, 3.2), (2.13, 2.84), (2.61, 2.84), (2.28, 2.55), (1.78, 2.53), (1.79, 1.72), (3.42, 2.32)]
    for p in blue: Point(axis, p, color=CYAN)
    for p in red: Point(axis, p, color=PINK)
    for p in [(-1.85, 3.52), (2.15, -2.15), (4.65, -1.65)]:
        Point(axis, p, "?", AMBER, (0.18, -0.1), 95)
    for n, vector, color in [(1, first, CYAN), (2, second, PINK)]:
        projection = normal * np.dot(normal, vector) / np.dot(normal, normal)
        Arrow(axis, (0, 0), vector, color, 2.8)
        axis.plot([vector[0], projection[0]], [vector[1], projection[1]], "--", color=color, lw=1.8)
        Arrow(axis, (0, 0), projection, color, 3.3)
        Text(axis, projection[0] + 0.18, projection[1] - 0.3, rf"$x^{{{n}}}_{{w'}}$", color)
    Text(axis, -3.85, 1.18, "$x^1=(x_1^1,x_2^1)$", CYAN)
    Text(axis, 1.65, 3.93, "$x^2=(x_1^2,x_2^2)$", PINK)
    Arrow(axis, (3.7, 1.15), (4.75, 1.8), GREEN, 3.2)
    Text(axis, 3.58, 0.7, "$w'=(w_1,w_2)$", GREEN)
    Save(figure, "45-classification")

    figure, axis = Canvas()
    Axes(axis, (-4.3, 5.5), (-2.9, 4.1))
    axis.plot([-3, 4.5], [-3, 4.5], "--", color=MUTED, lw=1.7)
    Boundary(axis, 2, label="$-2+x_1+x_2=0$", at=(0.1, 2.12))
    a, b, projection = (2, 2), (-3, 2), (-0.5, -0.5)
    Arrow(axis, (0, 0), a, PINK, 3.2)
    Arrow(axis, (0, 0), b, CYAN, 3.2)
    axis.plot([b[0], projection[0]], [b[1], projection[1]], "--", color=CYAN, lw=2.1)
    Arrow(axis, (0, 0), projection, CYAN, 3.2)
    Point(axis, a, "$a=(2,2)$", PINK, (0.15, 0.25), 180)
    Point(axis, b, "$b=(-3,2)$", CYAN, (-0.85, 0.35), 180)
    Point(axis, projection, "$B'$", CYAN, (0.13, -0.35), 65)
    # The projection segment is perpendicular to the normal line.
    axis.plot([-0.5, -0.72, -0.5], [-0.18, -0.40, -0.62], color=CYAN, lw=1.2)
    Arrow(axis, (3.0, 2.55), (3.85, 3.4), GREEN, 3.2)
    Text(axis, 3.85, 2.78, "$w'=(1,1)$", GREEN)
    Text(axis, 0.05, -2.37, "$a_{w'}=4/\sqrt{2}\qquad b_{w'}=-1/\sqrt{2}$", MUTED, 22)
    Save(figure, "50-classification")


def XorPlane():
    figure, axis = Canvas()
    Axes(axis, (-0.85, 3.25), (-0.72, 2.0))
    x = np.linspace(-0.85, 3.25, 200)
    axis.fill_between(x, 0.5 - x, 1.5 - x, color=PINK, alpha=0.08, hatch="//", edgecolor="#532741", linewidth=0)
    Boundary(axis, 0.5, CYAN)
    Boundary(axis, 1.5, PINK)
    for a, b in itertools.product((0, 1), repeat=2):
        Point(axis, (a, b), f"$({a},{b})$", PINK if a != b else CYAN,
              (-0.53 if a == 0 else 0.1, -0.24 if b == 0 else 0.17), 180)
    Text(axis, 1.54, 1.83, "$x_1+x_2=0.5$", CYAN, 20)
    Text(axis, 1.54, 1.55, "$-x_1-x_2=-1.5$", PINK, 20)
    Arrow(axis, (1.75, 0.38), (2.12, 0.75), GREEN, 2.8)
    Text(axis, 2.02, 0.17, "$w^{1\prime}=(1,1)$", GREEN, 18)
    Arrow(axis, (2.12, 1.32), (1.75, 0.95), AMBER, 2.8)
    Text(axis, 2.16, 1.16, "$w^{2\prime}=(-1,-1)$", AMBER, 18)
    Text(axis, -0.73, 1.79, "Input space", MUTED, 19)
    Text(axis, 0.10, -0.56, "Output AND acts on hidden outputs:  $w^{3\prime}=(1,1)$", MUTED, 17)
    Save(figure, "64-classification")


def XorNetwork():
    figure, axis = Canvas()
    DiagramAxes(axis)
    inputs = [(1.3, 5.8), (1.3, 2.8)]
    hidden = [(6.0, 6.2), (6.0, 2.3)]
    output = (11, 4.35)
    for i, position in enumerate(inputs, 1): Text(axis, position[0] - 0.8, position[1], rf"$x_{i}$", CYAN, 26)
    for i, start in enumerate(inputs, 1):
        for j, end in enumerate(hidden, 1):
            value = 1 if j == 1 else -1
            at = {(1, 1): (2.5, 6.4), (1, 2): (2.2, 4.55), (2, 1): (4.0, 4.4), (2, 2): (2.5, 2.15)}[i, j]
            Link(axis, start, end, rf"$w_{i}^{j}={value}$", at, color=CYAN if j == 1 else PINK)
    for j, center in enumerate(hidden, 1):
        Node(axis, center, "OR" if j == 1 else "NAND", color=CYAN if j == 1 else PINK)
        bias = -0.5 if j == 1 else 1.5
        Link(axis, (center[0], center[1] + 1.75), center, rf"$x_0^{j}=1,\ w_0^{j}={bias:g}$",
             (center[0] + 0.35, center[1] + 1.25), color=GREEN)
        Link(axis, center, output, rf"$w_{j}^{3}=1$", (8.0, 5.5 if j == 1 else 2.95), color=GREEN, startRadius=0.6)
    Node(axis, output, "AND", color=GREEN)
    Link(axis, (11, 7.6), output, "$x_0^3=1,\ w_0^3=-1.5$", (11.4, 6.8), color=GREEN)
    Link(axis, output, (13.6, 4.35), color=TEXT, startRadius=0.6, endRadius=0)
    Text(axis, 13.75, 4.35, "$y=x_1\oplus x_2$", TEXT, 22)
    Text(axis, 6.0, 0.5, "Hidden layer", MUTED, ha="center")
    Text(axis, 11.0, 0.5, "Output layer", MUTED, ha="center")
    Save(figure, "65-classification")


def Triangle():
    figure, axis = Canvas()
    Axes(axis, (-0.75, 2.5), (-0.65, 1.75))
    axis.add_patch(Polygon([(0, 0), (1, 0), (0, 1)], facecolor=PINK, alpha=0.14, edgecolor=PINK, hatch="//"))
    Boundary(axis, 1, label="$1-x_1-x_2=0$", at=(0.47, 0.7))
    axis.plot([0, 0], [-0.65, 1.75], color=CYAN, lw=2.7)
    axis.plot([-0.75, 2.5], [0, 0], color=GREEN, lw=2.7)
    for p, offset in [((0, 0), (-0.5, -0.22)), ((1, 0), (0.13, 0.18)), ((0, 1), (-0.5, 0.18))]:
        Point(axis, p, f"$({p[0]},{p[1]})$", PINK, offset, 150)
    Arrow(axis, (0.25, -0.3), (0.75, -0.3), CYAN)
    Text(axis, 0.3, -0.51, "$w^{1\prime}=(1,0)$", CYAN, 18)
    Arrow(axis, (1.5, 0.35), (1.5, 0.85), GREEN)
    Text(axis, 1.58, 0.53, "$w^{2\prime}=(0,1)$", GREEN, 18)
    Arrow(axis, (1.35, 1.5), (1.02, 1.17), AMBER)
    Text(axis, 1.47, 1.31, "$w^{3\prime}=(-1,-1)$", AMBER, 18)
    Save(figure, "67-classification")

    figure, axis = Canvas()
    DiagramAxes(axis)
    first, second = (1.25, 6.7), (1.25, 2.5)
    centers = [(6.0, 7.0), (6.0, 4.2), (6.0, 1.45)]
    output = (11.5, 4.2)
    Text(axis, 0.4, first[1], "$x_1$", CYAN, 27)
    Text(axis, 0.4, second[1], "$x_2$", CYAN, 27)
    Link(axis, first, centers[0], "$w_1^1=1$", (3.1, 7.25))
    Link(axis, second, centers[1], "$w_2^2=1$", (3.4, 3.6))
    Link(axis, first, centers[2], "$w_1^3=-1$", (2.35, 5.25), color=PINK)
    Link(axis, second, centers[2], "$w_2^3=-1$", (2.25, 1.58), color=PINK)
    for j, center in enumerate(centers, 1):
        Node(axis, center, rf"$h_{j}$", color=PINK if j == 3 else CYAN)
        Link(axis, center, output, rf"$w_{j}^4=1$", (8.1, [6.4, 4.6, 2.1][j - 1]), color=GREEN, startRadius=0.6)
    Link(axis, (6, 3.15), centers[2], "$x_0^3=1,\ w_0^3=1$", (6.37, 2.75), color=PINK)
    Node(axis, output, "AND", color=GREEN)
    Link(axis, (11.5, 7.7), output, "$x_0^4=1,\ w_0^4=-2.5$", (11.8, 6.7), color=GREEN)
    Link(axis, output, (14.3, 4.2), color=TEXT, startRadius=0.6, endRadius=0)
    Text(axis, 14.6, 4.2, "$y$", TEXT, 28)
    Save(figure, "68-classification")


def ValidateClassifiers():
    step = lambda value: int(value >= 0)
    rows = []
    for a, b in itertools.product((0, 1), repeat=2):
        conjunction, disjunction = step(a + b - 1.5), step(a + b - 0.5)
        nand = step(1.5 - a - b)
        xor = step(disjunction + nand - 1.5)
        assert conjunction == (a and b) and disjunction == (a or b) and xor == (a != b)
        rows.append([a, b, conjunction, disjunction, nand, xor])
    for a, b in itertools.product(np.linspace(-1, 2, 31), repeat=2):
        hidden = [step(a), step(b), step(1 - a - b)]
        output = step(sum(hidden) - 2.5)
        assert output == (a >= 0 and b >= 0 and a + b <= 1)
    print(json.dumps({"truthRows": rows, "triangleSamples": 961, "status": "PASS"}))


if __name__ == "__main__":
    ValidateClassifiers()
    Perceptron()
    Geometry()
    BooleanPlane("58-classification", "AND", 1.5)
    SingleGate("59-classification", "AND", -1.5)
    BooleanPlane("61-classification", "OR", 0.5)
    SingleGate("62-classification", "OR", -0.5)
    XorPlane()
    XorNetwork()
    Triangle()
