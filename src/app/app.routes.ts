import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProfessionalProfileComponent } from './professional-profile/professional-profile.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'profile/:id', component: ProfessionalProfileComponent },
  { path: 'ai-assistant', component: AiAssistantComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile-view', component: ProfileViewComponent }
];
