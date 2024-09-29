import { PresenceStatus } from './presence-status.type';

export interface UserPresenceState {
  userId: string;
  status: PresenceStatus;
}
