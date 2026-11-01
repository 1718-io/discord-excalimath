# KaTeX Font-Class Support Test Suite

This document provides a comprehensive test suite for validating support of the following KaTeX font classes:

- `.mathbb`
- `.mathcal`
- `.mathfrak`
- `.mathboldfrak`
- `.mathscr`
- `.mathsf`
- `.mathboldsf`
- `.mathsfit`
- `.mathtt`

Each family contains **5 increasing complexity levels**, followed by **10 multi-font combination stress tests**.

---

# 1. `.mathbb`

## Level 1

```latex
\mathbb{N}
```

## Level 2

```latex
\mathbb{Z} \subset \mathbb{Q}
```

## Level 3

```latex
\mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}
```

## Level 4

```latex
f:\mathbb{R}\to\mathbb{R}
```

## Level 5

```latex
\forall x\in\mathbb{R},
\quad
f(x)\in\mathbb{C}
```

---

# 2. `.mathcal`

## Level 1

```latex
\mathcal{A}
```

## Level 2

```latex
\mathcal{F}
```

## Level 3

```latex
(\Omega,\mathcal{F},\mathbb{P})
```

## Level 4

```latex
\mathcal{L}(V)
```

## Level 5

```latex
\mathcal{P}(X)
=
\left\{
A\mid A\subseteq X
\right\}
```

---

# 3. `.mathfrak`

## Level 1

```latex
\mathfrak{g}
```

## Level 2

```latex
\mathfrak{h}
```

## Level 3

```latex
\mathfrak{so}(3)
```

## Level 4

```latex
\mathfrak{sl}_2(\mathbb{C})
```

## Level 5

```latex
\mathfrak{g}
=
\mathfrak{sl}_n(\mathbb{C})
```

---

# 4. `.mathboldfrak`

## Level 1

```latex
\boldsymbol{\mathfrak{g}}
```

## Level 2

```latex
\boldsymbol{\mathfrak{h}}
```

## Level 3

```latex
\boldsymbol{\mathfrak{so}}(3)
```

## Level 4

```latex
\boldsymbol{\mathfrak{sl}}_2(\mathbb{C})
```

## Level 5

```latex
\boldsymbol{\mathfrak{g}}
=
\boldsymbol{\mathfrak{sl}}_n(\mathbb{C})
```

---

# 5. `.mathscr`

## Level 1

```latex
\mathscr{A}
```

## Level 2

```latex
\mathscr{F}
```

## Level 3

```latex
\mathscr{G}
=
(V,E)
```

## Level 4

```latex
\chi(\mathscr{G})
```

## Level 5

```latex
\mathscr{F}
=
\left\{
f:\mathbb{R}\to\mathbb{C}
\right\}
```

---

# 6. `.mathsf`

## Level 1

```latex
\mathsf{ABC}
```

## Level 2

```latex
\mathsf{Vector}
```

## Level 3

```latex
\mathsf{DATA}_{n}
```

## Level 4

```latex
\mathsf{Model}(x)
```

## Level 5

```latex
\mathsf{Algorithm}
:
\mathbb{N}
\to
\mathbb{R}
```

---

# 7. `.mathboldsf`

## Level 1

```latex
\mathbf{\mathsf{A}}
```

## Level 2

```latex
\mathbf{\mathsf{XYZ}}
```

## Level 3

```latex
\mathbf{\mathsf{DATA}}
```

## Level 4

```latex
\mathbf{\mathsf{Matrix}}
```

## Level 5

```latex
\mathbf{\mathsf{Network}}
:
\mathbb{R}^{n}
\to
\mathbb{R}^{m}
```

---

# 8. `.mathsfit`

## Level 1

```latex
\mathsfit{x}
```

## Level 2

```latex
\mathsfit{ABC}
```

## Level 3

```latex
\mathsfit{velocity}
```

## Level 4

```latex
\mathsfit{Position}(t)
```

## Level 5

```latex
\mathsfit{State}
:
\mathbb{R}^{n}
\rightarrow
\mathbb{R}^{m}
```

---

# 9. `.mathtt`

## Level 1

```latex
\mathtt{A}
```

## Level 2

```latex
\mathtt{Hello}
```

## Level 3

```latex
\mathtt{Hello\_World}
```

## Level 4

```latex
\mathtt{function(x)}
```

## Level 5

```latex
\mathtt{for(i=0;i<n;i++)}
```

---

# Combination Tests

---

# Combination Level 1

```latex
\mathbb{N}
\quad
\mathcal{F}
```

---

# Combination Level 2

```latex
\mathbb{R}
\quad
\mathfrak{g}
\quad
\mathscr{A}
```

---

# Combination Level 3

```latex
(\Omega,\mathcal{F},\mathbb{P})
\qquad
\mathscr{G}=(V,E)
```

---

# Combination Level 4

```latex
\mathfrak{sl}_2(\mathbb{C})
\qquad
\mathcal{L}(V)
```

---

# Combination Level 5

```latex
\mathscr{F}
=
\left\{
f:\mathbb{R}\to\mathbb{C}
\right\}
```

---

# Combination Level 6

```latex
\mathbb{E}[X]
=
\int_{\Omega}
X\,d\mathbb{P}
```

---

# Combination Level 7

```latex
\chi(\mathscr{G})
\le
\Delta(\mathscr{G})
+
1
```

---

# Combination Level 8

```latex
\boldsymbol{\mathfrak{g}}
=
\mathfrak{so}(3)
\qquad
\mathbf{\mathsf{DATA}}
```

---

# Combination Level 9

```latex
\sum_{n=1}^{\infty}
\frac{1}{n^2}
\qquad
\mathscr{F}
=
L^2(\mathbb{R})
```

---

# Combination Level 10 (Full Stress Test)

```latex
\mathscr{F}
=
\left\{
f:\mathbb{R}\to\mathbb{C}
\;\middle|\;
\int_{\mathbb{R}}
|f(x)|^2\,dx
<
\infty
\right\}

\qquad

\sum_{n=1}^{\infty}
\frac{1}{n^2}

\qquad

\boldsymbol{\mathfrak{g}}
=
\mathfrak{so}(3)

\qquad

\mathcal{L}(V)

\qquad

\mathbf{\mathsf{DATA}}

\qquad

\mathsfit{State}

\qquad

\mathtt{for(i=0;i<n;i++)}
```

---

# Expected Result

Every test should render identically in:

- Equation editor preview
- Generated SVG
- Excalidraw canvas
- Reloaded/restored Excalidraw files

Any discrepancy indicates a missing KaTeX font, missing KaTeX CSS rule, or SVG embedding issue.
