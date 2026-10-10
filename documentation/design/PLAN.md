# ExcaliMath Discord Activity - Development Plan

This plan is intentionally written as a step-by-step implementation sequence. Each step contains a clear objective, the files to touch, and the local development command(s) to run so you can verify the result in your own environment before moving forward.

Project constraints:
- Use pure TypeScript throughout the project
- Do not use JavaScript files for implementation unless absolutely required by an external tool
- Use pnpm for package management and local development
- Keep the code strict, minimal, and production-oriented

Important workflow:
- Read the current step carefully.
- Run the local dev commands described in that step.
- Review the result.
- If the result matches the intended milestone, reply with: "ok you can code that"
- Then I will implement only that step.
- After each implemented step, I will ask whether you are happy with the result before we continue to the next step.

This is not a git workflow. No merge, no branch creation, and no git operations are part of this process.

---

## Step 1: Create the project skeleton

### Goal
Set up the repository structure for the app so the frontend and backend are separated cleanly, while keeping the root workspace organized.

### Scope
Create the following structure:
- frontend/
- backend/
- documentation/design/
- package.json at the root (only if needed for workspace orchestration)
- README-level project notes

### Exact work to do
- Create the frontend folder for the React app
- Create the backend folder for the multiplayer sync server
- Keep the docs folder separate for design and planning
- Ensure the root repo reflects a clean two-part architecture

### Local dev run (for verification)
There is no application to run yet at this stage. The validation is structural:

1. Open the workspace in VS Code
2. Confirm the folder tree matches the expected structure
3. Verify the frontend and backend folders exist

Example check in PowerShell:

```powershell
Get-ChildItem
Get-ChildItem .\frontend
Get-ChildItem .\backend
Get-ChildItem .\documentation\design
```

### Completion condition
The workspace structure is correct and cleanly separated.

### To continue
Reply with: "ok you can code that"

---

## Step 2: Scaffold the frontend app with React + Vite + Tailwind

### Goal
Initialize the frontend React application and install the required dependencies for a Discord Activity environment.

### Scope
- Create the frontend React app with Vite
- Install Tailwind CSS
- Configure the minimum necessary CSS pipeline
- Make sure the app is compatible with an iframe-based Discord embed
- Keep Tailwind usage disciplined and minimal

### Exact work to do
- Set up Vite React project in frontend/
- Install Tailwind and PostCSS plugins
- Configure a minimal Tailwind setup
- Set the base CSS to focus on layout stability, not decorative complexity
- Avoid custom CSS bloat; prefer utility-first patterns with a strict structure

### Local dev run (for verification)
From the frontend directory, run:

```powershell
cd .\frontend
pnpm install
pnpm dev --host 0.0.0.0
```

Open the local URL returned by Vite, typically something like:
- http://localhost:5173

Expected result:
- The app loads without runtime errors
- The page renders in the browser
- No Tailwind setup errors occur

### Completion condition
The frontend React app runs locally in development and the Tailwind CSS pipeline is working.

### To continue
Reply with: "ok you can code that"

---

## Step 3: Build the strict full-viewport embedded app shell

### Goal
Create the main application layout so the whiteboard occupies the full viewport without ugly scrollbars or nested overflow issues.

### Scope
- Set the root app layout to full-screen
- Force the board container to use 100vw and 100vh
- Hide overflow globally at the root layout level
- Keep the app robust for narrow Discord side panels and small mobile screens
- Use a minimal and disciplined UI shell around the board

### Exact work to do
- Add an app-level shell
- Ensure the board container fills the viewport completely
- Remove any default margins
- Prevent page scrollbars from appearing
- Keep a tiny top bar or control bar only if necessary
- Make sure the layout remains functional in a compact environment

### Local dev run (for verification)
From the frontend directory:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Expected result:
- The page fills the browser viewport
- No visible double scrollbar appears
- No body scroll in the app shell
- Content remains fully visible on narrow widths

### Completion condition
The app shell is stable in full-viewport mode and behaves properly on constrained screens.

### To continue
Reply with: "ok you can code that"

---

## Step 4: Integrate Excalidraw and ExcaliMath base board

### Goal
Add the whiteboard foundation and connect the app to the math-capable collaborative canvas.

### Scope
- Install Excalidraw and related dependencies
- Integrate the board into the React app
- Configure the canvas to adapt to the viewport shell
- Keep the board as the primary visual focus
- Ensure the app is ready for real-time multiplayer synchronisation later

### Exact work to do
- Import the whiteboard and canvas primitives
- Create a dedicated board component
- Fit the board to the full-screen app shell
- Confirm toolbars and board controls are not visually overwhelming
- Prepare the app for future room sync and Discord context integration

### Local dev run (for verification)
Run the app:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Open the local app and confirm:
- the board renders
- canvas interactions work
- the app does not overflow the viewport
- the board remains usable within the embedded app shell

