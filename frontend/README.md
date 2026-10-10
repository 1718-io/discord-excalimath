# ExcaliMath Frontend

The frontend is a React, TypeScript, Vite, and Tailwind CSS app designed for an embedded Discord Activity. Its layout is full-viewport and tested against the responsive viewport matrix with Storybook and Playwright.

## Requirements

- Node.js 22 or later
- pnpm 12.10.1 (the version declared in `package.json`)
- Chromium for Playwright browser tests

Run these commands in any supported shell to check the toolchain:

```sh
node --version
pnpm --version
```

Use the project-declared pnpm version, `12.10.1`, if your installed version differs. The Corepack commands below work in GNU/Linux shells, PowerShell, and Git Bash for Windows:

```sh
corepack enable
corepack prepare pnpm@12.10.1 --activate
```

On Windows, if `corepack enable` cannot create its shims because of permissions, rerun PowerShell as an account with permission to modify the Node.js installation directory. As an alternative, install the pinned pnpm release with `npm install --global pnpm@12.10.1`, then open a new terminal.

## Shell-specific commands

The repository-root commands use pnpm's `-C` option and work in all three supported environments. You can either run them from the repository root, or change into `frontend/` and omit `-C frontend` from each pnpm command.

### GNU/Linux

Open a terminal at the repository root. If using a distribution package for Node.js, make sure it provides Node.js 22 or later and Corepack; otherwise install Node.js from the official Node.js distribution. Then run:

```sh
corepack enable
corepack prepare pnpm@12.10.1 --activate
pnpm --version
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend dev --host 0.0.0.0
```

Open the Vite URL printed in the terminal. Stop the dev server with `Ctrl+C`. For builds and responsive tests, run:

```sh
pnpm -C frontend build
pnpm -C frontend storybook:build
pnpm -C frontend exec playwright install chromium
pnpm -C frontend test:responsive
```

On Ubuntu/Debian CI or a Linux machine missing Chromium system libraries, install Playwright's supported OS dependencies as well:

```sh
pnpm -C frontend exec playwright install --with-deps chromium
```

Playwright may request elevated privileges to install operating-system dependencies. The regular `playwright install chromium` command downloads the browser without attempting to install those OS packages.

### Windows PowerShell

Open PowerShell at the repository root. Use semicolons or separate lines to run commands; `&&` is not supported in Windows PowerShell 5.1.

```powershell
node --version
corepack enable
corepack prepare pnpm@12.10.1 --activate
pnpm --version
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend dev --host 0.0.0.0
```

Open the Vite URL printed in the terminal and stop the server with `Ctrl+C`. Build and test with:

```powershell
pnpm -C frontend build
pnpm -C frontend storybook:build
pnpm -C frontend exec playwright install chromium
pnpm -C frontend test:responsive
```

### Windows Git Bash

Open Git Bash at the repository root. Git Bash uses Unix-style shell syntax, but the commands below invoke the Windows-installed Node.js and pnpm executables:

```bash
node --version
corepack enable
corepack prepare pnpm@12.10.1 --activate
pnpm --version
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend dev --host 0.0.0.0
```

Open the Vite URL printed in the terminal and stop the server with `Ctrl+C`. Build and test with:

```bash
pnpm -C frontend build
pnpm -C frontend storybook:build
pnpm -C frontend exec playwright install chromium
pnpm -C frontend test:responsive
```

If Git Bash cannot find `node`, `corepack`, or `pnpm`, add the Node.js installation directory (usually `C:\Program Files\nodejs`) to the Windows `PATH`, then close and reopen Git Bash. Playwright's browser download is shared by Windows applications using the same user profile; it does not require Linux `--with-deps` handling.

## Install dependencies

From the repository root:

```sh
pnpm -C frontend install --frozen-lockfile
```

Or change to the frontend directory and run the command there:

```powershell
Set-Location .\frontend
pnpm install --frozen-lockfile
```

Or in GNU/Linux and Git Bash:

```bash
cd frontend
pnpm install --frozen-lockfile
```

The frozen install uses `pnpm-lock.yaml` and fails rather than silently changing the dependency graph.

## Run the app locally

From the repository root:

```sh
pnpm -C frontend dev --host 0.0.0.0
```

Or from `frontend/`:

```sh
pnpm dev --host 0.0.0.0
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The host option also makes the dev server reachable through a LAN interface when needed for embedded-device testing. Stop the server with `Ctrl+C`.

> If port 5173 is already occupied, Vite selects the next available port and prints that URL.

### Standalone and Discord Activity routes

The app uses the same board implementation for both entry points:

- `http://localhost:5173/` opens the standalone web app. It does not initialize the Discord SDK.
- `http://localhost:5173/discord` is the Discord Activity entry point. Open it inside Discord to complete the Embedded App SDK handshake. Opening it in a normal browser shows a clear “Open in Discord” state while leaving the board available for preview.
- If Discord loads the mapped root route `/` inside its iframe, the app changes that embedded route to `/discord`. Normal top-level browser visits stay on `/`.

