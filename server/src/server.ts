import express from "express";
import http from "http";
import { Server } from "socket.io";
import { WatchUserMessage } from "./types";
import env from "./env";
import { UserPresenceTracker } from "./user-presence-tracker";
import { pubSubClient, redisClient } from "./redis-client";
import { message } from "./message";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

const presenceTracker = new UserPresenceTracker((state) => {
  io.to(state.userId).emit(message.statusUpdate, state);
});

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (!userId) {
    throw new Error("User ID is required");
  }

  presenceTracker.setOnline(userId);

  socket.on("disconnect", () => {
    presenceTracker.setOffline(userId);
  });

  socket.on(message.startWatching, async (data: WatchUserMessage) => {
    socket.join(data.userId);

    const currentStatus = await presenceTracker.getStatus(data.userId);
    socket.emit(message.statusUpdate, currentStatus);
  });

  socket.on(message.stopWatching, (data: WatchUserMessage) => {
    socket.leave(data.userId);
  });

  socket.conn.on("packet", (packet) => {
    if (packet.type === "pong") {
      // Refresh the user's online status
      presenceTracker.setOnline(userId);
    }
  });
});

(async () => {
  try {
    await redisClient.connect();
    await pubSubClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }

  server.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
})();
