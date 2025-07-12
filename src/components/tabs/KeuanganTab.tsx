
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransaksiKeuangan from '../keuangan/TransaksiKeuangan';
import StatistikKeuangan from '../keuangan/StatistikKeuangan';

const KeuanganTab = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pengelola Keuangan</h1>
        <p className="text-gray-600">Kelola transaksi dan lihat statistik keuangan Anda</p>
      </div>

      <Tabs defaultValue="transaksi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transaksi">Transaksi</TabsTrigger>
          <TabsTrigger value="statistik">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="transaksi">
          <TransaksiKeuangan />
        </TabsContent>

        <TabsContent value="statistik">
          <StatistikKeuangan />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeuanganTab;
