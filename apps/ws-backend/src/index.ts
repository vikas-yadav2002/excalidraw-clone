import { WebSocketServer, WebSocket } from "ws";
import {
  authenticate,
  handleChat,
  handleDeleteShape,
  joinRoom,
  leaveRoom,
} from "./lib/helper";
import { IncomingMessage } from "http";

const PORT = Number(process.env.WS_PORT ?? 8080);
const PING_INTERVAL_MS = Number(process.env.PING_INTERVAL_MS ?? 30_000);
const MAX_MESSAGES_PER_MINUTE = Number(process.env.MAX_MSGS_PER_MIN ?? 600);

/* ---------------------------
   Logging
--------------------------- */
function log(...args: any[]) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

/* ---------------------------
   Types
--------------------------- */
type UserPayload = { id: string | number; name?: string; [k: string]: any };

type ConnectedUser = {
  userId: string | number;
  ws: WebSocket;
  rooms: Set<string>;
  isAlive: boolean;
  messageCountWindowStart: number;
  messageCount: number;
};

const connectedUsers = new Map<string | number, ConnectedUser>();
const rooms = new Map<
  string,
  {
    members: Set<string | number>;
  }
>();

/* ---------------------------
   Utility helpers
--------------------------- */
function safeSend(ws: WebSocket, payload: any) {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  } catch (err) {
    log("safeSend failed:", err);
  }
}

function broadcastToRoom(roomId: string, payload: any, excludeWs?: WebSocket) {
  const r = rooms.get(roomId);
  if (!r) return;
  for (const uid of r.members) {
    const cu = connectedUsers.get(uid);
    if (!cu) continue;
    if (excludeWs && cu.ws === excludeWs) continue;
    safeSend(cu.ws, payload);
  }
}

/* ---------------------------
   Message validation
--------------------------- */
type IncomingMessageShape =
  | { type: "join-room"; roomId: string }
  | { type: "leave-room"; roomId: string }
  | { type: "chat"; roomId: string; message: string }
  | { type: "shape-delete"; roomId: string; shapeId: string }
  | { type: string; [k: string]: any };

function validateMessage(msg: any): IncomingMessageShape | null {
  console.log("Validating message:", msg);
  // if (typeof msg !== "object" || msg === null || typeof msg.type !== "string")
  //   return null;

  switch (msg.type) {
    case "join-room":
    case "leave-room":
      if (typeof msg.roomId === "string" && msg.roomId.length > 0) return msg;
      return null;

    case "chat":
        return msg;
      

    case "shape-delete":
      if (typeof msg.roomId === "string" && typeof msg.shapeId === "string")
        return msg;
      return null;

    default:
      return msg;
  }
}

/* ---------------------------
   WebSocket server
--------------------------- */
const wss = new WebSocketServer({
  port: PORT,
  maxPayload: 2 * 1024 * 1024,
});

