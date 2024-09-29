import { Component, computed, inject, input, OnDestroy } from '@angular/core';
import { IsVisibleDirective } from '../../directives/is-visible/is-visible.directive';
import { UserPresenceService } from '../../services/user-presence/user-presence.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { JsonPipe, NgStyle } from "@angular/common";

@Component({
  selector: 'app-online-indicator',
  standalone: true,
  imports: [IsVisibleDirective, JsonPipe, NgStyle],
  templateUrl: './online-indicator.component.html',
})
export class OnlineIndicatorComponent implements OnDestroy {
  userPresenceService = inject(UserPresenceService);
  userId = input.required<string>();
  status = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => this.userPresenceService.statusEventsOf(userId)),
    ),
  );

  onIsVisibleChange(isVisible: boolean): void {
    if (isVisible) {
      this.startWatching();
    } else {
      this.stopWatching();
    }
  }

  startWatching(): void {
    this.userPresenceService.startWatching(this.userId());
  }

  stopWatching(): void {
    this.userPresenceService.stopWatching(this.userId());
  }

  ngOnDestroy(): void {
    this.stopWatching();
  }
}
