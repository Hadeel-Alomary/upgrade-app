import {APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {AppTcTracker} from './utils';
import {
  AppModeAuthorizationService,
  AppModeStateService,
  AuthorizationService,
  CredentialsStateService,
  DebugModeService,
  LanguageLoaderService,
  LanguageService, LogoutService,
  MiscStateService,
  PriceLoader,
  SharedChannel,
  SlickGridColumnsService,
  SlickGridFormatterService,
  VolatileStateService
} from './services';

export function languageServiceFactory(
  service: LanguageService): Function {
  return () => service.getLanguageEntries();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // { provide: ErrorHandler, useClass: TcErrorHandler },
    AppTcTracker,
    LanguageService,
    AuthorizationService,
    AppModeAuthorizationService,
    DebugModeService,
    LanguageLoaderService,
    SharedChannel,
    SlickGridColumnsService,
    SlickGridFormatterService,
    CredentialsStateService,
    AppModeStateService,
    MiscStateService,
    VolatileStateService,
    PriceLoader,
    LogoutService,
    {
      provide: APP_INITIALIZER,
      useFactory: languageServiceFactory,
      deps: [ LanguageService ],
      multi: true
    }
  ],
};
