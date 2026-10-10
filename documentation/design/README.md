# ExcaliMath Discord Activity

## Product vision
ExcaliMath is a collaborative whiteboard for mathematical problem-solving inside a Discord voice channel. The experience is built for real-time teamwork: users join a shared board, sketch ideas, annotate equations, and solve problems together without leaving the voice context.

The product exists at the intersection of three things: a fast whiteboard, mathematical notation, and real-time collaborative interaction inside Discord. It should feel immediate, focused, and highly usable even in a compact screen environment.

---

## Design principle
This product should feel like a premium math workspace, not a generic chat overlay. The interface must stay calm, fast, and visually precise so users can think clearly while collaborating.

### Core qualities
- High performance and responsiveness
- Shared, live collaboration
- Clear mathematical readability
- Minimal friction in a voice-based context
- Strong fit for desktop and narrow side-panel layouts

---

## Product context
Users are in a Discord voice channel and want to solve problems together. They may be discussing homework, proving a theorem, working through a derivation, or explaining mathematical reasoning visually.

The whiteboard becomes a shared reasoning surface:
- freehand sketching
- equation writing and rendering
- structured annotation
- live cursor presence
- collaborative progress in a single shared room

This is not a static document viewer. It is a live environment where mathematical ideas evolve in real time.

---

## Target experience
The app should feel like a digital board that belongs inside Discord, not a separately hosted website forced into an iframe.

### User expectations
- Open instantly when launched from Discord
- Feel native to the Discord activity environment
- Keep the board usable in a narrow side panel or mobile-sized viewport
- Render formulas correctly without broken font glyphs
- Avoid janky scroll behavior or layout imbalance

---

## Interface architecture
The product should use a highly focused full-viewport layout with no unnecessary chrome.

### Main structure
1. Board workspace
   - The primary surface occupies the entire viewport
   - Canvas uses 100vw and 100vh for the working area
   - Overflow is fully hidden to avoid double scrollbars

2. Minimal top layer
   - Session status
   - Connection state
   - Room awareness
   - Lightweight tool controls

3. Contextual utility rail
   - Tools for pen, eraser, math objects, shapes, and selection
   - Compact, touch-friendly controls that remain legible on small screens

4. Collaboration overlays
   - Cursor presence
   - User indicators
   - Live activity feedback

The board should dominate the visual hierarchy. Every other element supports the main task: reasoning on the canvas.

---

## Visual language
The design should be clean, modern, and technical without feeling cold or overly abstract.

### Color strategy
- Neutral white or soft gray canvas backgrounds
- Dark-mode-friendly interface for Discord compatibility
- Minimal but precise accent colors for active tools and collaborative presence
- High contrast for shapes, strokes, and text annotations

### Math-first readability
The interface should keep mathematical content highly legible and crisp. KaTeX-rendered equations must remain clear and robust even inside the Discord client, with the proper font assets bundled for all supported platforms.

### Layout behavior
- Strong alignment and disciplined spacing
- Generous white space around the canvas
- No extraneous decorative blocks
- Tools remain visible but not visually noisy

---

## Interaction model
The board should support collaborative reasoning with a lightweight but powerful workflow.

### Primary actions
- draw freehand annotations
- insert mathematical expressions
- type notes and formulas
- move and manipulate objects
- highlight key reasoning steps
- spot changes from other collaborators live

### User flow
1. Open the activity in Discord
2. Join or create a shared room
3. See collaborator presence and board state
4. Start drawing or writing math in real time
5. Continue problem-solving with a shared live canvas

This flow should feel immediate and low-friction, without any onboarding clutter.

---

## Mobile and side-panel constraints
Because the app may be used in tight Discord layouts, the interface must be intentionally optimized for small widths and constrained height.

### Required UI rules
- The canvas container must strictly occupy 100vw and 100vh
- Content should never create nested scrolling surfaces
- Overflow must be hidden at the root layout level
- Controls must collapse gracefully instead of wrapping awkwardly
- Panels and rails should compress into simple, compact states

