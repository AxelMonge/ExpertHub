import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Professional {
  idNumber: string;     
  email: string;         
  fullName: string;    
  location: string;    
  professions: string[];
  experienceYears: number; 
  description: string;   
  sites: string[];       
  phone: string;        
  contactEmail: string;  
}

export interface Client {
  idNumber: string; 
  email: string;        
  fullName: string;  
  location: string; 
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  getProfessionals(): Observable<Professional[]> {
    const professionalsRef = collection(this.firestore, 'professionals');
    return collectionData(professionalsRef, { idField: 'id' }) as Observable<Professional[]>;
  }

  async getProfessionalById(id: string): Promise<Professional | undefined> {
    const docRef = doc(this.firestore, `professionals/${id}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as unknown as Professional) : undefined;
  }

  async agregarCliente(cliente: Client): Promise<string> {
    const clientesRef = collection(this.firestore, 'clientes');
    const docRef = await addDoc(clientesRef, cliente);
    return docRef.id;
  }

  async agregarProfesional(profesional: Professional): Promise<string> {
    const profesionalesRef = collection(this.firestore, 'profesionales');
    const docRef = await addDoc(profesionalesRef, profesional);
    return docRef.id;
  }
}