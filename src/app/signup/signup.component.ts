import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService, Client, Professional, User } from '../services/firestore.service';

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

  constructor(private router: Router, private firestoreService: FirestoreService) {}

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
    this.professionalData.contactEmail = this.useSameEmail ? this.email : '';
  }

  async submitClientForm() {
    if (!this.clientData.fullName || !this.clientData.idNumber || !this.clientData.location) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios';
      return;
    }
    const client: Client = { ...this.clientData, email: this.email };
    const user: User = {
      email: this.email,
      password: this.password,
      userId: this.clientData.idNumber,
      role: 'client',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    try {
      const clientId = await this.firestoreService.agregarCliente(client);
      await this.firestoreService.agregarUsuario(user);
      console.log('Cliente registrado con ID:', clientId);
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Error al registrar cliente: ' + error;
      console.error(error);
    }
  }

  async submitProfessionalForm() {
    if (!this.professionalData.fullName || !this.professionalData.idNumber || !this.professionalData.location || !this.professionalData.professions[0]) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios (mínimo una profesión)';
      return;
    }
    const professional: Professional = { 
      ...this.professionalData, 
      email: this.email,
      contactEmail: this.useSameEmail ? this.email : this.professionalData.contactEmail
    };
    const user: User = {
      email: this.email,
      password: this.password,
      userId: this.professionalData.idNumber,
      role: 'professional',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    try {
      const professionalId = await this.firestoreService.agregarProfesional(professional);
      await this.firestoreService.agregarUsuario(user);
      console.log('Profesional registrado con ID:', professionalId);
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Error al registrar profesional: ' + error;
      console.error(error);
    }
  }

  navigateToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

  trackByIndex(index: number) {
    return index;
  }
}