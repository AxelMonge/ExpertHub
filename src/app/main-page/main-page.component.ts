import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  professionals: Professional[] = [
    {
      profileId: 'prof1',
      fullName: 'Juan Pérez',
      profilePicture: 'assets/electrician.png',
      profession: 'Electricista',
      location: { city: 'San José' },
      experienceYears: 10,
      availability: true,
      rating: 4.5,
      membership: true
    },
    {
      profileId: 'prof2',
      fullName: 'María Gómez',
      profilePicture: 'assets/plumber.png',
      profession: 'Plomera',
      location: { city: 'Heredia' },
      experienceYears: 8,
      availability: true,
      rating: 4.8,
      membership: false
    },
    {
      profileId: 'prof3',
      fullName: 'Carlos Ruiz',
      profilePicture: 'assets/designer.png',
      profession: 'Diseñador Gráfico',
      location: { city: 'Alajuela' },
      experienceYears: 5,
      availability: false,
      rating: 4.2,
      membership: true
    },
    {
      profileId: 'prof4',
      fullName: 'Ana López',
      profilePicture: 'assets/carpenter.png',
      profession: 'Carpintera',
      location: { city: 'Cartago' },
      experienceYears: 8,
      availability: true,
      rating: 4.7,
      membership: false
    }
  ];

  categories = [
    { label: 'Electricidad', value: 'electricity' },
    { label: 'Plomería', value: 'plumbing' },
    { label: 'Diseño', value: 'design' },
    { label: 'Carpintería', value: 'carpentry' }
  ];

  filteredProfessionals: Professional[] = [];
  filteredCategories: { label: string, value: string }[] = [];
  isSidebarActive = false;
  currentUserId = 'client1';
  searchQuery = '';
  showCategoryDropdown = false;
  hoveredProfileId: string | null = null;
  hoverTimer: any;
  isUserMenuVisible = false;
  userMenuTimer: any;

  filters = {
    category: { search: '', selected: '' },
    availability: { available: false },
    experience: { entry: false, junior: false, middle: false, senior: false },
    rating: { excellent: false, high: false, mid: false, low: false },
    location: { city: '', nearby: false },
    membership: { premium: false, standard: false }
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.filteredProfessionals = [...this.professionals];
    this.filteredCategories = [...this.categories];
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
    this.filteredProfessionals = this.professionals.filter(prof => {
      const searchMatch = !this.searchQuery ||
        prof.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        prof.profession.toLowerCase().includes(this.searchQuery.toLowerCase());

      const categoryMatch = !this.filters.category.selected ||
        (this.filters.category.selected === 'electricity' && prof.profession.toLowerCase().includes('electricista')) ||
        (this.filters.category.selected === 'plumbing' && prof.profession.toLowerCase().includes('plomera')) ||
        (this.filters.category.selected === 'design' && prof.profession.toLowerCase().includes('diseñador')) ||
        (this.filters.category.selected === 'carpentry' && prof.profession.toLowerCase().includes('carpintera'));

      const availabilityMatch = !this.filters.availability.available || prof.availability;

      const experienceMatch = (!this.filters.experience.entry && !this.filters.experience.junior &&
        !this.filters.experience.middle && !this.filters.experience.senior) ||
        (this.filters.experience.entry && prof.experienceYears <= 2) ||
        (this.filters.experience.junior && prof.experienceYears >= 3 && prof.experienceYears <= 5) ||
        (this.filters.experience.middle && prof.experienceYears >= 6 && prof.experienceYears <= 10) ||
        (this.filters.experience.senior && prof.experienceYears > 10);

      const ratingMatch = (!this.filters.rating.excellent && !this.filters.rating.high &&
        !this.filters.rating.mid && !this.filters.rating.low) ||
        (this.filters.rating.excellent && prof.rating >= 4.5) ||
        (this.filters.rating.high && prof.rating >= 4 && prof.rating < 4.5) ||
        (this.filters.rating.mid && prof.rating >= 3 && prof.rating < 4) ||
        (this.filters.rating.low && prof.rating < 3);

      const locationMatch = !this.filters.location.city ||
        (prof.location.city && prof.location.city.toLowerCase().includes(this.filters.location.city.toLowerCase()));
      const nearbyMatch = !this.filters.location.nearby || true;

      const membershipMatch = (!this.filters.membership.premium && !this.filters.membership.standard) ||
        (this.filters.membership.premium && prof.membership) ||
        (this.filters.membership.standard && !prof.membership);

      return searchMatch && categoryMatch && availabilityMatch && experienceMatch &&
             ratingMatch && locationMatch && nearbyMatch && membershipMatch;
    });
  }

  clearFilters() {
    this.filters = {
      category: { search: '', selected: '' },
      availability: { available: false },
      experience: { entry: false, junior: false, middle: false, senior: false },
      rating: { excellent: false, high: false, mid: false, low: false },
      location: { city: '', nearby: false },
      membership: { premium: false, standard: false }
    };
    this.searchQuery = '';
    this.filteredCategories = [...this.categories];
    this.applyFilters();
  }

  clearFilter(filterType: string) {
    if (filterType === 'category') {
      this.filters.category = { search: '', selected: '' };
      this.filteredCategories = [...this.categories];
    } else if (filterType === 'availability') {
      this.filters.availability.available = false;
    } else if (filterType === 'experience') {
      this.filters.experience = { entry: false, junior: false, middle: false, senior: false };
    } else if (filterType === 'rating') {
      this.filters.rating = { excellent: false, high: false, mid: false, low: false };
    } else if (filterType === 'location') {
      this.filters.location = { city: '', nearby: false };
    } else if (filterType === 'membership') {
      this.filters.membership = { premium: false, standard: false };
    }
    this.applyFilters();
  }

  getCount(filter: string): number {
    if (filter === 'electricity') return this.professionals.filter(p => p.profession.toLowerCase().includes('electricista')).length;
    if (filter === 'plumbing') return this.professionals.filter(p => p.profession.toLowerCase().includes('plomera')).length;
    if (filter === 'design') return this.professionals.filter(p => p.profession.toLowerCase().includes('diseñador')).length;
    if (filter === 'carpentry') return this.professionals.filter(p => p.profession.toLowerCase().includes('carpintera')).length;
    if (filter === 'available') return this.professionals.filter(p => p.availability).length;
    if (filter === 'entry') return this.professionals.filter(p => p.experienceYears <= 2).length;
    if (filter === 'junior') return this.professionals.filter(p => p.experienceYears >= 3 && p.experienceYears <= 5).length;
    if (filter === 'middle') return this.professionals.filter(p => p.experienceYears >= 6 && p.experienceYears <= 10).length;
    if (filter === 'senior') return this.professionals.filter(p => p.experienceYears > 10).length;
    if (filter === 'excellent') return this.professionals.filter(p => p.rating >= 4.5).length;
    if (filter === 'high') return this.professionals.filter(p => p.rating >= 4 && p.rating < 4.5).length;
    if (filter === 'mid') return this.professionals.filter(p => p.rating >= 3 && p.rating < 4).length;
    if (filter === 'low') return this.professionals.filter(p => p.rating < 3).length;
    if (filter === 'nearby') return this.professionals.length;
    if (filter === 'premium') return this.professionals.filter(p => p.membership).length;
    if (filter === 'standard') return this.professionals.filter(p => !p.membership).length;
    return 0;
  }
}

interface Professional {
  profileId: string;
  fullName: string;
  profilePicture: string;
  profession: string;
  location: { city: string };
  experienceYears: number;
  availability: boolean;
  rating: number;
  membership: boolean;
}
