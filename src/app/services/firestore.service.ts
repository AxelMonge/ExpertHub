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
  profilePicture?: string;
  locationDetails?: { lat: number; lng: number; city: string; country: string };
  rating?: number;
  totalReviews?: number;
  availability?: boolean;
  membership?: boolean;
  skills_array?: string[];
  views?: number;
  updatedAt?: any;
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
  role: 'client' | 'professional';
  createdAt: Date;
  lastLogin: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  private currentUser: Client | Professional | null = null;

  constructor(private firestore: Firestore) {}

  async login(email: string, password: string): Promise<Client | Professional | undefined> {
    // Buscar en la colección 'users'
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No se encontró usuario con ese email y contraseña');
      return undefined;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = { userId: userDoc.id, ...userDoc.data() } as User;
    console.log('Usuario encontrado:', userData);

    // Buscar en 'clients' o 'professionals' usando 'idNumber' como campo
    if (userData.role === 'client') {
      const clientsRef = collection(this.firestore, 'clients');
      const clientQuery = query(clientsRef, where('idNumber', '==', userData.userId));
      const clientSnapshot = await getDocs(clientQuery);
      if (!clientSnapshot.empty) {
        const clientDoc = clientSnapshot.docs[0];
        console.log('Cliente encontrado:', clientDoc.data());
        return { idNumber: clientDoc.id, ...clientDoc.data() } as Client;
      } else {
        console.log('No se encontró cliente con idNumber:', userData.userId);
      }
    } else if (userData.role === 'professional') {
      const profsRef = collection(this.firestore, 'professionals');
      const profQuery = query(profsRef, where('idNumber', '==', userData.userId));
      const profSnapshot = await getDocs(profQuery);
      if (!profSnapshot.empty) {
        const profDoc = profSnapshot.docs[0];
        console.log('Profesional encontrado:', profDoc.data());
        return { idNumber: profDoc.id, ...profDoc.data() } as Professional;
      } else {
        console.log('No se encontró profesional con idNumber:', userData.userId);
      }
    }

    console.log('No se encontró cliente o profesional asociado');
    return undefined;
  }

  setCurrentUser(user: Client | Professional | null) {
    this.currentUser = user;
  }

  getCurrentUser(): Client | Professional | null {
    return this.currentUser;
  }
  

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
    const clientsRef = collection(this.firestore, 'clients');
    const q = query(clientsRef, where('idNumber', '==', cliente.idNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) throw new Error('Cédula ya registrada');
    const docRef = await addDoc(clientsRef, cliente);
    return docRef.id;
  }

  async agregarProfesional(profesional: Professional): Promise<string> {
    const professionalsRef = collection(this.firestore, 'professionals');
    const q = query(professionalsRef, where('idNumber', '==', profesional.idNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) throw new Error('Cédula ya registrada');
    const docRef = await addDoc(professionalsRef, profesional);
    return docRef.id;
  }

  async agregarUsuario(usuario: User): Promise<string> {
    const usersRef = collection(this.firestore, 'users');
    const docRef = await addDoc(usersRef, usuario);
    return docRef.id;
  }

  async getPortfolio(idNumber: string): Promise<any[]> {
    const portfolioRef = collection(this.firestore, `professionals/${idNumber}/portfolio`);
    const snapshot = await getDocs(portfolioRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async getCourses(idNumber: string): Promise<any[]> {
    const coursesRef = collection(this.firestore, `professionals/${idNumber}/courses`);
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async getReviews(idNumber: string): Promise<any[]> {
    const reviewsRef = collection(this.firestore, `professionals/${idNumber}/reviews`);
    const snapshot = await getDocs(reviewsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}