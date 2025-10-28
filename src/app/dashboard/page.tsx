'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';

export default function DashboardRedirectPage() {
  const { user } = useAppContext();
  const router = useRouter();

  React.useEffect(() => {
    if (user.role) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
        <p>Loading your dashboard...</p>
    </div>
  );
}
