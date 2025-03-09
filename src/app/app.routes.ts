import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProfessionalProfileComponent } from './professional-profile/professional-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'profile/:id', component: ProfessionalProfileComponent }
];
