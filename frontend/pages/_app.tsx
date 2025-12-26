import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
const ChatAssistant = dynamic(() => import('@/components/ChatAssistant'), { ssr: false });

import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Component {...pageProps} />
        <ChatAssistant />
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}