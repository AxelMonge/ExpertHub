import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  role: 'client' | 'professional' | null = null;
  roleSelected = false;
  formSubmitted = false;
  email = '';
  password = '';
  errorMessage = '';
  useSameEmail = false;

  clientData = {
    fullName: '',
    idNumber: '',
    location: ''
  };

  professionalData = {
    fullName: '',
    idNumber: '',
    location: '',
    professions: [''],
    experienceYears: 0,
    description: '',
    sites: [''],
    phone: '',
    contactEmail: ''
  };

  constructor(private router: Router) {}

  selectRole(role: 'client' | 'professional') {
    this.role = role;
    this.roleSelected = true;
    this.errorMessage = '';
  }

  submitCredentials() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa el correo y la contraseña';
      return;
    }
    // Basic email validation (replace with real validation/service call)
    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.errorMessage = 'Correo electrónico inválido';
      return;
    }
    this.formSubmitted = true;
    this.errorMessage = '';
  }

  addProfession() {
    this.professionalData.professions.push('');
  }

  removeProfession(index: number) {
    if (this.professionalData.professions.length > 1) {
      this.professionalData.professions.splice(index, 1);
    }
  }

  addSite() {
    this.professionalData.sites.push('');
  }

  removeSite(index: number) {
    if (this.professionalData.sites.length > 1) {
      this.professionalData.sites.splice(index, 1);
    }
  }

  toggleContactEmail() {
    if (this.useSameEmail) {
      this.professionalData.contactEmail = this.email;
    } else {
      this.professionalData.contactEmail = '';
    }
  }

  submitClientForm() {
    if (!this.clientData.fullName || !this.clientData.idNumber || !this.clientData.location) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios';
      return;
    }
    // Mock signup logic (replace with API call)
    console.log('Client Signup:', { email: this.email, password: this.password, ...this.clientData });
    this.router.navigate(['/login']);
  }

  submitProfessionalForm() {
    if (!this.professionalData.fullName || !this.professionalData.idNumber || !this.professionalData.location || !this.professionalData.professions[0]) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios (mínimo una profesión)';
      return;
    }
    // Mock signup logic (replace with API call)
    console.log('Professional Signup:', { email: this.email, password: this.password, ...this.professionalData });
    this.router.navigate(['/login']);
  }

  navigateToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}