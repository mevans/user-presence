import { PresenceStatus, UserPresenceState } from "./types";
import { pubSubClient, redisClient } from "./redis-client";

export class UserPresenceTracker {
  // Expire old statuses after 5 minutes
  private readonly keyExpiry = 60 * 5;

  constructor(private onPresenceChange: (state: UserPresenceState) => void) {
    pubSubClient.pSubscribe("__keyevent@0__:expired", (key) => {
      const userId = this.extractUserId(key);

      this.onPresenceChange(offlineStateOf(userId));
    });
  }

  setOnline(userId: string): void {
    redisClient.setEx(this.userKey(userId), this.keyExpiry, "online");

    this.onPresenceChange(onlineStateOf(userId));
  }

  setOffline(userId: string): void {
    redisClient.del(this.userKey(userId));

    this.onPresenceChange(offlineStateOf(userId));
  }

  async getStatus(userId: string): Promise<UserPresenceState> {
    const status = (await redisClient.get(
      this.userKey(userId),
    )) as PresenceStatus | null;

    return {
      userId,
      status: status ?? "offline",
    };
  }

  private userKey(userId: string): string {
    return `user:${userId}:status`;
  }

  private extractUserId(key: string): string {
    return key.split(":")[1];
  }
}

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
