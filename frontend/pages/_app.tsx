import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import ChatAssistant from '@/components/ChatAssistant';

import { Toaster } from 'sonner';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ChatAssistant />
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}