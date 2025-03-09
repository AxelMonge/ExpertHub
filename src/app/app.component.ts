import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'experthub';
  isMenuOpen = false;

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
      if (modalType === 'contact') {
        contactModal.style.display = 'flex';
      } else if (modalType === 'footer') {
        footerModal.style.display = 'flex';
      }
    } else {
      console.error('Modals not found in DOM');
    }
  }

  closeModal(modalType: string) {
    const contactModal = document.getElementById('contactModal');
    const footerModal = document.getElementById('footerModal');
    if (contactModal && footerModal) {
      if (modalType === 'contact') {
        contactModal.style.display = 'none';
      } else if (modalType === 'footer') {
        footerModal.style.display = 'none';
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('active', this.isMenuOpen);
    }
  }
}
