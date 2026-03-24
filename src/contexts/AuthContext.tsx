'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

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

  const establishServerSession = useCallback(async (idToken: string) => {
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
  }, []);

  const refreshUser = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          await establishServerSession(session.access_token);
          await refreshUser();
        } catch (error) {
          console.error('Error syncing session:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [establishServerSession, refreshUser]);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) throw error;
      if (!data.session) throw new Error('Falha ao iniciar sessao');

      await establishServerSession(data.session.access_token);
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            name,
            role: role || 'TEACHER',
            school_id: schoolId || null,
          }
        }
      });

      if (error) throw error;
      if (!data.session) {
        toast.info('Verifique seu email para confirmar o cadastro.');
        return;
      }

      await establishServerSession(data.session.access_token);
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
      await supabase.auth.signOut();
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
