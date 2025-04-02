import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService, Professional } from '../services/firestore.service';

@Component({
  selector: 'app-professional-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './professional-profile.component.html',
  styleUrls: ['./professional-profile.component.css']
})
export class ProfessionalProfileComponent implements OnInit {
  firestoreService = inject(FirestoreService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  professional: Professional | null = null;
  portfolio: any[] = [];
  courses: any[] = [];
  reviews: any[] = [];
  isSidebarActive = false;
  currentUserId = 'client1';
  activeTab = 'overview';

  ngOnInit() {
    const idNumber = this.route.snapshot.paramMap.get('id');
    if (idNumber) {
      this.firestoreService.getProfessionalById(idNumber).then(professional => {
        this.professional = professional || null;
        if (this.professional) {
          this.loadSubcollections(idNumber);
        }
      });
    }
  }

  async loadSubcollections(idNumber: string) {
    this.portfolio = await this.firestoreService.getPortfolio(idNumber);
    this.courses = await this.firestoreService.getCourses(idNumber);
    this.reviews = await this.firestoreService.getReviews(idNumber);
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('active', this.isSidebarActive);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    this.router.navigate(['/']);
  }

  contactProfessional() {
    if (this.professional?.contactEmail) {
      window.location.href = `mailto:${this.professional.contactEmail}?subject=Consulta%20desde%20ExpertHub`;
    }
  }

  visitWebsite(url: string) {
    window.open(url, '_blank');
  }

  hireProfessional() {
    if (this.professional?.idNumber) {
      this.router.navigate(['/hire', this.professional.idNumber]);
    }
  }
}