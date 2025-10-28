'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    if (!user.role) {
      router.replace('/');
    } else {
      setIsCheckingAuth(false);
    }
  }, [user, router]);
  
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Skeleton className="h-8 w-32" />
                <div className="ml-auto flex gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Skeleton className="h-96 w-full" />
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
