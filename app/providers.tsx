'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
      <Toaster />
    </NotificationProvider>
  );
}
