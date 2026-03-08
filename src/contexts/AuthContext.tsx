'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
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

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth me check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciais inválidas');
      }

      const data = await response.json();
      setUser(data.user);
      toast.success(`Bem-vindo, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, pass, role, schoolId }: { name: string, email: string, pass: string, role?: string, schoolId?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role, schoolId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar usuário');
      }

      const data = await response.json();
      setUser(data.user);
      toast.success(`Conta criada com sucesso! Bem-vindo, ${data.user.name}.`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
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
