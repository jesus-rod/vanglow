'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Moon, Sun, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/app/providers';

interface NavbarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Navbar({ collapsed, setCollapsed }: NavbarProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
