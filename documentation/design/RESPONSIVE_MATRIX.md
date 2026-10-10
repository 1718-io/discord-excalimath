# ExcaliMath Responsive Matrix

## Purpose
This project is designed to live inside a Discord voice-channel activity and a narrow embedded app shell. Because of that, responsiveness is a product requirement, not a cosmetic afterthought.

The goal is to support a wide family of browser and embedded window sizes without breaking the whiteboard experience, introducing scrollbars, or making the tool rail unusable.

---

## Core responsive principle
The app must behave like a stable reasoning surface in all of the following conditions:

- full desktop Discord activity window
- narrow Discord side-panel layout
- compact browser window in development
- tablet-sized layouts
- small mobile widths when the app is previewed in a browser

The board remains the primary element. All supporting UI must adapt around it without stealing attention or causing layout instability.

---

## Supported viewport family
The following matrix defines the screen sizes we should explicitly test and support.

### 1) Full desktop activity
| Category | Width | Height | Notes |
| --- | ---: | ---: | --- |
| Large desktop | 1440 | 900 | Primary target for active collaboration |
| Full HD desktop | 1920 | 1080 | Common Discord desktop use |
| Standard laptop | 1280 | 720 | Minimum polished desktop target |
| Widescreen | 1536 | 864 | Typical product-design laptop size |

### 2) Narrow Discord side panel
| Category | Width | Height | Notes |
| --- | ---: | ---: | --- |
| Narrow panel | 360 | 640 | Important Discord side-panel scenario |
| Compact panel | 480 | 720 | Common narrow iframe width |
| Medium compact | 600 | 900 | Stress case for tool layout |
| Compact laptop panel | 720 | 900 | Transitional point before desktop layout |

### 3) Tablet and medium layouts
| Category | Width | Height | Notes |
| --- | ---: | ---: | --- |
| Tablet portrait | 768 | 1024 | Common portrait tablet view |
| Tablet landscape | 1024 | 768 | Common landscape tablet window |
| Small tablet | 820 | 1180 | Realistic compact tablet use |

### 4) Mobile-first fallback
| Category | Width | Height | Notes |
| --- | ---: | ---: | --- |
| Small phone | 320 | 568 | Hard minimum supported width |
| Regular phone | 375 | 667 | Common iPhone 8/SE range |
| Modern phone | 390 | 844 | Common modern mobile viewport |
| Large phone | 414 | 896 | Larger mobile browser size |

### 5) Very small embedded view
| Category | Width | Height | Notes |
| --- | ---: | ---: | --- |
| Utility compact | 280 | 480 | Recovery-safe minimum for degraded layout |
| Sidebar stress | 240 | 360 | Edge case for the narrowest embedded panel |

---

## Minimum supported rules
The app should remain usable at and above the following baseline:

- Minimum width: 320 px
- Minimum height: 568 px
- Preferred minimum for production quality: 360 px width and 640 px height
- No horizontal scrolling at any supported size
- No nested scrollbars inside the board shell
- Board fidelity must remain stable at all sizes with a clean 100vw / 100vh canvas shell

---

## Responsive behavior requirements

### Layout policy
- The whiteboard must remain the dominant visual element
- The tool rail must shrink or collapse gracefully on narrow widths
- The top status bar must maintain readability without consuming too much height
- Padding and control spacing must adapt without crowding the board

### Interaction policy
- Pen, text, shapes, erase, and math tools must stay usable in small layouts
- Touch targets should remain large enough to be comfortable on mobile-sized widths
- The app must not create any clipping or overlap between the tool panel and the board area

### Visual policy
- No double scrollbar should appear at any breakpoint
- The canvas background and grid should remain visible and readable
- The contrast between UI chrome and board content should remain strong at all sizes

---

## Recommended response strategy by breakpoint

### Desktop: 1280px and above
- Show the full tool rail on the left
- Keep the board as the dominant central surface
- Display session metadata and room state with generous spacing

### Tablet: 768px to 1279px
- Maintain the board-first composition
- Slightly reduce control spacing and label weight
- Keep the toolbar compact but visible

