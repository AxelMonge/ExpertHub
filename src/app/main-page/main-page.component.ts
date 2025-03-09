import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService, Professional } from '../services/firestore.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  professionals: Professional[] = [];
  isMenuOpen = false;

  constructor(private firestoreService: FirestoreService, private router: Router) {}

  ngOnInit() {
    this.firestoreService.getProfessionals().subscribe(profs => {
      this.professionals = profs;
    });
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('active', this.isMenuOpen);
  }

  logout() {
    this.router.navigate(['/']);
  }
}
