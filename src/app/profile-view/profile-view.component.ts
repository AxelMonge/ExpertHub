import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService, Client, Professional } from '../services/firestore.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  firestoreService = inject(FirestoreService);
  router = inject(Router);

  currentUser = this.firestoreService.getCurrentUser();
  clientData: Client | undefined;
  professionalData: Professional | undefined;
  isEditing = false;
  activeTab = 'overview';

  ngOnInit() {
    if (this.currentUser) {
      this.loadProfileData();
    } else {
      this.router.navigate(['/']);
    }
  }

  async loadProfileData() {
    const profile = await this.firestoreService.getCurrentProfile();
    if (this.currentUser?.role === 'client') {
      this.clientData = profile as Client;
    } else if (this.currentUser?.role === 'professional') {
      this.professionalData = profile as Professional;
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  async updateProfile() {
    if (this.currentUser) {
      if (this.currentUser.role === 'client' && this.clientData) {
        await this.firestoreService.updateProfile(this.currentUser.userId, this.currentUser.role, this.clientData);
      } else if (this.currentUser.role === 'professional' && this.professionalData) {
        await this.firestoreService.updateProfile(this.currentUser.userId, this.currentUser.role, this.professionalData);
      }
      this.isEditing = false;
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  visitWebsite(url: string) {
    window.open(url, '_blank');
  }
}