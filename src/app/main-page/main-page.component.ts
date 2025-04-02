import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);

  professionals$!: Observable<Professional[]>;
  filteredProfessionals: Professional[] = [];
  filteredCategories: { label: string, value: string }[] = [];

  currentUserId = 'client1';
  searchQuery = '';
  showCategoryDropdown = false;
  hoveredProfileId: string | null = null;
  hoverTimer: any;
  isSidebarActive = false;
  isUserMenuVisible = false;
  userMenuTimer: any;

  categories = [
    { label: 'Electricidad', value: 'electricity' },
    { label: 'Plomería', value: 'plumbing' },
    { label: 'Diseño', value: 'design' },
    { label: 'Carpintería', value: 'carpentry' }
  ];

  filters = {
    category: { search: '', selected: '' },
    experience: { entry: false, junior: false, middle: false, senior: false },
    location: { city: '', nearby: false }
  };

  ngOnInit() {
    const profilesRef = collection(this.firestore, 'professionals'); //aqui tambien
    this.professionals$ = collectionData(profilesRef, { idField: 'idNumber' }) as Observable<Professional[]>;

    this.professionals$.subscribe((data) => {
      this.filteredProfessionals = data;
      this.filteredCategories = [...this.categories];
      this.applyFilters();
    });
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active', this.isSidebarActive);
    }
  }

  showUserMenu() {
    this.clearUserMenuTimer();
    this.isUserMenuVisible = true;
  }

  hideUserMenu() {
    this.userMenuTimer = setTimeout(() => {
      this.isUserMenuVisible = false;
    }, 500);
  }

  clearUserMenuTimer() {
    if (this.userMenuTimer) {
      clearTimeout(this.userMenuTimer);
      this.userMenuTimer = null;
    }
  }

  logout() {
    this.router.navigate(['/']);
  }

  filterCategories() {
    const query = this.filters.category.search.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.label.toLowerCase().includes(query)
    );
    this.showCategoryDropdown = true;
    this.applyFilters();
  }

  selectCategory(value: string) {
    this.filters.category.selected = value;
    this.filters.category.search = this.categories.find(cat => cat.value === value)?.label || '';
    this.showCategoryDropdown = false;
    this.applyFilters();
  }

  hideCategoryDropdown() {
    setTimeout(() => {
      this.showCategoryDropdown = false;
    }, 200);
  }

  startHoverTimer(profileId: string) {
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => {
      this.hoveredProfileId = profileId;
    }, 300);
  }

  clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    this.hoveredProfileId = null;
  }

  getSkills(profession: string): string[] {
    switch (profession.toLowerCase()) {
      case 'electricista':
        return ['Cableado', 'Instalación', 'Reparación', 'Diagnóstico'];
      case 'plomera':
        return ['Tuberías', 'Reparación', 'Instalación', 'Mantenimiento'];
      case 'diseñador gráfico':
        return ['Diseño UI', 'Ilustración', 'Branding', 'Edición'];
      case 'carpintera':
        return ['Muebles', 'Reparación', 'Ensamblaje', 'Diseño'];
      default:
        return ['Habilidad 1', 'Habilidad 2', 'Habilidad 3', 'Habilidad 4'];
    }
  }

  applyFilters() {
    this.professionals$.subscribe(professionals => {
      this.filteredProfessionals = professionals.filter(prof => {
        const searchMatch = !this.searchQuery ||
          prof.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (prof.professions || []).some(p => p.toLowerCase().includes(this.searchQuery.toLowerCase()));

        const categoryMatch = !this.filters.category.selected ||
          (this.filters.category.selected === 'electricity' && (prof.professions || []).some(p => p.toLowerCase().includes('electricista'))) ||
          (this.filters.category.selected === 'plumbing' && (prof.professions || []).some(p => p.toLowerCase().includes('plomera'))) ||
          (this.filters.category.selected === 'design' && (prof.professions || []).some(p => p.toLowerCase().includes('diseñador'))) ||
          (this.filters.category.selected === 'carpentry' && (prof.professions || []).some(p => p.toLowerCase().includes('carpintera')));

        const experience = prof.experienceYears ?? 0;
        const experienceMatch = (!this.filters.experience.entry && !this.filters.experience.junior &&
          !this.filters.experience.middle && !this.filters.experience.senior) ||
          (this.filters.experience.entry && experience <= 2) ||
          (this.filters.experience.junior && experience >= 3 && experience <= 5) ||
          (this.filters.experience.middle && experience >= 6 && experience <= 10) ||
          (this.filters.experience.senior && experience > 10);

        const locationMatch = !this.filters.location.city ||
          (prof.location || '').toLowerCase().includes(this.filters.location.city.toLowerCase());

        const nearbyMatch = !this.filters.location.nearby || true;

        return searchMatch && categoryMatch && experienceMatch && locationMatch && nearbyMatch;
      });
    });
  }

  clearFilters() {
    this.filters = {
      category: { search: '', selected: '' },
      experience: { entry: false, junior: false, middle: false, senior: false },
      location: { city: '', nearby: false }
    };
    this.searchQuery = '';
    this.filteredCategories = [...this.categories];
    this.applyFilters();
  }

  clearFilter(filterType: string) {
    if (filterType === 'category') {
      this.filters.category = { search: '', selected: '' };
      this.filteredCategories = [...this.categories];
    } else if (filterType === 'experience') {
      this.filters.experience = { entry: false, junior: false, middle: false, senior: false };
    } else if (filterType === 'location') {
      this.filters.location = { city: '', nearby: false };
    }
    this.applyFilters();
  }

  getCount(filter: string): number {
    return this.filteredProfessionals.filter(p => {
      const experience = p.experienceYears ?? 0;
      if (filter === 'electricity') return (p.professions || []).some(prof => prof.toLowerCase().includes('electricista'));
      if (filter === 'plumbing') return (p.professions || []).some(prof => prof.toLowerCase().includes('plomera'));
      if (filter === 'design') return (p.professions || []).some(prof => prof.toLowerCase().includes('diseñador'));
      if (filter === 'carpentry') return (p.professions || []).some(prof => prof.toLowerCase().includes('carpintera'));
      if (filter === 'entry') return experience <= 2;
      if (filter === 'junior') return experience >= 3 && experience <= 5;
      if (filter === 'middle') return experience >= 6 && experience <= 10;
      if (filter === 'senior') return experience > 10;
      if (filter === 'nearby') return true;
      return false;
    }).length;
  }
}

interface Professional {
  idNumber: string;
  email: string;
  fullName: string;
  location: string;
  professions: string[];
  experienceYears: number | null;
  description?: string;
  sites?: string[];
  phone?: string;
  contactEmail?: string;
}
