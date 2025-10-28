'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Anchor, Printer } from 'lucide-react';

export default function BillPage() {
  const { purchaseId } = useParams();
  const { purchases, t } = useAppContext();
  const [purchase, setPurchase] = React.useState(purchases.find(p => p.id === purchaseId));

  React.useEffect(() => {
    setPurchase(purchases.find(p => p.id === purchaseId));
  }, [purchases, purchaseId]);

  const handlePrint = () => {
    window.print();
  };

  if (!purchase) {
    return <div className="text-center py-10">Bill not found.</div>;
  }

  const { listing, quantity, purchaseDate, totalPrice, commission, tax, finalBill } = purchase;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle className="font-headline text-3xl">{t('bill')}</CardTitle>
                <CardDescription>#{purchase.id}</CardDescription>
            </div>
            <Button onClick={handlePrint} variant="outline" size="icon">
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print</span>
            </Button>
        </CardHeader>
        <CardContent>
            <div id="printable-bill" className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold font-headline text-2xl text-primary">{t('appTitle')}</h2>
                        <p className="text-muted-foreground">{t('appSubtitle')}</p>
                    </div>
                    <Anchor className="h-12 w-12 text-primary/80"/>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">{t('seller')}</h3>
                        <p>{listing.sellerId}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold">{t('buyer')}</h3>
                        <p>{purchase.buyerId}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold">{t('purchaseDetails')}</h3>
                    <p className="text-muted-foreground">{t('date')}: {new Date(purchaseDate).toLocaleString()}</p>
                </div>
                
                <div className="rounded-lg border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left font-semibold">{t('fishName')}</th>
                                <th className="p-2 text-right font-semibold">{t('weight')}</th>
                                <th className="p-2 text-right font-semibold">{t('price')}</th>
                                <th className="p-2 text-right font-semibold">{t('total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">{listing.name}</td>
                                <td className="p-2 text-right">{quantity} {t('kg')}</td>
                                <td className="p-2 text-right">{formatCurrency(listing.price)} {t('perKg')}</td>
                                <td className="p-2 text-right">{formatCurrency(totalPrice)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between">
                            <span>{t('subtotal')}</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('commission')}</span>
                            <span>{formatCurrency(commission)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('tax')}</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>{t('total')}</span>
                            <span>{formatCurrency(finalBill)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