### Design requirement
The app should behave well in:
- narrow Discord side panels
- mobile-sized browser windows
- embedded iframe environments
- compact workspace layouts without visual breakage

In short, the design must prioritize stability and clarity over decorative expansion.

---

## Frontend architecture
The frontend is a React application built around Excalidraw and ExcaliMath, adapted for Discord Activity use.

### Frontend stack
- React
- Tailwind CSS
- Excalidraw foundation
- ExcaliMath math-aware board behavior
- Discord Embedded App SDK

### Frontend intent
The frontend should be intentionally minimal and disciplined in CSS. Tailwind should be used with strict patterns:
- simple utility usage
- minimal custom CSS
- no unnecessary wrappers
- no visual layering that invites complexity
- clear, best-practice focus states and spacing scales

The UI should prioritize performance and readability over aesthetic excess.

---

## Backend architecture
The backend is a real-time synchronization service for shared whiteboard state.

### Backend goal
Synchronize all changes between participants in a room so the board remains consistent across users in the same Discord voice channel.

### Backend stack
- lightweight WebSocket server
- room-based session management
- shared board state updates
- collaborative events for drawing, text, and math elements

### Relationship to Excalidraw room model
The backend follows the same collaborative pattern as Excalidraw room synchronization, adapted to the Discord activity use case. The objective is consistent, low-latency propagation of canvas updates across participants.

---

## Discord activity integration
This product is a real-time Discord activity, meaning it runs inside Discord’s embedded web environment.

### Architecture model
1. Frontend app loaded inside Discord iframe
2. Discord SDK used to detect activity context and voice/channel state
3. Room created or joined based on the active Discord session
4. Backend sync server broadcasts board updates in real time
5. All participants see the same live mathematical workspace

### Important product implication
The app is not meant to be a standalone website alone. It is designed to be embedded in Discord and function as a collaborative reasoning surface, tightly bound to the voice channel experience.

---

## Math rendering and asset strategy
Mathematical expressions are central to the product. A poor rendering pipeline would destroy the experience.

### Requirement
KaTeX must render equations correctly inside the Discord client. This means the proper font files and CSS assets must be bundled and served correctly.

### Critical implementation concern
The `.woff2` webfont files used by KaTeX must be included in the build output and referenced correctly so characters such as:
- $\sum$
- $\int$
- other mathematical symbols

render as real math symbols instead of broken placeholder blocks.

### Design requirement
The project must follow asset optimization best practices, ensuring the app includes all required font files and uses the correct loading strategy in the browser environment.

---

## Functional focus
The product should feel purposeful and efficient in the moment of use.

### Core user value
- share a visual reasoning space in real time
- solve math problems together as a team
- write and manipulate equations naturally
- discuss and annotate live within a voice context

### Product promise
A high-performance collaborative whiteboard for mathematical thinking inside Discord voice rooms.

---

## Experience summary
The final outcome should feel like a focused digital lab for collaborative mathematics. It should be clean enough to not distract, powerful enough to support serious reasoning, and flexible enough to work inside compact Discord contexts without breaking the layout.

The board is the center of the product. Everything else exists to support live mathematical collaboration with clarity, speed, and trust.

---

## Recommended project structure
- frontend/
  - React application
  - Excalidraw / ExcaliMath integration
  - Tailwind-based UI
  - Discord SDK integration

- backend/
  - WebSocket room synchronization server
  - collaborator state sync
  - room lifecycle management

This separation keeps the frontend focused on UX and the backend focused on real-time collaboration.

---

## Final product statement
ExcaliMath is a collaborative math whiteboard activity for Discord voice channels, designed to turn conversation into shared visual reasoning. It combines live multiplayer whiteboarding, mathematical notation, and a high-performance immersive interface, all optimized for Discord’s embedded environment and compact screen constraints.
