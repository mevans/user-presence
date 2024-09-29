import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserPresenceService } from './services/user-presence/user-presence.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OnlineIndicatorComponent } from './components/online-indicator/online-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, OnlineIndicatorComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  userPresenceService = inject(UserPresenceService);

  loggedInUserId = new FormControl<string>('');
  userIdToWatch = new FormControl<string>('');

  watching = signal<string[]>([]);

  connect(): void {
    const userId = this.loggedInUserId.value;
    if (!userId) {
      return;
    }

    this.userPresenceService.connect(userId);
    this.loggedInUserId.disable();
  }

  startWatching(): void {
    const userId = this.userIdToWatch.value;
    if (!userId) {
      return;
    }

    this.watching.update((watching) => [...watching, userId]);
    this.userIdToWatch.reset();
  }

  stopWatching(userId: string): void {
    this.watching.update((watching) => watching.filter((id) => id !== userId));
  }

  disconnect(): void {
    this.userPresenceService.disconnect();
    this.watching.set([]);

    this.loggedInUserId.enable();
    this.loggedInUserId.reset();
  }
}
