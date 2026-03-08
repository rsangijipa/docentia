'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase/client';
import { loginWithEmail, logoutUser, registerWithEmail } from '@/lib/firebase/auth';

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

  const readApiPayload = async (response: Response) => {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    return { success: false, data: null, errorCode: 'INTERNAL_ERROR', message: text || 'Resposta invalida da API' };
  };

  const establishServerSession = async (idToken: string) => {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const payload = await readApiPayload(response);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Falha ao estabelecer sessao segura');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = await readApiPayload(response);
      const sessionUser = payload?.data?.user;

      if (!response.ok || !payload?.success || !sessionUser) {
        setUser(null);
        return;
      }

      setUser({
        id: sessionUser.id,
        email: sessionUser.email ?? null,
        name: sessionUser.name ?? 'Usuario',
        role: sessionUser.role ?? 'TEACHER',
        schoolId: sessionUser.profile?.schoolId ?? null,
      });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken(true);
          await establishServerSession(token);
        }
      } catch {
        // Ignore and continue to session check.
      }

      await refreshUser();
      setLoading(false);
    };

    checkSession();
  }, [establishServerSession, refreshUser]);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const devLoginResponse = await fetch('/api/auth/dev-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pass }),
      });

      const devPayload = await readApiPayload(devLoginResponse);
      if (!devLoginResponse.ok || !devPayload?.success) {
        const fbUser = await loginWithEmail(email, pass);
        const token = await fbUser.getIdToken(true);
        await establishServerSession(token);
      }

      await refreshUser();
      toast.success('Bem-vindo de volta!');
      router.replace('/dashboard');
      router.refresh();
    } catch (error: any) {
      const message = error?.message || 'Erro ao realizar login: credenciais invalidas';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, pass, role, schoolId }: { name: string, email: string, pass: string, role?: string, schoolId?: string }) => {
    setLoading(true);
    try {
      const fbUser = await registerWithEmail(name, email, pass);

      await setDoc(doc(db, 'users', fbUser.uid), {
        id: fbUser.uid,
        email,
        name,
        role: role || 'TEACHER',
        schoolId: schoolId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      const token = await fbUser.getIdToken(true);
      await establishServerSession(token);

      await refreshUser();
      toast.success(`Conta criada com sucesso! Bem-vindo, ${name}.`);
      router.replace('/dashboard');
      router.refresh();
    } catch (error: any) {
      const message = error?.message || 'Erro ao realizar cadastro';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.replace('/login');
      router.refresh();
      toast.success('Sessao encerrada.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao encerrar sessao.');
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
