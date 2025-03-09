import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  experience: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  // Obtener todos los profesionales
  getProfessionals(): Observable<Professional[]> {
    const professionalsRef = collection(this.firestore, 'professionals');
    return collectionData(professionalsRef, { idField: 'id' }) as Observable<Professional[]>;
  }

  // Obtener un profesional por ID
  async getProfessionalById(id: string): Promise<Professional | undefined> {
    const docRef = doc(this.firestore, `professionals/${id}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Professional : undefined;
  }
}
