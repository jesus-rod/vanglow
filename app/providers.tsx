'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          {children}
          <Toaster />
        </NotificationProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
