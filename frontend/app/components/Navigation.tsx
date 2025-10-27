'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, LayoutDashboard, Package, UserCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="nav-enhanced sticky top-0 z-50 px-6 flex items-center justify-between h-16">
      <div className="flex items-center">
        <Link href="/dashboard" className="text-xl font-bold text-primary mr-8 hover:text-primary/80 transition-colors">
          MyApp
        </Link>
        <nav className="flex items-center space-x-6">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/products" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Package className="h-4 w-4" />
            <span>Products</span>
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-muted-foreground text-sm">
          Welcome, {user?.name || user?.userName}
        </span>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{user?.userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center space-x-2">
                <UserCircle className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
