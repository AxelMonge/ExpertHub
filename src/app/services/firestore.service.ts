import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc, query, where, getDocs } from '@angular/fire/firestore';
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

export interface User {
  email: string;
  password: string;
  userId: string;
  role: string;
  createdAt: Date;
  lastLogin: Date;
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
    const clientesRef = collection(this.firestore, 'clients');
    const q = query(clientesRef, where('idNumber', '==', cliente.idNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) throw new Error('Cédula ya registrada');
    const docRef = await addDoc(clientesRef, cliente);
    return docRef.id;
  }

  async agregarProfesional(profesional: Professional): Promise<string> {
    // const profesionalesRef = collection(this.firestore, 'profesionales');
    const profesionalesRef = collection(this.firestore, 'professionals');
    const q = query(profesionalesRef, where('idNumber', '==', profesional.idNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) throw new Error('Cédula ya registrada');
    const docRef = await addDoc(profesionalesRef, profesional);
    return docRef.id;
  }

  async agregarUsuario(usuario: User): Promise<string> {
    const usuariosRef = collection(this.firestore, 'users');
    const docRef = await addDoc(usuariosRef, usuario);
    return docRef.id;
  }

  async login(email: string, password: string): Promise<User | undefined> {
    const usuariosRef = collection(this.firestore, 'users');
    const q = query(usuariosRef, where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? undefined : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as unknown as User;
  }
}