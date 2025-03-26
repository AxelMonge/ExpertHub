import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professional-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './professional-profile.component.html',
  styleUrls: ['./professional-profile.component.css']
})
export class ProfessionalProfileComponent implements OnInit {
  profile: any = null;
  isSidebarActive = false;
  currentUserId = 'client1';
  activeTab = 'overview';

  profiles = [
    {
      profileId: 'prof1',
      fullName: 'Juan Pérez',
      profilePicture: 'https://example.com/juan.jpg',
      profession: 'Electricista',
      location: { lat: 9.9333, lng: -84.0833, city: 'San José', country: 'Costa Rica' },
      description: 'Especialista en instalaciones eléctricas con 10 años de experiencia. Comprometido con la calidad y la seguridad.',
      websites: ['https://juanperez.com', 'https://portfolio.juanperez.com'],
      contact: { phone: '+50612345678', email: 'prof1@example.com' },
      rating: 4.5,
      totalReviews: 10,
      availability: true,
      membership: true,
      skills: [
        { name: 'Cableado', level: 'Experto', description: 'Diseño y ejecución de sistemas de cableado complejos.' },
        { name: 'Instalación', level: 'Avanzado', description: 'Instalaciones eléctricas residenciales y comerciales.' },
        { name: 'Reparación', level: 'Experto', description: 'Diagnóstico y solución de fallos eléctricos.' },
        { name: 'Diagnóstico', level: 'Avanzado', description: 'Identificación precisa de problemas eléctricos.' }
      ],
      experienceYears: 10,
      views: 150,
      portfolio: [
        { projectId: 'proj1', title: 'Instalación Eléctrica Residencial', description: 'Instalación completa en casa de 3 habitaciones.', images: ['https://example.com/proj1-1.jpg', 'https://example.com/proj1-2.jpg'], date: new Date('2024-01-15') }
      ],
      courses: [
        { courseId: 'course1', title: 'Certificación en Electricidad', institution: 'INTEC', completionDate: new Date('2020-06-20'), certificateUrl: 'https://example.com/cert1.pdf' }
      ],
      reviews: [
        { reviewId: 'rev1', clientId: 'client1', rating: 5, comment: 'Excelente trabajo, muy profesional.', images: ['https://example.com/rev1.jpg'], date: new Date() }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const profileId = this.route.snapshot.paramMap.get('id');
    this.profile = this.profiles.find(p => p.profileId === profileId) || this.profiles[0];
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
    window.location.href = `mailto:${this.profile.contact.email}?subject=Consulta%20desde%20ExpertHub`;
  }

  visitWebsite(url: string) {
    window.open(url, '_blank');
  }

  hireProfessional() {
    this.router.navigate(['/hire', this.profile.profileId]);
  }
}