To configure the public Discord Application Client ID, copy `.env.example` to `.env.local` and set `VITE_DISCORD_CLIENT_ID`.

GNU/Linux and Git Bash:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and replace the example value with the Client ID from the Discord Developer Portal, then restart Vite. This Client ID is intended for frontend use; never place a Client Secret, bot token, or OAuth access token in a `VITE_` variable. The Activity currently reads instance/channel/guild context only. OAuth authorization and token exchange are deferred until a secure backend endpoint exists.

For Discord Activity testing, enable Activities for a Discord application and configure its Activity URL mapping with `/` mapped to your public HTTPS host (for example, a development tunnel). This matches Discord's root entry flow: if it opens `/` inside the Activity iframe, the app hands off to `/discord`; top-level browser visits remain on `/`. The SPA host must serve the same app entry document for `/` and `/discord`. See [Discord local development and URL mapping](https://docs.discord.com/developers/activities/development-guides/local-development).

Test both routes and the embedded-root handoff locally:

```sh
pnpm -C frontend test:routes
```

This command starts an isolated local WebSocket backend and Vite server. It verifies standalone/Activity route behavior and opens two app clients in one `?room=` room, draws on one Excalidraw canvas, and checks that the other client receives the update. You can also run it manually by starting `pnpm -C backend dev` and `pnpm -C frontend dev` in separate terminals, then opening `http://localhost:5173/?room=my-room` in two browser tabs.

## Build and preview

Type-check and produce a production Vite build:

```sh
pnpm -C frontend build
```

Preview the generated build locally:

```sh
pnpm -C frontend preview --host 0.0.0.0
```

The production output is written to `frontend/dist/` and is generated; do not edit it by hand.

## Review the UI in Storybook

Start Storybook:

```sh
pnpm -C frontend storybook
```

Open `http://localhost:6006` and select **ExcaliMath / App — Default**. Resize the preview to review desktop, tablet, mobile, and Discord-style compact panel layouts. The Storybook story imports the app's global CSS and renders the app shell full-screen.

The automated Playwright command starts its own Storybook server on port 6006. Stop any manually launched Storybook server before running Playwright; the test runner deliberately refuses to reuse an existing server to prevent stale Storybook processes from making tests unreliable.

Build a static Storybook site:

```sh
pnpm -C frontend storybook:build
```

Its output is `frontend/storybook-static/` and is also generated.

## Run responsive tests

Install Playwright's Chromium browser once for the current user:

```sh
pnpm -C frontend exec playwright install chromium
```

Run the automated matrix:

```sh
pnpm -C frontend test:responsive
```

Playwright starts a fresh Storybook dev server automatically, opens the app story in Chromium at each configured width and height, then stops the server. The current matrix has 17 viewports, from 240×360 through 1920×1080. It checks that:

- the app shell, toolbar, and board render
- the document does not overflow horizontally or vertically
- the toolbar and board do not overlap
- the board remains on-screen and has usable width
- the page does not emit uncaught browser errors

For interactive debugging, use either:

```sh
pnpm -C frontend test:responsive:headed
pnpm -C frontend test:responsive:ui
```

The HTML report and failure artifacts are generated under `frontend/playwright-report/` and `frontend/test-results/`. Those folders are ignored by the repository `.gitignore`.

## Continuous integration

The GitHub Actions pipeline runs the frozen dependency install, frontend build, Storybook static build, Playwright Chromium setup, and complete responsive matrix on pushes to `main` and `develop`, pull requests, and manual dispatch. See [the responsive matrix CI workflow](../.github/workflows/responsive-matrix.yml) and the [responsive matrix guide](../documentation/design/RESPONSIVE_MATRIX.md) for the CircleCI example and additional details.

To reproduce the CI checks locally from the repository root:

```sh
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend build
pnpm -C frontend storybook:build
pnpm -C frontend exec playwright install chromium
pnpm -C frontend test:responsive --reporter=line
```

## Useful files

- `src/App.tsx` — app shell and responsive UI
- `src/index.css` — global viewport and overflow rules
- `stories/ResponsiveMatrix.stories.tsx` — Storybook app story
- `playwright.config.ts` — viewport matrix and managed Storybook server
- `tests/responsive.spec.ts` — browser-level responsive assertions
- `tests/routes.spec.ts` — standalone, Activity fallback, and embedded-root route checks
- `src/ActivityEntry.tsx` — Discord-only SDK initialization and Activity context
- `.storybook/` — Storybook configuration

## License

The project is licensed under the GNU Affero General Public License v3.0 only. See the repository-level [LICENSE](../LICENSE) for the SPDX identifier and links to the Free Software Foundation's complete canonical license text.
