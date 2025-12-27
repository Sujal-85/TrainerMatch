// components/header.tsx
import React, { useState } from 'react';
import Script from 'next/script';
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
  Users,
  Zap,
  Calendar,
  Clock,
  School,
  FileText,
  MessageSquare,
  BarChart3,
  Building2,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, userRole } = useAuth();

  const getNavItems = (): { href: string; label: string; icon?: any }[] => {
    if (!userRole) {
      return [
        { href: '#features', label: 'Features' },
        { href: '#testimonials', label: 'Testimonials' },
        { href: '#pricing', label: 'Pricing' },
      ];
    }

    const role = userRole.toUpperCase();

    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'PLATFORM_OWNER') {
      return [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/vendors', label: 'Vendors', icon: Building2 },
        { href: '/admin/trainers', label: 'Trainers', icon: Users },
        { href: '/admin/billing', label: 'Billing', icon: CreditCard },
        { href: '/settings', label: 'Settings', icon: Settings },
      ];
    }

    if (role === 'TRAINER') {
      return [
        { href: '/trainer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/trainer/opportunities', label: 'Opportunities', icon: Zap },
        { href: '/trainer/sessions', label: 'Sessions', icon: Calendar },
        { href: '/trainer/availability', label: 'Availability', icon: Clock },
        { href: '/trainer/profile', label: 'Profile', icon: User },
        { href: '/settings', label: 'Settings', icon: Settings },
      ];
    }

    // Default VENDOR (or VENDOR_ADMIN)
    return [
      { href: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/vendor/colleges', label: 'Colleges', icon: School },
      { href: '/vendor/requirements', label: 'Requirements', icon: FileText },
      { href: '/vendor/matches', label: 'Matches', icon: Users },
      { href: '/vendor/documents', label: 'Documents', icon: FileText },
      { href: '/vendor/proposals', label: 'Proposals', icon: MessageSquare },
      { href: '/vendor/sessions', label: 'Sessions', icon: Calendar },
      { href: '/vendor/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/settings', label: 'Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <div className="relative transform hover:scale-110 transition-transform duration-300">
              <img
                src="/image.png"
                alt="TrainerMatch Logo"
                className="h-32 w-auto object-contain dark:invert dark:brightness-100"
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
                    "text-sm font-medium transition-all duration-200 hover:text-blue-600 flex items-center gap-2 dark:text-zinc-400 dark:hover:text-blue-400",
                    "relative after:absolute after:bottom-[-6px] after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400">
                Pricing
              </Link>
            </nav>
          )}

          {/* Right Side: Theme Toggle + Auth Buttons or Avatar */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                {/* Mobile Menu (Logged In) */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" className="relative dark:text-white dark:hover:bg-white/10">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 pt-12 dark:bg-zinc-950 dark:border-white/10">
                    <div className="flex flex-col gap-6 mt-8">
                      <div className="px-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 dark:text-zinc-500">
                          Navigation
                        </p>
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors dark:hover:bg-white/5"
                          >
                            {item.icon && <item.icon className="w-5 h-5 dark:text-zinc-400" />}
                            <span className="font-medium dark:text-zinc-200">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t pt-6 px-2 dark:border-white/10">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 dark:text-zinc-500">
                          Account
                        </p>

                        <button
                          onClick={() => {
                            auth.signOut().then(() => toast.success('Logged out successfully'));
                          }}
                          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-accent transition-colors text-left text-red-600 dark:text-red-400 dark:hover:bg-red-950/20"
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
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full dark:hover:bg-white/10">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md dark:border-zinc-800">
                        <AvatarImage src={user.photoURL || "https://github.com/shadcn.png"} alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mr-4 bg-white dark:bg-zinc-950 dark:border-white/10" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none dark:text-zinc-200">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground dark:text-zinc-500">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-white/10" />
                    <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-zinc-300">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-zinc-300">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-zinc-300">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-white/10" />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 dark:hover:bg-red-950/20" onClick={() => {
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
                  <Button variant="ghost" className="text-sm font-medium dark:text-zinc-300 dark:hover:bg-white/5">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6 border-none">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}