'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Settings } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/administrations',
      icon: Settings,
      label: 'Administrations',
    },
  ];

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b">
        <h1
          className={cn(
            'font-semibold transition-all duration-300',
            collapsed ? 'text-lg' : 'text-xl'
          )}
        >
          {collapsed ? 'V' : 'Vanglow'}
        </h1>
      </div>

      <nav className="space-y-1 p-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn('w-full justify-start', collapsed ? 'px-2' : 'px-4')}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
