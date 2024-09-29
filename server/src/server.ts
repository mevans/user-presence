import express from "express";
import http from "http";
import { Server } from "socket.io";
import { UserPresenceState, WatchUserMessage } from "./types";
import env from "./env";
import { UserPresenceTracker } from "./user-presence-tracker";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

const presenceTracker = new UserPresenceTracker();

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (!userId) {
    throw new Error("User ID is required");
  }

  console.log(`User connected: ${userId}`);

  presenceTracker.setOnline(userId);

  io.to(userId).emit("status-update", onlineStateOf(userId));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);

    presenceTracker.setOffline(userId);
    io.to(userId).emit("status-update", offlineStateOf(userId));
  });

  socket.on("start-watching", async (data: WatchUserMessage) => {
    const { userId: targetUserId } = data;

    console.log(`User ${userId} is watching user ${targetUserId}`);

    socket.join(targetUserId);

    const currentStatus = await presenceTracker.getStatus(targetUserId);

    socket.emit("status-update", {
      userId: targetUserId,
      status: currentStatus,
    });
  });

  socket.on("stop-watching", (data: WatchUserMessage) => {
    const { userId: targetUserId } = data;

    console.log(`User ${userId} stopped watching user ${targetUserId}`);

    socket.leave(targetUserId);
  });
});

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

function offlineStateOf(userId: string): UserPresenceState {
  return {
    userId,
    status: "offline",
  };
}

function onlineStateOf(userId: string): UserPresenceState {
  return {
    userId,
    status: "online",
  };
}
