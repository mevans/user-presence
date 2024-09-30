import { inject, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { UserPresenceState } from "../../types/user-presence-state.type";
import { filter, Observable, startWith } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserPresenceService {
  socket = inject(Socket);
  statusEvents$ = this.socket.fromEvent<UserPresenceState>("status-update");

  statusEventsOf(userId: string): Observable<UserPresenceState> {
    return this.statusEvents$.pipe(
      startWith({ userId, status: "offline" as const }),
      filter((update) => update.userId === userId),
    );
  }

  connect(userId: string): void {
    this.socket.ioSocket.io.opts.query = { userId };
    this.socket.connect();
  }

  startWatching(userId: string): void {
    this.socket.emit("start-watching", { userId });
  }

  stopWatching(userId: string): void {
    this.socket.emit("stop-watching", { userId });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
