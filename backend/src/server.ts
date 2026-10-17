import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { WebSocket, WebSocketServer, type RawData } from "ws";
import client from "prom-client";
import { parseClientMessage, type ServerMessage } from "./protocol.js";
import { RoomRegistry } from "./rooms.js";

const MAX_MESSAGE_BYTES = 8 * 1024 * 1024;
const ROOM_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

/**
 * BEGIN Prometheus metrics integration
 */

const register = new client.Registry();

register.setDefaultLabels({
  app: "excali-math-backend",
});

// Collect standard Node.js process metrics:
// memory usage, CPU usage, event loop, and process uptime.
client.collectDefaultMetrics({ register });

// Number of currently connected WebSocket clients.
const connectedClients = new client.Gauge({
  name: "websocket_connected_clients",
  help: "Number of currently connected WebSocket clients.",
  registers: [register],
});

// Number of rooms currently maintained by the server.
const activeRooms = new client.Gauge({
  name: "websocket_active_rooms",
  help: "Number of active WebSocket rooms.",
  registers: [register],
});

// Total number of WebSocket messages received since startup.
const receivedMessages = new client.Counter({
  name: "websocket_messages_received_total",
  help: "Total number of WebSocket messages received.",
  registers: [register],
});

/**
 * END Prometheus metrics integration
 */

export type RoomServerOptions = {
  host?: string;
  port?: number;
  logger?: Pick<Console, "info" | "warn" | "error">;
};

export type RoomServer = {
  host: string;
  port: number;
  roomCount: number;
  close: () => Promise<void>;
};

const send = (socket: WebSocket, message: ServerMessage): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};

const decodeMessage = (data: RawData): unknown => JSON.parse(data.toString());

export const createRoomServer = async (
  options: RoomServerOptions = {},
): Promise<RoomServer> => {
  const host = options.host ?? process.env.HOST ?? "0.0.0.0";
  const port = options.port ?? Number(process.env.PORT ?? 8080);
  const logger = options.logger ?? console;
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT value: ${port}`);
  }

  const httpServer = createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ status: "ok", rooms: rooms.roomCount }));
      return;
    }

    if (request.method === "GET" && request.url === "/metrics") {
      response.setHeader("cache-control", "no-store");

      void register
        .metrics()
        .then((metrics) => {
          response.writeHead(200, {
            "content-type": register.contentType,
            "cache-control": "no-store", // prevents caching /metrics endpoint responses
          });
          response.end(metrics);
        })
        .catch((error: unknown) => {
          logger.error("[metrics] Failed to collect metrics", error);
          if (!response.headersSent) {
            response.writeHead(500, {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "no-store", // prevents caching /metrics endpoint responses
            });
          }
          response.end("Failed to collect metrics.");
        });
      return;
    }

    /**
     * Give normal HTTP requests a conventional response rather
     * than 426 Upgrade Required.
     * WebSocket clients still use the HTTP upgrade mechanism, which
     * remains handled by ws.
     *
     */
    /*
    response.writeHead(426, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('WebSocket upgrade required.');
    */
    response.writeHead(404, {
      "content-type": "text/plain; charset=utf-8",
    });
    response.end("Not found.");
  });

  const webSocketServer = new WebSocketServer({
    server: httpServer,
    maxPayload: MAX_MESSAGE_BYTES,
    perMessageDeflate: false,
  });
  const rooms = new RoomRegistry();

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => reject(error);
    httpServer.once("error", onError);
    httpServer.listen(port, host, () => {
      httpServer.off("error", onError);
      resolve();
    });
  });
  logger.info(
    `[excali-math-backend] BEFORE webSocketServer startup at ws://${host}:${port}`,
  );

  webSocketServer.on("connection", (socket, request) => {
    const clientId = randomUUID();
    let joinedRoomId: string | null = null;
    logger.info(
      `[rooms] connected ${clientId} from ${request.socket.remoteAddress ?? "unknown"}`,
    );
    connectedClients.inc(1)

    socket.on("message", (data) => {
      let rawMessage: unknown;
      try {
        rawMessage = decodeMessage(data);
        receivedMessages.inc(1)
      } catch {
        send(socket, {
          type: "error",
          code: "invalid_json",
          message: "Message must be valid JSON.",
        });
        return;
      }

      const message = parseClientMessage(rawMessage);
      if (!message) {
        send(socket, {
          type: "error",
          code: "invalid_message",
          message: "Message type or payload is invalid.",
        });
        return;
      }

      if (message.type === "ping") {
        send(socket, { type: "pong" });
        return;
      }

      if (message.type === "room:join") {
        if (!ROOM_ID_PATTERN.test(message.roomId)) {
          send(socket, {
            type: "error",
            code: "invalid_room_id",
            message:
              "Room IDs must contain 1–128 letters, numbers, underscores, or hyphens.",
          });
          return;
        }

        if (joinedRoomId) {
          rooms.leave(joinedRoomId, clientId);
          activeRooms.dec(1)
        }
        joinedRoomId = message.roomId;
        const state = rooms.join(joinedRoomId, { clientId, socket });
        send(socket, {
          type: "room:joined",
          roomId: joinedRoomId,
          clientId,
          peers: state.peers,
          revision: state.revision,
          scene: state.scene,
        });
        logger.info(`[rooms] ${clientId} joined ${joinedRoomId}`);
        // connectedClients.inc(1)
        activeRooms.inc(1)
        return;
      }

      if (message.type === "board:update") {
        if (!joinedRoomId) {
          send(socket, {
            type: "error",
            code: "join_required",
            message: "Join a room before sending board updates.",
          });
          return;
        }

        const revision = rooms.update(joinedRoomId, clientId, message.scene);
        if (revision === null) {
          send(socket, {
            type: "error",
            code: "room_membership_lost",
            message: "The connection is no longer registered in its room.",
          });
          return;
        }
        logger.info(
          `[rooms] board update ${joinedRoomId} revision ${revision}`,
        );
      }
    });

    socket.on("close", () => {
      if (joinedRoomId) {
        rooms.leave(joinedRoomId, clientId);
        logger.info(`[rooms] ${clientId} left ${joinedRoomId}`);
      }
      connectedClients.dec(1)
    });

    socket.on("error", (error) => {
      logger.warn(`[rooms] socket ${clientId} error: ${error.message}`);
    });
  });

  const address = httpServer.address() as AddressInfo | null;
  if (!address) {
    await new Promise<void>((resolve) =>
      webSocketServer.close(() => resolve()),
    );
    throw new Error("Room server failed to bind to an address.");
  }

  return {
    host,
    port: address.port,
    get roomCount() {
      return rooms.roomCount;
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        webSocketServer.close((webSocketError) => {
          httpServer.close((httpError) => {
            const error = webSocketError ?? httpError;
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
        for (const socket of webSocketServer.clients) {
          socket.close(1001, "Server shutting down");
        }
      }),
  };
};

const startServer = async (): Promise<void> => {
  const server = await createRoomServer();
  console.info(
    `[rooms] WebSocket room server listening at ws://${server.host}:${server.port}`,
  );

  const shutdown = () => {
    void server.close().then(() => process.exit(0));
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  void startServer().catch((error: unknown) => {
    console.error("[rooms] failed to start server", error);
    process.exitCode = 1;
  });
}
