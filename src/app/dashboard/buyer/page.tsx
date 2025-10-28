'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { FishListing } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';

export default function BuyerMarketplacePage() {
  const { listings, t, makePurchase } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortMethod, setSortMethod] = React.useState('freshness-newest');
  const [selectedListing, setSelectedListing] = React.useState<FishListing | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = React.useState(1);

  const sortedAndFilteredListings = React.useMemo(() => {
    return listings
      .filter((listing) =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortMethod) {
          case 'price-low-high':
            return a.price - b.price;
          case 'price-high-low':
            return b.price - a.price;
          case 'freshness-oldest':
            return new Date(a.dateListed).getTime() - new Date(b.dateListed).getTime();
          case 'freshness-newest':
          default:
            return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
        }
      });
  }, [listings, searchTerm, sortMethod]);

  const handleBuyClick = (listing: FishListing) => {
    setSelectedListing(listing);
    setPurchaseQuantity(1);
  }

  const handleConfirmPurchase = () => {
    if (selectedListing && purchaseQuantity > 0 && purchaseQuantity <= selectedListing.weight) {
      const newPurchase = makePurchase(selectedListing, purchaseQuantity);
      toast({
        title: t('purchaseSuccess'),
        description: `${purchaseQuantity}kg of ${selectedListing.name}`,
        action: <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/bill/${newPurchase.id}`)}>{t('viewBill')}</Button>
      });
      setSelectedListing(null);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <h1 className="font-headline text-3xl font-bold">{t('marketplace')}</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            type="search"
            placeholder={t('searchFish')}
            className="w-full md:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={sortMethod} onValueChange={setSortMethod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freshness-newest">{t('freshnessNewest')}</SelectItem>
              <SelectItem value="freshness-oldest">{t('freshnessOldest')}</SelectItem>
              <SelectItem value="price-low-high">{t('priceLowToHigh')}</SelectItem>
              <SelectItem value="price-high-low">{t('priceHighToLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedAndFilteredListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={listing.imageUrl}
                  alt={listing.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={listing.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="font-headline text-2xl mb-2">{listing.name}</CardTitle>
              <CardDescription className="flex justify-between">
                <span>{t('freshness')}: <Badge variant={listing.freshness === 'Just Caught' ? 'default' : 'secondary'} className={listing.freshness === 'Just Caught' ? 'bg-accent' : ''}>{t(listing.freshness.toLowerCase().replace(' ', '').replace('-', '').replace('+', 'plus') as any)}</Badge></span>
                <span>{t('available')}: {listing.weight} {t('kg')}</span>
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center bg-slate-50">
              <p className="text-xl font-bold text-primary">{formatCurrency(listing.price)}<span className="text-sm font-normal text-muted-foreground">{t('perKg')}</span></p>
              <Button onClick={() => handleBuyClick(listing)}>{t('buy')}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        {selectedListing && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className='font-headline'>{t('buy')} {selectedListing.name}</DialogTitle>
              <DialogDescription>
                {t('available')}: {selectedListing.weight} {t('kg')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  {t('weight')} ({t('kg')})
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                  min="1"
                  max={selectedListing.weight}
                  className="col-span-3"
                />
              </div>
              <div className="text-right font-bold text-lg">
                {t('total')}: {formatCurrency(selectedListing.price * purchaseQuantity)}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleConfirmPurchase}>{t('buy')}</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