### Completion condition
A working whiteboard is visible and interactive inside the app shell.

### To continue
Reply with: "ok you can code that"

---

## Step 5: Add the Discord Embedded App SDK and activity context

### Goal
Prepare the app to run as a Discord Activity inside an iframe and use the Discord SDK for activity context and session information.

### Scope
- Install and configure the Discord Embedded App SDK
- Create the Discord activity bootstrap logic
- Connect app state to the Discord environment
- Make the app aware of being run inside Discord
- Keep `/` as the standalone web-app entry point and add `/discord` as the Discord Activity entry point
- Reuse the same app and whiteboard implementation on both routes; initialize the Discord SDK only for the Activity route
- If Discord launches the mapped root URL inside its iframe, hand off to `/discord` while leaving normal top-level browser visits at `/`

### Exact work to do
- Add the SDK and initialization logic
- Create a small provider or bootstrap component
- Read activity context and session metadata where available
- Capture the Activity instance ID and channel/guild context when exposed by the SDK; defer OAuth token exchange that requires a secure backend to a later step
- Document that production hosting must serve the SPA for both routes and configure Discord URL mapping to reach the Activity entry point
- Keep this logic isolated from the whiteboard behavior
- Do not clutter the canvas UI with Discord-specific details

### Local dev run (for verification)
To test locally in a browser, start the frontend in dev mode:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Expected result:
- The app boots without SDK initialization errors
- The app shell still renders correctly
- No console errors on initial load
- `/` runs as the standalone app without attempting Discord initialization
- `/discord` initializes the SDK in Discord and reports a useful fallback state when opened outside Discord

### Completion condition
The app loads as a Discord-ready frontend shell while still being runnable locally in development.

### To continue
Reply with: "ok you can code that"

---

## Step 6: Set up the backend synchronization server

### Goal
Create a lightweight real-time multiplayer backend for the whiteboard room.

### Scope
- Set up backend/ as a Node.js WebSocket server
- Add room support for collaborative sessions
- Sync board events between connected clients
- Keep the implementation based on the Excalidraw-room pattern, adapted for this project

### Exact work to do
- Create the backend folder structure
- Install the required server dependencies
- Set up WebSocket room logic
- Handle user join/leave events
- Broadcast canvas updates to all connected peers in the same room

### Local dev run (for verification)
From the backend directory:

```powershell
cd .\backend
pnpm install
pnpm dev
```

Expected result:
- The server boots successfully
- It stays running in development mode
- It accepts WebSocket connections

Optional follow-up check:
- use a browser or local client to connect to the websocket endpoint
- verify the server logs show a connection event

### Completion condition
The backend server is running locally and accepts collaborative room connections.

### To continue
Reply with: "ok you can code that"

---

## Step 7: Connect the frontend to the backend room sync service

### Goal
Make the whiteboard state synchronized between users in the same room.

### Scope
- Add client-side room connection logic
- Connect canvas actions to synchronization events
- Keep state hydration minimal and consistent
- Ensure collaboration is reliable and fast

### Exact work to do
- Create a room/session connection layer in the frontend
- Use WebSocket messaging for state sync
- Bind Excalidraw scene changes to validated scene snapshot serialization
- Hydrate a newly joined client with the latest room snapshot and apply remote updates without adding them to local undo history
- Use the Discord Activity instance ID as the room key; allow standalone local testing with a `?room=` query
- Show actual connecting/synced/reconnecting/error state rather than a placeholder live status
- Make the WebSocket endpoint configurable; use `ws://` for local development and `wss://` behind a public Discord Activity URL mapping in deployment
- Add an end-to-end two-client test that draws on one board and checks that the other receives the update
- Keep authentication and trusted room authorization as a separate security task before production deployment

### Local dev run (for verification)
Start the backend in one terminal:

```powershell
npx --yes pnpm@12.10.1 -C backend dev
```

Then start the frontend in another terminal and open the same local room in two tabs (localhost defaults to `local-development`):

```powershell
npx --yes pnpm@12.10.1 -C frontend dev --host 0.0.0.0
```

Automated end-to-end sync check (starts isolated backend and frontend test servers):

```powershell
npx --yes pnpm@12.10.1 -C frontend test:routes
```

Expected result:
- The frontend can open the room connection
- The backend receives connection events
- Both standalone clients can join the same `?room=` room and board changes propagate
- Discord Activity clients use their shared Activity instance ID as the room key
- A new client receives the latest board snapshot
- The two-client browser test draws on one Excalidraw board and observes a remote revision on the other
- The client does not crash when the room sync is active

### Completion condition
The frontend and backend communicate correctly for collaborative room state.

### Bear in mind

The route test starts isolated local frontend and backend servers. Setup and commands are documented in README.md and README.md; the Step 7 scope is updated in PLAN.md.

