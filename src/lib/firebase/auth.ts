import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    User
} from 'firebase/auth';
import { auth } from './client';

export const registerWithEmail = async (name: string, email: string, pass: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // Atualiza o perfil com o nome
        await updateProfile(userCredential.user, {
            displayName: name
        });
        return userCredential.user;
    } catch (error: any) {
        console.error("Firebase Registration Error:", error.message);
        throw error;
    }
};

export const loginWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    } catch (error: any) {
        console.error("Firebase Login Error:", error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error("Firebase Logout Error:", error.message);
        throw error;
    }
};

export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error("Firebase Password Reset Error:", error.message);
        throw error;
    }
};
