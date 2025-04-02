import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
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
  profilePicture?: string;
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
  private currentUser: User | null = null;

  constructor(private firestore: Firestore) {}

  async login(email: string, password: string): Promise<User | undefined> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No se encontró usuario con ese email y contraseña');
      return undefined;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = { userId: userDoc.id, ...userDoc.data() } as User;
    this.currentUser = userData; 
    console.log('Usuario logueado:', userData);
    return userData;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async getCurrentProfile(): Promise<Client | Professional | undefined> {
    try {
      if (!this.currentUser) {
        console.error('No hay usuario logueado');
        return undefined;
      }
  
      const collectionName = this.currentUser.role === 'client' ? 'clients' : 'professionals';
  
      const collectionRef = collection(this.firestore, collectionName);
      const q = query(collectionRef, where('idNumber', '==', this.currentUser.userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log(`No se encontró ${this.currentUser.role} con idNumber:`, this.currentUser.userId);
        return undefined;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userData = { idNumber: userDoc.id, ...userDoc.data() };
  
      console.log(`${this.currentUser.role} encontrado:`, userData);
      return this.currentUser.role === 'client' 
        ? (userData as Client) 
        : (userData as Professional);
  
    } catch (error) {
      console.error('Error al buscar usuario por rol:', error);
      return undefined;
    }
  }

  async updateProfile(userId: string, role: 'client' | 'professional', data: Partial<Client> | Partial<Professional>) {
    const collectionName = role === 'client' ? 'clients' : 'professionals';
    const profileRef = collection(this.firestore, collectionName);
    const q = query(profileRef, where('idNumber', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(docRef, data, { merge: true });
      console.log(`${role} actualizado con éxito`);
    } else {
      console.log(`No se encontró ${role} con idNumber: ${userId}`);
    }
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