import { Routes } from '@angular/router';
import { ProfessionalProfileComponent } from './professional-profile/professional-profile.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'profile/:id', component: ProfessionalProfileComponent }
];
