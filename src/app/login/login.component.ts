import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Add FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }
    if (this.email === 'test@experthub.com' && this.password === 'password123') {
      this.errorMessage = '';
      this.router.navigate(['/main-page']);
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos';
    }
  }

  navigateToSignup(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}