'use client';

import * as React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { FishListing } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function SellerDashboardPage() {
  const { user, listings, addListing, t } = useAppContext();
  const { toast } = useToast();

  const [fishName, setFishName] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [freshness, setFreshness] = React.useState<'Just Caught' | '1-2 Days' | '3+ Days'>();

  const sellerListings = React.useMemo(() => {
    return listings.filter((listing) => listing.sellerId === user.id);
  }, [listings, user.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fishName && weight && price && freshness) {
      addListing({
        name: fishName,
        weight: Number(weight),
        price: Number(price),
        freshness: freshness,
      });
      toast({ title: t('listingAdded') });
      // Reset form
      setFishName('');
      setWeight('');
      setPrice('');
      setFreshness(undefined);
    }
  };

  return (
    <div className="container mx-auto py-8 grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('addListing')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fishName">{t('fishName')}</Label>
                <Input id="fishName" value={fishName} onChange={(e) => setFishName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">{t('totalWeight')}</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t('pricePerKg')}</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freshness">{t('freshness')}</Label>
                <Select onValueChange={(value) => setFreshness(value as any)} value={freshness} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectFreshness')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Just Caught">{t('justCaught')}</SelectItem>
                    <SelectItem value="1-2 Days">{t('oneToTwoDays')}</SelectItem>
                    <SelectItem value="3+ Days">{t('threePlusDays')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">{t('submitListing')}</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('myListings')}</CardTitle>
            <CardDescription>{t('welcome')}, {user.id}!</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='hidden md:table-cell'></TableHead>
                  <TableHead>{t('fishName')}</TableHead>
                  <TableHead>{t('weight')}</TableHead>
                  <TableHead>{t('price')}</TableHead>
                  <TableHead>{t('freshness')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerListings.length > 0 ? (
                  sellerListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className='hidden md:table-cell'>
                        <Image src={listing.imageUrl} alt={listing.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={listing.imageHint} />
                      </TableCell>
                      <TableCell className="font-medium">{listing.name}</TableCell>
                      <TableCell>{listing.weight} {t('kg')}</TableCell>
                      <TableCell>{formatCurrency(listing.price)} {t('perKg')}</TableCell>
                      <TableCell>{t(listing.freshness.toLowerCase().replace(' ', '').replace('-', '').replace('+', 'plus') as any)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      You have no active listings.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
