'use client';

import * as React from 'react';
import type { UserRole, Language, FishListing, Purchase } from '@/lib/types';
import { translations } from '@/lib/translations';
import { initialFishListings } from '@/lib/data';

interface AppContextType {
  user: { role: UserRole; id: string | null };
  language: Language;
  listings: FishListing[];
  purchases: Purchase[];
  login: (role: UserRole) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  addListing: (listing: Omit<FishListing, 'id' | 'sellerId' | 'dateListed' | 'imageUrl' | 'imageHint'>) => void;
  makePurchase: (listing: FishListing, quantity: number) => Purchase;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<{ role: UserRole; id: string | null }>({ role: null, id: null });
  const [language, setLanguage] = React.useState<Language>('en');
  const [listings, setListings] = React.useState<FishListing[]>(initialFishListings);
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  
  React.useEffect(() => {
    const storedLang = localStorage.getItem('matsyasetu-lang') as Language | null;
    if (storedLang && ['en', 'ta', 'hi', 'bn'].includes(storedLang)) {
      setLanguage(storedLang);
    }
  }, []);

  const login = (role: UserRole) => {
    if (role) {
      setUser({ role, id: `${role}1` });
    }
  };

  const logout = () => {
    setUser({ role: null, id: null });
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('matsyasetu-lang', lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  };

  const addListing = (newListingData: Omit<FishListing, 'id' | 'sellerId' | 'dateListed' | 'imageUrl' | 'imageHint'>) => {
    const newListing: FishListing = {
      ...newListingData,
      id: `fish-${Date.now()}`,
      sellerId: user.id || 'unknown-seller',
      dateListed: new Date().toISOString(),
      imageUrl: 'https://picsum.photos/seed/' + Date.now() + '/600/400',
      imageHint: newListingData.name.toLowerCase(),
    };
    setListings(prev => [newListing, ...prev]);
  };
  
  const makePurchase = (listing: FishListing, quantity: number): Purchase => {
    const subtotal = listing.price * quantity;
    const commission = subtotal * 0.025;
    const tax = subtotal * 0.05;
    const finalBill = subtotal + commission + tax;

    const newPurchase: Purchase = {
      id: `purchase-${Date.now()}`,
      listing,
      buyerId: user.id || 'unknown-buyer',
      quantity,
      purchaseDate: new Date().toISOString(),
      totalPrice: subtotal,
      commission,
      tax,
      finalBill,
    };
    
    setPurchases(prev => [newPurchase, ...prev]);
    
    // Update the weight of the original listing
    setListings(prevListings =>
      prevListings.map(l =>
        l.id === listing.id ? { ...l, weight: l.weight - quantity } : l
      ).filter(l => l.weight > 0)
    );

    return newPurchase;
  };

  const value = {
    user,
    language,
    listings,
    purchases,
    login,
    logout,
    setLanguage: handleSetLanguage,
    t,
    addListing,
    makePurchase
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
