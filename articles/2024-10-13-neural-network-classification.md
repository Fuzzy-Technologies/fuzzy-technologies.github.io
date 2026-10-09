---
layout: article
math: true
lang: en
title: Neural networks for linear and nonlinear classification
description: 'One of my earliest articles on neural networks, based on teaching materials from 2008. We examine the perceptron, supervised learning, linear class separation, and the AND, OR and XOR functions: the basic mathematics behind neural networks.'
keywords: FMA Research, mathematics, data analysis, fuzzy logic, research archive
date: 2024-10-13
author: Timur Gilmullin
series: FMA Research
series_url: /FMA/
permalink: /articles/2024-10-13-neural-network-classification/
alternate_en: /articles/2024-10-13-neural-network-classification/
alternate_ru: /ru/articles/2024-10-13-neural-network-classification/
preview_image: /static/images/articles/2024-10-13-neural-network-classification/01-classification.webp
preview_text: 'One of my earliest articles on neural networks, based on teaching materials from 2008. We examine the perceptron, supervised learning, linear class separation, and the AND, OR and XOR functions: the basic mathematics behind neural networks.'
cover_image: /static/images/articles/2024-10-13-neural-network-classification/02-perceptron.png
source_url: https://teletype.in/@tgilmullin/Neural-Network-Classification-Solutions
full_width_images: true
---
*Based on laboratory assignments for the Neural Computing Systems course, 2008. Department of Information Security, A. N. Tupolev Kazan State Technical University (KAI). [First published](https://math-n-algo.blogspot.com/2013/04/blog-post.html) in 2013. Author: T. M. Gilmullin, Candidate of Technical Sciences.*

## 1. An overview of neural systems

For many years, neural networks have attracted considerable interest and have been successfully applied in a wide range of fields: business, medicine, engineering, geology and physics. They have become practical tools wherever forecasting, classification or control problems arise. Several factors explain their success.

**The capabilities of neural networks.** Neural networks are a powerful modelling method capable of representing very complex relationships. In particular, they can model nonlinear behaviour. For many years, linear modelling dominated most fields because well-developed optimisation procedures were available for it. Where a linear approximation is inadequate—and there are plenty of such problems—linear models perform poorly. Neural networks also address problems in which linear models cannot capture the relationships among a large number of variables.

**Ease of use.** Neural networks learn from examples. The user selects representative data and runs a training algorithm that automatically captures the structure of those data. Of course, the user still needs some practical knowledge of how to select and prepare data, choose an appropriate network architecture and interpret the results. The depth of that knowledge depends on the problem and the requirements placed on the solution.

Neural networks are also intuitively appealing: they are based on a simplified biological model of the nervous system. Early researchers hoped that developing such models would bring us closer to understanding thought.

**The connection with biology.** Neural networks emerged from artificial intelligence research, specifically from attempts to reproduce the ability of biological nervous systems to learn and correct errors by modelling the brain's low-level structure.

Expert systems were a major area of artificial intelligence research from the 1960s to the 1980s. They relied on high-level models of thought, particularly the idea that thinking consists of manipulating symbols. It soon became clear that, although useful in some fields, these systems failed to capture certain key aspects of human intelligence. One explanation was that they did not reproduce the brain's structure. This prompted the idea of building systems with a similar architecture.

The brain consists of a very large number of neurons connected by numerous links—on average, several thousand connections per neuron, although the number varies considerably.

***Neurons*** are specialised cells capable of propagating electrochemical signals (see Fig. 1). A neuron has a branching input structure (***dendrites***), a nucleus and a branching output (the ***axon***). Its axon connects to the dendrites of other cells through ***synapses***. When activated, a neuron sends an electrochemical signal along its axon. Through the synapses, this signal reaches other neurons, which may then activate in turn. A neuron activates when the combined level of signals arriving from its dendrites exceeds a certain level—the ***activation threshold***.

![A schematic illustration of a biological neuron](/static/images/articles/2024-10-13-neural-network-classification/01-classification.webp)

*Fig. 1. A schematic illustration of a biological neuron*

The strength of the signal a neuron receives, and therefore the likelihood of its activation, depends strongly on synaptic activity. At chemical synapses, signals pass between cells through specialised substances called neurotransmitters.

Donald Hebb, an influential researcher in neural systems, proposed that learning primarily involves changes in the strength of synaptic connections. For example, in Pavlov's classic experiment, a bell rang immediately before a dog was fed. The dog quickly learned to associate the bell with food. In this simplified illustration, repeatedly pairing the two stimuli reinforces the connection between them: the sound begins to induce salivation before the food appears.

Thus, a system composed of a very large number of simple elements—each taking a weighted sum of input signals and passing a signal on when that sum exceeds a certain level—can solve extremely complex problems.

## 2. The mathematical neuron: a perceptron

![A perceptron: an artificial neuron](/static/images/articles/2024-10-13-neural-network-classification/02-perceptron.svg)

*Fig. 2. A perceptron: an artificial neuron*

A ***simple perceptron*** is a McCulloch–Pitts artificial neuron (see Fig. 2). Its structure contains the following elements.

$x=(x\_0,\\ldots,x\_n)$ is the neuron's ***input vector***.

Its components are also denoted by $x\_i,\\quad i=0,\\ldots,n$. In practice, we usually set $x\_0=1$.

$w=(w\_0,\\ldots,w\_n)$ is the ***weight vector*** associated with the neuron's inputs.

The weights are also denoted by $w\_i,\\quad i=0,\\ldots,n$.

$w\_0$ is the neuron's **bias**, which sets its activation threshold.

```math
u=\sum_{i=0}^{n}w_i x_i\qquad\text{(1)}
```

This is the ***neuron's summation unit***.

Its output, *u*, is therefore a linear combination of all the neuron's input signals and their corresponding weights.

In the general case, $x\_i,w\_i$ are elements of an arbitrary numerical field.

If we represent the vector components as one-dimensional matrices, equation (1) can be written in matrix form:

$u=wx$, using the transposed matrix $x=(x\_0,\\ldots,x\_n)^T$.

```math
y=f(u)=\begin{cases}1,&u\geq0,\\0,&u<0.\end{cases}\qquad\text{(2)}
```

This is the perceptron's ***nonlinear activation function***. It is a step function: *f(u)* converts the summation unit's output into the neuron's output signal, *y*.

Another activation function often used in practice is:

```math
y=f(u)=\begin{cases}1,&u\geq0,\\-1,&u<0.\end{cases}
```

### 2.1. Supervised training of a perceptron on individual examples

***Training a perceptron*** means selecting weights $w\_i,\\quad i=0,\\ldots,n$ so that, for each input vector $x=(x\_0,\\ldots,x\_n)$, the perceptron's output $y\\in\\{0,1\\}$ matches the required value $d\\in\\{0,1\\}$. When the required output is supplied for each input vector, this is called ***supervised learning***. The collection of training input vectors forms the ***training set***.

The **algorithm for training a perceptron on individual examples** consists of the following steps.

**1.** Set the initial weight vector $w=(w\_0,\\ldots,w\_n)$ randomly or using a specific initialisation method.

**2.** Feed the neuron a vector $x=(x\_0,\\ldots,x\_n)$ from the training set, with its known target output *d*, and calculate the actual output *y* using equation (2). Compare *y* with *d* to determine how to update the weights.

**3.** If $y=d$, leave $w\_i,\\quad i=0,\\ldots,n$ unchanged.

**4.** If $y=0,\\quad d=1$, update the weights for the next training cycle as follows:

```math
w_i(t+1)=w_i(t)+\alpha x_i,\quad\alpha\in(0,1)
```

Here, *α* is the ***learning rate*** and *t* is the index of the current training cycle (***training epoch***).

**5.** If $y=1,\\quad d=0$, update the weights using:

```math
w_i(t+1)=w_i(t)-\alpha x_i,\quad\alpha\in(0,1)
```

Steps 3, 4 and 5 of the supervised learning algorithm can be combined into a single expression:

```math
w_i(t+1)=w_i(t)+\alpha(d-y)x_i,\quad\alpha\in(0,1)
```

After updating the weights, present the perceptron with the next training vector *x* and its expected output *d*, and update the weights again. Repeat this process over the entire training set until the differences between all actual outputs *y* and their target values *d* have been eliminated, or the training error falls below a predefined tolerance.

## 3. Linearly separating a set into two classes

The perceptron is associated with the classical problem of linearly separating a set of elements into two distinct classes. This requires constructing a ***linear decision rule***: finding a weight vector $w=(w\_0,\\ldots,w\_n)$, where $w\_0$ is the bias, such that an input vector x belongs to the first class when the perceptron's activation function gives $y=f(u)>0$, and to the second class when $y=f(u)\\leq0$.

The ***centre-of-mass separation method*** is a simple way to construct a decision rule. In this method, the initial weight vector is calculated as:

```math
w=\frac{\sum_{i=1}^{k}x^i-\sum_{j=1}^{l}y^j}{k+l}\qquad\text{(3)}
```

Here, the vectors $x^i,\\quad i=1,\\ldots,k$ belong to the first class, and the vectors $y^j,\\quad j=1,\\ldots,l$ belong to the second.

Linear decision rules based on centre-of-mass separation may misclassify examples in the training set even when an exact linear separation exists. Nevertheless, the method is often used to initialise the weight vector *w* for perceptron training algorithms.

### 3.1. Geometric interpretation

Consider a standard McCulloch–Pitts perceptron. Its linear decision rule divides the input vector space into two parts separated by a hyperplane. Input vectors are assigned to the first class if the output signal is $y>0$, and to the second if $y\\leq0$. The separating hyperplane is described by:

```math
(w,x)=0
```

Expanding the dot product in terms of the vector coordinates gives:

```math
\sum_{i=0}^{n}w_i x_i=0,\quad x_0=1\qquad\text{(4)}
```

In the *n*-dimensional space of the perceptron's input signals, the normal vector $w'=(w\_1,\\ldots,w\_n)$ is perpendicular to the separating hyperplane (4).

The normal arrows in the figures indicate direction; their lengths are schematic.

The scalar projection of the vector *x* onto the direction of the normal *w'* is:

```math
x_{w'}=\frac{(w',x)}{\lVert w'\rVert}
```

Or, in coordinates:

```math
x_{w'}=\frac{\sum_{i=1}^{n}w'_i x_i}{\sqrt{\sum_{i=1}^{n}(w'_i)^2}}\qquad\text{(5)}
```

For an input vector $x=(x\_1,\\ldots,x\_n)$, where we omit $x\_0=1$ unless otherwise stated, the perceptron produces:

```math
y=\begin{cases}1,&x_{w'}\geq-\dfrac{w_0}{\lVert w'\rVert},\\0,&x_{w'}<-\dfrac{w_0}{\lVert w'\rVert}.\end{cases}\qquad\text{(6)}
```

Figure 3 illustrates the separation of a set into two classes in a two-dimensional space (*n* = 2).

![Geometric interpretation of separating two classes in a plane](/static/images/articles/2024-10-13-neural-network-classification/45-classification.svg)

*Fig. 3. Geometric interpretation of separating two classes in a plane*

### 3.2. An example of separating a set into two classes

Consider the following example. In a two-dimensional input space, the hyperplane becomes a straight line:

```math
w_0+w_1x_1+w_2x_2=0
```

Let $w\_1=w\_2=1,\\quad w\_0=-2$. The equation of the line is then:

```math
-2+x_1+x_2=0
```

This line, shown in Fig. 4, intersects the coordinate axes at (2, 0) and (0, 2).

$w'=(1,1)$ is a normal to the line.

![A separating line and two vectors from different classes](/static/images/articles/2024-10-13-neural-network-classification/50-classification.svg)

*Fig. 4. A separating line and two vectors from different classes*

Suppose we have two position vectors:

$a=(2,2),\\quad b=(-3,2)$. We need to assign each to a class according to its endpoint's position relative to the separating line.

Using equation (5), their scalar projections onto the direction of the normal *w'* are:

```math
a_{w'}=\frac{4}{\sqrt{2}},\quad b_{w'}=-\frac{1}{\sqrt{2}}
```

We can now determine which class each vector belongs to.

The vector $a=(2,2)$ belongs to the first class: equation (6) gives a perceptron output of 1 because $a\_{w'}>\\frac{2}{\\sqrt{2}}$.

The vector $b=(-3,2)$ belongs to the second class: the output is 0 because $b\_{w'}<\\frac{2}{\\sqrt{2}}$.

### 3.3. Implementing the Boolean functions AND and OR with a perceptron

It is easy to verify that a single-layer perceptron can implement the Boolean functions *AND* and *OR*. To keep the examples compact, we will give only the required parameters and diagrams of the hyperplanes—in this case, straight lines—and the perceptrons.

The parameters for *AND* are shown below. See Fig. 5 for the hyperplane and Fig. 6 for the perceptron.

| Parameter          | Value                           |
| ------------------ | ------------------------------- |
| Separating line    | $x\_1+x\_2=1.5$                 |
| Weight vector      | $w=(w\_0,w\_1,w\_2)=(-1.5,1,1)$ |
| Normal vector      | $w'=(1,1)$                      |

| $x\_1$ | $x\_2$ | $y=x\_1\\,\\mathrm{AND}\\,x\_2$ |
| ------ | ------ | ------------------------------- |
| 0      | 0      | 0                               |
| 0      | 1      | 0                               |
| 1      | 0      | 0                               |
| 1      | 1      | 1                               |

![The separating line for AND](/static/images/articles/2024-10-13-neural-network-classification/58-classification.svg)

*Fig. 5. The separating line for AND*

![A perceptron implementing AND](/static/images/articles/2024-10-13-neural-network-classification/59-classification.svg)

*Fig. 6. A perceptron implementing AND*

The parameters for *OR* are shown below. See Fig. 7 for the hyperplane and Fig. 8 for the perceptron.

| Parameter          | Value                           |
| ------------------ | ------------------------------- |
| Separating line    | $x\_1+x\_2=0.5$                 |
| Weight vector      | $w=(w\_0,w\_1,w\_2)=(-0.5,1,1)$ |
| Normal vector      | $w'=(1,1)$                      |

| $x\_1$ | $x\_2$ | $y=x\_1\\,\\mathrm{OR}\\,x\_2$ |
| ------ | ------ | ------------------------------ |
| 0      | 0      | 0                              |
| 0      | 1      | 1                              |
| 1      | 0      | 1                              |
| 1      | 1      | 1                              |

![The separating line for OR](/static/images/articles/2024-10-13-neural-network-classification/61-classification.svg)

*Fig. 7. The separating line for OR*

![A perceptron implementing OR](/static/images/articles/2024-10-13-neural-network-classification/62-classification.svg)

*Fig. 8. A perceptron implementing OR*

## 4. Nonlinear separation of a set into two classes

As shown above, a single-layer perceptron can solve linearly separable classification problems and implement the Boolean functions *AND* and *OR*. It cannot, however, reproduce *XOR* (*exclusive OR*) or perform more general classifications, such as separating points inside convex or non-convex regions of a plane. Adding layers of perceptrons can overcome these limitations.

We will now examine how to implement *XOR* and how to classify points within a convex triangular region of a plane.

### 4.1. Implementing XOR with a network of perceptrons

The *XOR* function can be implemented by a two-layer neural network. Its first layer contains two perceptrons implementing *OR* and *NOT*(*AND*). The second layer contains a perceptron that applies *AND* to the two outputs of the first layer.

The parameters for *XOR* are shown below. See Fig. 9 for the hyperplanes and Fig. 10 for the network.

| Perceptron        | Separating line    | Weight vector     | Normal vector    |
| ----------------- | ------------------ | ----------------- | ---------------- |
| First layer: OR   | $x\_1+x\_2=0.5$    | $w^1=(-0.5,1,1)$  | $w^{1'}=(1,1)$   |
| First layer: NAND | $-x\_1-x\_2=-1.5$  | $w^2=(1.5,-1,-1)$ | $w^{2'}=(-1,-1)$ |
| Second layer: AND | $h\_1+h\_2=1.5$    | $w^3=(-1.5,1,1)$  | $w^{3'}=(1,1)$   |

Here, $h\_1$ and $h\_2$ are the outputs of the first layer. The output perceptron's separating line is defined in the space of those outputs.

| $x\_1$ | $x\_2$ | $h\_1=x\_1\\,\\mathrm{OR}\\,x\_2$ | $h\_2=x\_1\\,\\mathrm{NAND}\\,x\_2$ | $y=x\_1\\oplus x\_2$ |
| ------ | ------ | --------------------------------- | ----------------------------------- | -------------------- |
| 0      | 0      | 0                                 | 1                                   | 0                    |
| 0      | 1      | 1                                 | 1                                   | 1                    |
| 1      | 0      | 1                                 | 1                                   | 1                    |
| 1      | 1      | 1                                 | 0                                   | 0                    |

![Separating lines for XOR](/static/images/articles/2024-10-13-neural-network-classification/64-classification.svg)

*Fig. 9. Separating lines for XOR*

![A two-layer network implementing XOR](/static/images/articles/2024-10-13-neural-network-classification/65-classification.svg)

*Fig. 10. A two-layer network implementing XOR*

### 4.2. Identifying convex regions with a network of perceptrons

Two-layer networks formed by connecting single-layer networks in sequence can perform more general classifications of points in a plane, separating those inside bounded or unbounded convex regions. The *XOR* example above demonstrated a convex region defined by two hyperplanes.

By placing enough perceptrons in the input layer, each dividing the plane into two half-planes, we can form a convex polygon of the required shape. These regions are all convex because they are constructed by applying *AND* to the half-planes defined by the separating lines.

Consider an example in which we need to identify a triangular region in a two-dimensional input space (Fig. 11). The hyperplanes—in this case, ordinary straight lines—can be specified as follows:

| Perceptron          | Boundary             | Activation condition | Weight vector      | Normal vector    |
| ------------------- | -------------------- | -------------------- | ------------------ | ---------------- |
| First layer: first  | $x\_1=0$             | $x\_1\\geq0$         | $w^1=(0,1,0)$      | $w^{1'}=(1,0)$   |
| First layer: second | $x\_2=0$             | $x\_2\\geq0$         | $w^2=(0,0,1)$      | $w^{2'}=(0,1)$   |
| First layer: third  | $1-x\_1-x\_2=0$      | $x\_1+x\_2\\leq1$    | $w^3=(1,-1,-1)$    | $w^{3'}=(-1,-1)$ |
| Second layer: AND   | $h\_1+h\_2+h\_3=2.5$ | $h\_1=h\_2=h\_3=1$   | $w^4=(-2.5,1,1,1)$ | $w^{4'}=(1,1,1)$ |

![Separating lines bounding a triangular region](/static/images/articles/2024-10-13-neural-network-classification/67-classification.svg)

*Fig. 11. Separating lines bounding a triangular region*

The triangular region can be identified by a two-layer neural network (Fig. 12). Three perceptrons in the first layer divide the plane into half-planes using the specified separating lines. A single perceptron in the second layer applies *AND* to three inputs: the outputs of the preceding layer.

![A two-layer network identifying a triangular region](/static/images/articles/2024-10-13-neural-network-classification/68-classification.svg)

*Fig. 12. A two-layer network identifying a triangular region*

Connections with zero weights are omitted from the diagram.

## 5. What to remember

Let us return to the geometric meaning of a perceptron's operation. Each neuron checks which side of the separating hyperplane an input vector lies on. In two dimensions, this is an ordinary straight line: the weights $w\_1$ and $w\_2$ determine the direction of its normal, while, for a fixed normal, $w\_0$ determines the line's position relative to the origin. This is why one perceptron can implement *AND* and *OR* but cannot implement *XOR*: the two classes of points for *XOR* cannot be separated by a single straight line.

Adding a second layer allows us to combine the results of several such checks. In the *XOR* example, the first layer computes *OR* and *NOT*(*AND*), and the second applies *AND* to their results. In the triangle example, each of the three first-layer neurons checks whether the point lies in its half-plane. The output neuron produces 1 only when all three conditions hold. Simple linear separations thus combine to form a more complex boundary between classes.

In these examples, the weights were chosen from the geometry of the problem so that every calculation could be followed by hand. In supervised learning, the weights are adjusted using errors on training examples. Whether separation is possible also depends on the network's structure: if the classes cannot be separated by one straight line, training a single perceptron will not remove that limitation.