### Compact panel: 360px to 767px
- Reduce tool rail width
- Collapse labels or keep icon-only mode where needed
- Protect board area from UI overlap
- Allow the toolbar to stack or become a more compact dock

### Tiny support: below 360px
- Use a reduced toolbar mode
- Minimize chrome and text density
- Preserve the board at full visual priority
- Avoid layout breakage and clipped controls

---

## Best open-source test setup
The recommended stack for this project is:

- Storybook for isolated UI review and viewport-driven component states
- Playwright for real-browser responsive verification and screenshot diffs
- Optional visual regression tools layered on top for automated layout checks

This combination is ideal because:

1. Storybook lets us test the UI at exact widths and heights without the rest of the app complexity.
2. Playwright verifies actual rendering in a real browser engine, including CSS behavior and layout constraints.
3. The combination catches both component-level regressions and full-app rendering issues.

---

## Why Storybook + Playwright is the right fit
### Storybook
Storybook is perfect for a design-driven whiteboard app because it gives us a stable way to test component states such as:

- default toolbar state
- compact toolbar state
- board shell at 320px width
- room-live state in a narrow panel
- math tool panel states

It also lets the team review the interface in a clean environment without needing a full app session.

### Playwright
Playwright is the best browser automation layer for this project because it can test actual viewport sizes across a matrix of screens and capture screenshots to compare behavior over time. It is especially strong for:

- viewport snapshots
- cross-browser confidence
- responsive regression detection
- CI-friendly browser validation

---

## Recommended project setup
### Suggested tools
- Storybook
- Playwright
- `@storybook/addon-a11y` for accessibility sanity checks

Playwright owns the automated viewport matrix. This avoids coupling the tests to a separate viewport add-on and ensures every listed width and height is exercised by a real browser.

### Install commands
```bash
pnpm add -D storybook @storybook/react-vite @storybook/addon-a11y @playwright/test
```

### Suggested structure
```text
.storybook/
  main.ts
  preview.ts
  theme.ts
playwright.config.ts
stories/
  ResponsiveMatrix.stories.tsx
tests/
  responsive.spec.ts
```

### Storybook story setup
```ts
// stories/ResponsiveMatrix.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import App from '../src/App';

const meta: Meta<typeof App> = {
  title: 'ExcaliMath/App',
  component: App,
  parameters: { layout: 'fullscreen' },
};

export default meta;
export const Default: StoryObj<typeof App> = {};
```

### Playwright viewport matrix example
```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'compact-panel', width: 480, height: 720 },
  { name: 'small-phone', width: 320, height: 568 },
];

export default defineConfig({
  testDir: './tests',
  projects: viewports.map(({ name, width, height }) => ({
    name,
    use: { browserName: 'chromium' as const, viewport: { width, height } },
  })),
});
```

---

## How the responsiveness automation works
The responsive automation is intentionally split into two layers:

1. Storybook as the visual review layer
   - It renders the app in isolated states for the design system and layout shells.
  - The app story is rendered fullscreen; designers can resize the Storybook preview to inspect specific layouts.
   - This catches layout errors before code is merged, especially overlap, clipping, and spacing issues.

2. Playwright as the real browser validation layer
   - It boots the Storybook app in a browser engine.
  - It navigates to the app story and sets each configured viewport size directly in Chromium.
   - It checks that the page is visible, that scroll height is not greater than the viewport, and that the toolbar does not visually overlap the board.
   - It can also take screenshots or produce HTML reports for visual comparison across releases.

This is the right model for a Discord-first app because the real risk is layout breakage in tight embedded views, not only component logic.

---

## Local validation workflow
From the repository root, install dependencies once:

```bash
pnpm -C frontend install --frozen-lockfile
```

For manual visual review, start Storybook:

```bash
pnpm -C frontend storybook
```

Open the app story in Storybook and resize the preview to inspect the matrix. Stop the manual Storybook server before running Playwright. The automated test command starts its own fresh Storybook server.

Run all automated viewport checks:

```bash
pnpm -C frontend test:responsive
```

Optional browser UI mode:

```bash
cd frontend
pnpm -C frontend test:responsive:ui
```

Optional headed mode for manual debugging:

```bash
cd frontend
pnpm -C frontend test:responsive:headed
```

