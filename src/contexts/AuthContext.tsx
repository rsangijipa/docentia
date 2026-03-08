'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import {
  registerWithEmail,
  loginWithEmail,
  logoutUser
} from '@/lib/firebase/auth';
import { UserServiceFB } from '@/services/firebase/domain-services';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  schoolId: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: { name: string, email: string, pass: string, role?: string, schoolId?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { },
  signOut: async () => { },
  signUp: async () => { },
  refreshUser: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const syncUserFromFirestore = async (fbUser: FirebaseUser) => {
    try {
      const userData = await UserServiceFB.getByEmail(fbUser.email!);
      setUser({
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || 'Usuário',
        role: userData?.role || 'TEACHER',
        schoolId: userData?.schoolId || null
      });
    } catch (error) {
      console.error("Error syncing user data:", error);
      setUser({
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || 'Usuário',
        role: 'TEACHER',
        schoolId: null
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        await syncUserFromFirestore(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await syncUserFromFirestore(auth.currentUser);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const fbUser = await loginWithEmail(email, pass);
      await syncUserFromFirestore(fbUser);
      toast.success(`Bem-vindo de volta!`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao realizar login: Credenciais inválidas');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, pass, role, schoolId }: { name: string, email: string, pass: string, role?: string, schoolId?: string }) => {
    setLoading(true);
    try {
      const fbUser = await registerWithEmail(name, email, pass);

      // Cria o registro no Firestore
      await UserServiceFB.updateProfile(fbUser.uid, {
        id: fbUser.uid,
        email,
        name,
        role: role || 'TEACHER',
        schoolId: schoolId || null,
        createdAt: new Date()
      });

      await syncUserFromFirestore(fbUser);
      toast.success(`Conta criada com sucesso! Bem-vindo, ${name}.`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao realizar cadastro');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      router.push('/login');
      toast.success('Sessão encerrada.');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao encerrar sessão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
