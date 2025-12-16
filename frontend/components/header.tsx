// components/header.tsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  X,
  LogOut,
  User,
  Settings,
  CreditCard,
  LayoutDashboard,
  FilePlus2,
  Users
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, userRole } = useAuth();

  const getDashboardLink = () => {
    if (userRole === 'VENDOR_ADMIN' || userRole === 'VENDOR_USER') return '/vendor/dashboard';
    if (userRole === 'TRAINER') return '/trainer/dashboard';
    return '/admin/dashboard';
  };

  const navItems = [
    { href: getDashboardLink(), label: 'Dashboard', icon: LayoutDashboard },
    { href: '/requirements/new', label: 'New Requirement', icon: FilePlus2 },
    { href: '/matches', label: 'Matches', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <div className="relative transform hover:scale-110 transition-transform duration-300">
            <img
              src="/image.png"
              alt="TrainerMatch Logo"
              className="h-32 w-auto object-contain"
            />
          </div>
          {/* <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            TrainerMatch
          </span> */}
        </Link>

        {/* Desktop Navigation - Only if logged in */}
        {user ? (
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-blue-600 flex items-center gap-2",
                  "relative after:absolute after:bottom-[-6px] after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </nav>
        )}

        {/* Right Side: Auth Buttons or Avatar */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Mobile Menu (Logged In) */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="relative">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 pt-12">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="px-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Navigation
                      </p>
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t pt-6 px-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Account
                      </p>

                      <button
                        onClick={() => {
                          auth.signOut().then(() => toast.success('Logged out successfully'));
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-accent transition-colors text-left text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Log out</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                      <AvatarImage src={user.photoURL || "https://github.com/shadcn.png"} alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-4" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => {
                    auth.signOut().then(() => toast.success('Logged out successfully'));
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:inline-flex">
                <Button variant="ghost" className="text-sm font-medium">Log in</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}