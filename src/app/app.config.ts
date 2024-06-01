import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
    ), provideFirebaseApp(() => initializeApp({"projectId":"records-sphere","appId":"1:511865460078:web:1973db26e1eea6abbd5d7f","storageBucket":"records-sphere.appspot.com","apiKey":"AIzaSyD0NN-sadWUw0L9psrwaT6ew3dspojXf54","authDomain":"records-sphere.firebaseapp.com","messagingSenderId":"511865460078","measurementId":"G-3DNRYG9SSJ"})), provideFirestore(() => getFirestore())
  ]
};
