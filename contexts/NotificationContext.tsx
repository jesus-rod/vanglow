'use client';

import { createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ShowNotificationFunction, NotificationType } from '@/lib/apiClient/types/types';

interface NotificationContextType {
  showNotification: ShowNotificationFunction;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const showNotification: ShowNotificationFunction = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    toast({
      variant: type === 'error' ? 'destructive' : 'default',
      title: message,
      description: description,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
