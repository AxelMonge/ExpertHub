import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService, User } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private firestoreService: FirestoreService) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }
    try {
      const user: User | undefined = await this.firestoreService.login(this.email, this.password);
      if (user) {
        this.errorMessage = '';
        this.firestoreService.setCurrentUser(user);
        this.router.navigate(['/main-page']);
      } else {
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión: ' + error;
      console.error(error);
    }
  }

  navigateToSignup(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}