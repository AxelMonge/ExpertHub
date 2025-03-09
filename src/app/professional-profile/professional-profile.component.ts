import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService, Professional } from '../services/firestore.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-professional-profile',
  standalone: true,
  imports: [MatToolbarModule, MatCardModule],
  templateUrl: './professional-profile.component.html',
  styleUrl: './professional-profile.component.css'
})
export class ProfessionalProfileComponent implements OnInit {
  professional: Professional | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firestoreService.getProfessionalById(id).then(prof => {
        this.professional = prof;
      });
    }
  }
}
