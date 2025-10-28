'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Home, Package, ShoppingCart, Users } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardSidebar() {
  const { user, t } = useAppContext();
  const pathname = usePathname();

  const navItems = [
    ...(user.role === 'buyer'
      ? [{ href: '/dashboard/buyer', icon: ShoppingCart, label: t('marketplace') }]
      : []),
    ...(user.role === 'seller'
      ? [{ href: '/dashboard/seller', icon: Package, label: t('myListings') }]
      : []),
    ...(user.role === 'authority'
      ? [{ href: '/dashboard/authority', icon: BarChart2, label: t('analytics') }]
      : []),
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
            {navItems.map((item) => (
            <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                <Link
                    href={item.href}
                    className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
            ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
