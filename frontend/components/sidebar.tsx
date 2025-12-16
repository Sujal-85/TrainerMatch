// components/sidebar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  Building2,
  CreditCard,
  Zap,
  Clock,
  User,
  School,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { userRole, logout } = useAuth();

  const getNavItems = () => {
    // Common items or default
    const common = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    const role = userRole ? userRole.toUpperCase() : '';

    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'PLATFORM_OWNER') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Vendors', href: '/admin/vendors', icon: Building2 },
        { name: 'Trainers', href: '/admin/trainers', icon: Users },
        { name: 'Billing', href: '/admin/billing', icon: CreditCard },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    }

    if (role === 'TRAINER') {
      return [
        { name: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
        { name: 'Opportunities', href: '/trainer/opportunities', icon: Zap },
        { name: 'My Sessions', href: '/trainer/sessions', icon: Calendar },
        { name: 'Availability', href: '/trainer/availability', icon: Clock },
        { name: 'My Profile', href: '/trainer/profile', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    }

    // Default VENDOR (or VENDOR_ADMIN)
    return [
      { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
      { name: 'Colleges', href: '/vendor/colleges', icon: School },
      { name: 'Requirements', href: '/vendor/requirements', icon: FileText },
      { name: 'Matches', href: '/vendor/matches', icon: Users },
      { name: 'Documents', href: '/vendor/documents', icon: FileText },
      { name: 'Proposals', href: '/vendor/proposals', icon: MessageSquare },
      { name: 'Sessions', href: '/vendor/sessions', icon: Calendar },
      { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-3 rounded-xl bg-white shadow-lg border border-blue-100 backdrop-blur-md hover:shadow-xl transition-all text-blue-600"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-4 left-0 z-40 h-screen w-64 border-r border-blue-100/50 bg-white/80 backdrop-blur-xl transition-transform duration-300 ease-out shadow-2xl shadow-blue-900/5",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-blue-50/50 via-white to-white">
          {/* Logo & Header */}
          <div className="flex h-20 items-center justify-center border-b border-blue-100 px-6">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
              <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/image.png"
                  alt="Avalytics Logo"
                  className="h-32 w-64 object-contain drop-shadow-md"
                />
              </div>

            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                    active
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 translate-x-1"
                      : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      active ? "text-white" : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                    )}
                  />

                  <span className="relative z-10">{item.name}</span>

                  {/* Active Indicator Dot */}
                  {active && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade / Premium Badge */}
          <div className="p-4 mx-4 mb-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-5 text-center shadow-xl shadow-blue-500/20 group cursor-pointer hover:shadow-blue-500/30 transition-shadow">
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-16 h-16 bg-blue-400/20 rounded-full blur-xl" />

              <div className="relative bg-white/10 w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm border border-white/10">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-bold text-white mb-1">Pro Plan</p>
              <p className="text-xs text-blue-100/80 mb-3">Get unlimited access</p>
              <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none font-semibold shadow-sm">
                Upgrade Now
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-blue-100 p-4 bg-blue-50/30">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Push content when sidebar is open on mobile */}
      <div className={cn("transition-all duration-300 md:hidden", isOpen && "ml-72")} />
    </>
  );
}