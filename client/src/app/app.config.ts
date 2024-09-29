import {
  ApplicationConfig,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SocketIoModule } from 'ngx-socket-io';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),

    importProvidersFrom(
      SocketIoModule.forRoot({
        url: 'http://localhost:3000',
        options: {
          autoConnect: false,
        },
      }),
    ),
  ],
};
