import redisClient from "./redis-client";
import { PresenceStatus } from "./types";

export class UserPresenceTracker {
  setOnline(userId: string): void {
    redisClient.set(this.userKey(userId), "online");
  }

  setOffline(userId: string): void {
    redisClient.del(this.userKey(userId));
  }

  async getStatus(userId: string): Promise<PresenceStatus> {
    const status = (await redisClient.get(
      this.userKey(userId),
    )) as PresenceStatus | null;

    return status ?? "offline";
  }

  private userKey(userId: string): string {
    return `user:${userId}:status`;
  }
}
