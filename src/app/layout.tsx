import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Docentia — Escritório Pedagógico Digital',
  description: 'Planeje aulas, preencha diários, gerencie turmas e exporte relatórios em um só lugar. Feito para professores.',
  keywords: 'plano de aula, diário de classe, BNCC, PNLD, gestão escolar, professor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors expand={false} closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
