# Discord ExcaliMath

![Doomsday](./documentation/design/discord/images/ExcaliMath_Doomsday.png)

## Try it locally

* Start backend:

```bash
cd backend
export HOST=127.0.0.1
export PORT=6998
pnpm dev
```

* Start front end:

```bash
cd frontend
export VITE_DISCORD_CLIENT_ID=****************
export VITE_ROOM_SERVER_URL=ws://127.0.0.1:6998
pnpm dev
```

now you will see the connection happening in the room in the server logs, and when you will draw on the board, you will see more server log lines like:

```bash
[rooms] board update local-development revision <a number here>
```