log(`WebSocket server started on port ${PORT}`);

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  log("New connection attempt from", req.socket.remoteAddress);

  try {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    log("Extracted token:", token ? "[OK]" : "[MISSING]");

    if (!token) {
      log("Connection rejected: missing token");
      safeSend(ws, { error: "Authentication token missing." });
      ws.close(1008, "No token");
      return;
    }

    let user: UserPayload;
    try {
      user = await authenticate(token, ws);
      if (!user || !user.id) throw new Error("Invalid token payload");
      log(`Authentication SUCCESS → userId=${user.id}, name=${user.name}`);
    } catch (authErr) {
      log("Authentication FAILED", authErr);
      safeSend(ws, { error: "Invalid or expired token." });
      ws.close(1008, "Authentication failed");
      return;
    }

    /* -----------------------------
       Register connected user
    ----------------------------- */
    const cu: ConnectedUser = {
      userId: user.id,
      ws,
      rooms: new Set(),
      isAlive: true,
      messageCountWindowStart: Date.now(),
      messageCount: 0,
    };

    connectedUsers.set(user.id, cu);
    log(`User connected → ${user.id} (${user.name})`);

    safeSend(ws, {
      message: "Authenticated",
      user: { id: user.id, name: user.name ?? null },
    });

    ws.on("pong", () => {
      cu.isAlive = true;
      log(`PONG received from user=${user.id}`);
    });

    /* -----------------------------
       Handle incoming messages
    ----------------------------- */
    ws.on("message", async (raw) => {
      log(`Raw message from ${user.id}:`, raw.toString());

      const now = Date.now();
      if (now - cu.messageCountWindowStart > 60000) {
        cu.messageCountWindowStart = now;
        cu.messageCount = 0;
      }
      cu.messageCount++;

      if (cu.messageCount > MAX_MESSAGES_PER_MINUTE) {
        log(`Rate limit exceeded by user ${user.id}`);
        safeSend(ws, { type: "error", message: "Rate limit exceeded" });
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        log("Invalid JSON from", user.id);
        safeSend(ws, { type: "error", message: "Invalid JSON" });
        return;
      }

      if (typeof parsed.roomId === "number") {
        parsed.roomId = parsed.roomId.toString();
      }

      const valid = validateMessage(parsed);
      if (!valid) {
        log("Invalid message from", user.id, parsed);
        safeSend(ws, {
          type: "error",
          message: "Invalid message format",
        });
        return;
      }

      try {
        switch (valid.type) {
          /* -------------------------------
             JOIN ROOM
          -------------------------------- */
          case "join-room":
            log(`User ${user.id} joining room ${valid.roomId}`);
            await joinRoom(valid.roomId, ws, user.id as string);

            cu.rooms.add(valid.roomId);
            if (!rooms.has(valid.roomId))
              rooms.set(valid.roomId, { members: new Set() });
            rooms.get(valid.roomId)!.members.add(user.id);

            safeSend(ws, { type: "joined", roomId: valid.roomId });
            break;

          /* -------------------------------
             LEAVE ROOM
          -------------------------------- */
          case "leave-room":
            log(`User ${user.id} leaving room ${valid.roomId}`);
            await leaveRoom(valid.roomId, ws, user.id as string);

            cu.rooms.delete(valid.roomId);
            rooms.get(valid.roomId)?.members.delete(user.id);

            safeSend(ws, { type: "left", roomId: valid.roomId });
            break;

          /* -------------------------------
             CHAT MESSAGE
          -------------------------------- */
          case "chat":
            log(`Chat from ${user.id} in room ${valid.roomId}:`, valid.message);
            await handleChat(
              valid.roomId,
              valid.message,
              ws,
              user.id as string
            );

            broadcastToRoom(
              valid.roomId,
              {
                type: "chat",
                roomId: valid.roomId,
                message: valid.message,
                from: { id: user.id, name: user.name ?? null },
                ts: Date.now(),
              },
              ws
            );
            break;

          /* -------------------------------
             SHAPE DELETE
          -------------------------------- */
          case "shape-delete":
            log(
              `Shape delete by ${user.id} in room ${valid.roomId} → shape=${valid.shapeId}`
            );

            await handleDeleteShape(valid.roomId, valid.shapeId, ws);

            broadcastToRoom(
              valid.roomId,
              {
                type: "shape-delete",
                roomId: valid.roomId,
                shapeId: valid.shapeId,
                by: { id: user.id },
              },
              ws
            );
            break;

          default:
            log(`Unknown message type from ${user.id}:`, valid.type);
            safeSend(ws, {
              type: "error",
              message: `Unknown message type: ${valid.type}`,
            });
            break;
        }
      } catch (handlerErr) {
        log("Handler error:", handlerErr);
        safeSend(ws, {
          type: "error",
          message: "Server error while processing message",
        });
      }
    });

    /* -----------------------------
       On close
    ----------------------------- */
    ws.on("close", (code, reason) => {
      log(
        `Connection CLOSED for user=${user.id} code=${code} reason=${reason.toString()}`
      );

      for (const roomId of cu.rooms) {
        rooms.get(roomId)?.members.delete(user.id);
        broadcastToRoom(roomId, {
          type: "user-left",
          roomId,
          userId: user.id
        });
      }

      connectedUsers.delete(user.id);
    });

    /* -----------------------------
       On error
    ----------------------------- */
    ws.on("error", (err) => {
      log(`WebSocket error for user=${user.id}:`, err);
    });
  } catch (err) {
    log("Fatal connection error:", err);
    try {
      ws.close(1011, "Internal server error");
    } catch {}
  }
});

/* ---------------------------
   Heartbeat
--------------------------- */
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const cu = [...connectedUsers.values()].find((u) => u.ws === ws);

    if (!cu) {
      ws.ping();
      return;
    }

    if (!cu.isAlive) {
      log(`Terminating unresponsive user: ${cu.userId}`);
      ws.terminate();
      connectedUsers.delete(cu.userId);

      for (const r of cu.rooms) rooms.get(r)?.members.delete(cu.userId);
      return;
    }

    cu.isAlive = false;
    ws.ping();
    log(`PING → user=${cu.userId}`);
  });
}, PING_INTERVAL_MS);

/* ---------------------------
   Shutdown Handler
--------------------------- */
function shutdown() {
  log("Graceful shutdown triggered...");
  clearInterval(interval);

  wss.clients.forEach((ws) => {
    try {
      safeSend(ws, {
        type: "server-shutdown",
        message: "Server restarting",
      });
      ws.close(1001, "Server restart");
    } catch {}
  });

  wss.close(() => {
    log("WebSocket server closed");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