Room state is still in-memory, and the server does not yet authenticate clients or validate Discord membership. Those are production-security and persistence tasks—not part of this frontend connection step.

### To continue
Reply with: "ok you can code that"

---

## Step 8: Implement math-specific interaction support

### Goal
Improve the whiteboard so it is meaningful for mathematical collaboration rather than generic drawing alone.

### Scope
- Add math annotation flow
- Support equation rendering using KaTeX
- Maintain clear text and symbol rendering inside the app shell
- Preserve usability in compact screen conditions

### Exact work to do
- Add equation components or support for rendered formulas
- Ensure tooltip, text, and math objects remain visible and readable
- Keep the interaction model simple and focused
- Handle font loading and symbol rendering correctly

### Local dev run (for verification)
Run the frontend in dev mode:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Open the app and verify:
- formula rendering works
- math symbols show correctly
- no broken square blocks appear from missing fonts
- equation layout stays stable in the board container

### Completion condition
Math content is readable and stable in the collaborative canvas.

### To continue
Reply with: "ok you can code that"

---

## Step 9: Fix KaTeX and font asset packaging for Discord environment

### Goal
Ensure browser rendering works correctly inside Discord’s embedded app environment.

### Scope
- Configure the app build to include KaTeX webfont files
- Verify that .woff2 assets are copied correctly to the final build output
- Ensure CSS references the proper font paths
- Prevent symbol rendering issues in the Discord iframe client

### Exact work to do
- Inspect the bundler configuration
- Ensure KaTeX font files are included in build output
- Confirm the CSS asset paths resolve accurately in production and dev builds
- Test for common broken-font issues such as missing glyphs

### Local dev run (for verification)
Start the frontend:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Then build the production bundle locally:

```powershell
cd .\frontend
pnpm build
```

Then inspect the generated output to confirm font files exist in the final assets:

```powershell
Get-ChildItem .\dist
Get-ChildItem .\dist\assets
```

Expected result:
- .woff2 font files are present
- the build completes without font-related errors
- equations render properly in the app

### Completion condition
KaTeX fonts are correctly packaged and render reliably in the browser environment.

### To continue
Reply with: "ok you can code that"

---

## Step 10: Make the UI production-ready and Discord-safe

### Goal
Harden the app so it behaves like a polished Discord Activity rather than a generic prototype.

### Scope
- final polish of the canvas shell
- refine tool usability
- ensure layout remains stable on small screens
- remove edge-case visual issues in the embedded UI

### Exact work to do
- reduce unnecessary chrome
- apply a disciplined design language
- refine focus states, toolbars, and interaction spacing
- ensure the app remains stable across viewport sizes

### Local dev run (for verification)
Run the frontend:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Check:
- the board still fills the viewport
- controls remain useable
- no nested scrollbar appears
- the interface remains readable in compact dimensions

### Completion condition
The app feels polished and cohesive in a real Discord-style embedded environment.

### To continue
Reply with: "ok you can code that"

---

## Step 11: Add a minimal Discord configuration and deployment bootstrap

### Goal
Prepare the application for registration in the Discord Developer Portal and hosting for real activity use.

### Scope
- Add a minimal environment configuration model
- Prepare the app for Discord Activity metadata and host URL configuration
- Document the deployment backbone clearly

### Exact work to do
- Create environment config values
- Document required Discord app IDs and redirect or host settings
- Keep config minimal and secure
- Prepare the app for actual deployment later

### Local dev run (for verification)
Run the frontend locally:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Check that the app still loads correctly after config setup and that no runtime errors appear.

### Completion condition
The app is ready to be connected to Discord configuration and deployment workflows.

### To continue
Reply with: "ok you can code that"

---

## Step 12: Final polish and quality pass

### Goal
Perform a final review of app quality and product readiness.

### Scope
- check overall responsiveness
- verify collaboration works in principle
- ensure math rendering is robust
- verify full-screen embedded UX is stable
- confirm the code is clean and maintainable

### Exact work to do
- review the entire app in dev mode
- ensure no flaky UI states remain
- run a final sanity pass on board interactions
- verify package configuration and dependencies are clean and intentional

### Local dev run (for verification)
Run both services together:

```powershell
cd .\backend
pnpm dev
```

In another terminal:

```powershell
cd .\frontend
pnpm dev --host 0.0.0.0
```

Expected result:
- both services run together without crashing
- the board loads in the browser
- room sync is ready for collaborative testing
- the app remains visually stable in narrow layouts

### Completion condition
The app is in a clean, local-development-ready state.

### To continue
Reply with: "ok you can code that"

---

## Implementation rule for this plan
I will only implement one step at a time.

- Read the step
- Run the local commands in that step
- If you are satisfied, reply with: "ok you can code that"
- I will code that step only
- After that step is implemented, I will ask whether you are happy with it
- Only then do we move to the next step

This keeps the build incremental, reviewable, and aligned with your exact expectations.
