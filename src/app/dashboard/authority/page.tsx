'use client';

import * as React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function AuthorityDashboardPage() {
  const { purchases, t } = useAppContext();

  const stats = React.useMemo(() => {
    const totalSales = purchases.reduce((acc, p) => acc + p.totalPrice, 0);
    const totalCommission = purchases.reduce((acc, p) => acc + p.commission, 0);
    return {
      totalSales,
      totalCommission,
      totalProfit: totalSales + totalCommission, // Simplified for demo
    };
  }, [purchases]);

  const salesOverTimeData = React.useMemo(() => {
    const salesByDate: { [key: string]: number } = {};
    purchases.forEach(p => {
      const date = new Date(p.purchaseDate).toLocaleDateString();
      salesByDate[date] = (salesByDate[date] || 0) + p.finalBill;
    });
    return Object.entries(salesByDate).map(([date, sales]) => ({ date, sales })).reverse();
  }, [purchases]);
  
  const salesByFishData = React.useMemo(() => {
    const salesByFish: { [key: string]: number } = {};
    purchases.forEach(p => {
      const fishName = p.listing.name;
      salesByFish[fishName] = (salesByFish[fishName] || 0) + p.finalBill;
    });
    return Object.entries(salesByFish).map(([name, sales]) => ({ name, sales }));
  }, [purchases]);

  const chartConfig = {
    sales: {
      label: t('totalSales'),
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="font-headline text-3xl font-bold">{t('analytics')}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('totalSales')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalSales)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('totalCommission')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalCommission)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('totalProfit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalProfit)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('salesOverTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={salesOverTimeData}>
                 <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('salesByFish')}</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={salesByFishData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('fishName')}</TableHead>
                <TableHead>{t('seller')}</TableHead>
                <TableHead>{t('buyer')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead className="text-right">{t('total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.slice(0, 5).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.listing.name}</TableCell>
                  <TableCell>{p.listing.sellerId}</TableCell>
                  <TableCell>{p.buyerId}</TableCell>
                  <TableCell>{new Date(p.purchaseDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.finalBill)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
