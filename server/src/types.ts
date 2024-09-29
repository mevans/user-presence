export type PresenceStatus = "online" | "offline";

export interface UserPresenceState {
  userId: string;
  status: PresenceStatus;
}

export interface WatchUserMessage {
  userId: string;
}
