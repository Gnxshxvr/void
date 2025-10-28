'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fish, Shield, User, Anchor } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import type { UserRole } from '@/lib/types';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const { login, t } = useAppContext();
  const router = useRouter();

  const handleLogin = (role: UserRole) => {
    login(role);
    router.push('/dashboard');
  };

  return (
    <main 
        className="flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative"
        style={{ backgroundImage: "url('https://img.freepik.com/free-vector/underwater-background-with-fish-shoal_23-2147595393.jpg?w=740&t=st=1723460699~exp=1723461299~hmac=a40a875a5e783a30c511516f49962a74c2eb63a9cec53a1525c345f1b2b3a05a')"}}
    >
      <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-2xl bg-card/80 z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
              <Anchor className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary">{t('appTitle')}</CardTitle>
          <CardDescription className="pt-2 text-card-foreground/80">{t('appSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-center font-semibold text-card-foreground">{t('loginPrompt')}</h3>
            <Button onClick={() => handleLogin('buyer')} className="w-full" variant="outline">
              <User className="mr-2 h-4 w-4" />
              {t('loginAsBuyer')}
            </Button>
            <Button onClick={() => handleLogin('seller')} className="w-full" variant="outline">
              <Fish className="mr-2 h-4 w-4" />
              {t('loginAsSeller')}
            </Button>
            <Button onClick={() => handleLogin('authority')} className="w-full" variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              {t('loginAsAuthority')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
