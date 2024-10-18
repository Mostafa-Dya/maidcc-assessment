import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from './app/app.routes';
import { UserEffects } from './app/store/effects/user.effects';
import { reducers } from './app/store/reducers';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      StoreModule.forRoot(reducers),
      EffectsModule.forRoot([UserEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25 })
    ),
  ],
}).catch((err) => console.error(err));
