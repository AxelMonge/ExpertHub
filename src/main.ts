import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';

// Combina appConfig con los proveedores de Firebase
const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore())
];

bootstrapApplication(AppComponent, {
  ...appConfig, // Mantén las configuraciones existentes de appConfig
  providers: [
    ...(appConfig.providers || []), // Incluye los proveedores existentes
    ...firebaseProviders // Agrega los proveedores de Firebase
  ]
}).catch(err => console.error(err));