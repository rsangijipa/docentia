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
  title: 'Docentia | Escritório Pedagógico',
  description: 'A inteligência definitiva para o planejamento e gestão pedagógica do professor moderno.',
  keywords: 'plano de aula, diário de classe, BNCC, PNLD, gestão escolar, professor, docentia',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
