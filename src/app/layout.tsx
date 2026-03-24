import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/query-provider';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://docentia.com.br'),
  openGraph: {
    title: 'Docentia | Escritório Pedagógico',
    description: 'A inteligência definitiva para o planejamento e gestão pedagógica do professor moderno.',
    url: 'https://docentia.com.br',
    siteName: 'Docentia',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Docentia | Escritório Pedagógico',
    description: 'A inteligência definitiva para o planejamento e gestão pedagógica do professor moderno.',
  },
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
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors expand={false} closeButton />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
