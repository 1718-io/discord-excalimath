# ExcaliMath backend

A small TypeScript WebSocket room server for the collaborative whiteboard. This is Step 6 infrastructure: it accepts clients, tracks in-memory room membership, hydrates a joining peer with the latest room snapshot, and broadcasts scene updates to other peers.

## Requirements

- Node.js 22 or later
- pnpm 12.10.1 (the version declared in `package.json`)

From the repository root, activate the declared pnpm version if needed and install the backend dependencies:

```sh
npx --yes pnpm@12.10.1 -C backend install --frozen-lockfile
```

## Run locally

Start the development server:

```sh
npx --yes pnpm@12.10.1 -C backend dev
```

By default it listens on `127.0.0.1:8080`, accepts WebSocket connections at `ws://localhost:8080`, and returns a small readiness response from `http://localhost:8080/health`. Set `HOST=0.0.0.0` if another device or container needs to reach the local server; set `PORT` to change the port. Press `Ctrl+C` to stop it.

Build and run the compiled server:

```sh
npx --yes pnpm@12.10.1 -C backend build
npx --yes pnpm@12.10.1 -C backend start
```

## Message protocol

A client connects and sends a join request before sending board data:

```json
{"type":"room:join","roomId":"activity-instance-id"}
```

The server responds with `room:joined`, including its assigned client ID, current peers, the room revision, and the latest scene snapshot (if one exists).

Clients send Excalidraw scene payloads as JSON:

```json
{"type":"board:update","scene":{"elements":[],"appState":{},"files":{}}}
```

Other peers in that room receive `board:update` with the originating client ID and incremented revision. The sender is not echoed its own update. `ping` receives `pong`. Invalid messages and updates sent before joining receive a structured `error` message.

Room IDs are limited to 128 ASCII letters, digits, hyphens, or underscores. WebSocket messages are limited to 8 MiB. The server enforces the scene envelope (`elements`, `appState`, and `files`) while treating the Excalidraw scene values as opaque JSON.

## Room lifetime and security scope

Room membership and the latest snapshot are held in server memory. Empty rooms are discarded when the last connection closes, and state is lost when the server process restarts. Persistent storage and multi-process room coordination are future work.

This milestone does not authenticate clients or authorize room IDs. Use only for local development until authentication and authorization are implemented. In particular, a client-provided room ID is not proof that a user belongs to a Discord Activity instance. Production access control must validate trusted Discord context server-side before accepting protected room traffic.

## Frontend integration

The frontend connects automatically when it receives a room ID. Discord Activities use their SDK `instanceId`; standalone local development uses the `local-development` room by default. Append `?room=<id>` to the standalone URL to test a separate room or open the same room in two browser tabs. Set `VITE_ROOM_SERVER_URL` in `frontend/.env.local` when the backend is not available at its localhost default. A production HTTPS Activity requires a public `wss://` endpoint and a matching Discord URL mapping. Run `pnpm -C frontend test:routes` for an automated two-client drawing sync check; it starts an isolated backend and Vite server on test ports.

## Tests

Run the integration tests:

```sh
npx --yes pnpm@12.10.1 -C backend test
```

They exercise joining, peer-presence notifications, snapshot hydration, update broadcasts, ping/pong, pre-join validation, and room cleanup.
