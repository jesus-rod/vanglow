'use client';

import { useSession } from 'next-auth/react';
import Navbar from '@/core/layout/components/Navbar';
import Sidebar from '@/core/layout/components/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} />
      <div
        className={cn('min-h-screen transition-all duration-300', collapsed ? 'ml-16' : 'ml-64')}
      >
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="p-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedContent>{children}</ProtectedContent>;
}
