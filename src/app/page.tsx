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
        style={{ backgroundImage: "url('https://img.freepik.com/free-vector/school-fishes-background-hand-drawn-style_23-2147792685.jpg')"}}
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
