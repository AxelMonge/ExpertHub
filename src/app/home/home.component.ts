import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Agregado

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  isMenuOpen = false;

  constructor(private router: Router) {} // Agregado

  ngAfterViewInit() {
    const sections = document.querySelectorAll('header.section, .sell-nft.section, .nft-shop.section, .sellers.section, footer.section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('animated');
        section.classList.add(index === 0 ? 'fade-in' : 'slide-up');
      }, index * 200);
    });
  }

  scrollTo(section: string) {
    let element;
    if (section === 'inicio') element = document.getElementById('inicio');
    if (section === 'características') element = document.querySelector('h2.separator');
    if (section === 'acerca') element = document.querySelector('#acerca');
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  showModal(modalType: string) {
    const contactModal = document.getElementById('contactModal');
    const footerModal = document.getElementById('footerModal');
    if (contactModal && footerModal) {
      if (modalType === 'contact') contactModal.style.display = 'flex';
      else if (modalType === 'footer') footerModal.style.display = 'flex';
    }
  }

  closeModal(modalType: string) {
    const contactModal = document.getElementById('contactModal');
    const footerModal = document.getElementById('footerModal');
    if (contactModal && footerModal) {
      if (modalType === 'contact') contactModal.style.display = 'none';
      else if (modalType === 'footer') footerModal.style.display = 'none';
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('active', this.isMenuOpen);
  }
  
  navigateToLogin() {
    this.closeModal('contact');
    this.router.navigate(['/login']);
  }
}
