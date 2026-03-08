import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    OrderByDirection,
    orderBy,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../../lib/firebase/client';

export class FirestoreService {
    static async getOne<T>(collectionName: string, id: string): Promise<T | null> {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    }

    static async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
        const colRef = collection(db, collectionName);
        const q = query(colRef, ...constraints);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    }

    static async create<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, data);
        return docRef.id;
    }

    static async update<T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Promise<void>;
    static async update(collectionName: string, id: string, data: any): Promise<void> {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
    }

    static async delete(collectionName: string, id: string): Promise<void> {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    }
}