### Local expectations
The check passes if:
- the app story renders without console-level breakage at each configured viewport
- no toolbar overlaps the canvas at any configured size
- no horizontal overflow appears
- all embedded board states remain visible and readable

---

## CircleCI workflow example
A CircleCI job can run the same check automatically on every pull request.

```yaml
version: 2.1

jobs:
  responsive-matrix:
    docker:
      - image: cimg/node:22.17
    working_directory: ~/repo
    steps:
      - checkout
      - run:
          name: Install pnpm
          command: corepack enable && corepack prepare pnpm@12.10.1 --activate
      - run:
          name: Install dependencies
          command: pnpm -C frontend install --frozen-lockfile
        - run:
          name: Install backend dependencies
          command: pnpm -C backend install --frozen-lockfile
      - run:
          name: Build app
          command: pnpm -C frontend build
        - run:
          name: Build and test backend
          command: pnpm -C backend build && pnpm -C backend test
      - run:
          name: Build Storybook
          command: pnpm -C frontend storybook:build
      - run:
          name: Install Playwright browser
          command: pnpm -C frontend exec playwright install --with-deps chromium
      - run:
          name: Run responsive tests
          command: pnpm -C frontend test:responsive --reporter=line
        - run:
          name: Run standalone and room-sync browser tests
          command: pnpm -C frontend test:routes

workflows:
  responsive-checks:
    jobs:
      - responsive-matrix
```

Connect the CircleCI project to the repository and enable pull-request pipelines in its VCS integration. The workflow then runs the same visual-and-layout regression gate for each configured pipeline.

---

## GitHub Actions CI/CD workflow
The repository includes a GitHub Actions workflow at [.github/workflows/responsive-matrix.yml](.github/workflows/responsive-matrix.yml). It validates the frontend viewport matrix and the backend's WebSocket integration with a browser-level two-client scene sync test.

It runs on:
- push to main and develop
- pull requests
- manual workflow dispatch

It performs:
1. frontend and backend dependency installs
2. frontend production build
3. backend TypeScript build and WebSocket tests
4. Storybook production build
5. Playwright browser install
6. responsive viewport matrix tests
7. standalone/Discord route and two-client room-sync browser tests

The workflow allows the layout checks to run in a clean CI environment, which is the same environment your app will likely run in once deployed.

### Triggering locally equivalent commands
These are the same commands the GitHub workflow executes:

```bash
pnpm -C frontend install --frozen-lockfile
pnpm -C backend install --frozen-lockfile
pnpm -C frontend build
pnpm -C backend build
pnpm -C backend test
pnpm -C frontend storybook:build
pnpm -C frontend exec playwright install --with-deps chromium
pnpm -C frontend test:responsive --reporter=line
pnpm -C frontend test:routes
```

### GitHub Actions example
```yaml
name: Responsive matrix

on:
  push:
    branches: [main, develop]
  pull_request:
  workflow_dispatch:

jobs:
  responsive-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 12.10.1
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          cache-dependency-path: |
            frontend/pnpm-lock.yaml
            backend/pnpm-lock.yaml
      - run: pnpm -C frontend install --frozen-lockfile
      - run: pnpm -C backend install --frozen-lockfile
      - run: pnpm -C frontend build
      - run: pnpm -C backend build
      - run: pnpm -C backend test
      - run: pnpm -C frontend storybook:build
      - run: pnpm -C frontend exec playwright install --with-deps chromium
      - run: pnpm -C frontend test:responsive --reporter=line
      - run: pnpm -C frontend test:routes
```

---

## Acceptance criteria
The responsive work is considered complete when all of the following are true:

- the app works in all major desktop and compact widths
- the tool rail does not overlap the board at any supported breakpoint
- no horizontal scrolling appears at any design target
- the board remains visually dominant and centered
- the interface remains readable on narrow panels and mobile widths
- Storybook and Playwright both confirm all viewport states pass

---

## Final design note
This app is not a generic web app with an optional mobile layout. It is a Discord-first collaborative workspace, and its responsiveness is part of the product definition. The board must remain stable, focused, and clear across a deliberately constrained family of screen sizes. That requirement should be treated as a core build check, not a visual nice-to-have.
