
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JadwalKuliah from '../kuliah/JadwalKuliah';
import NilaiKuliah from '../kuliah/NilaiKuliah';
import SKSKuliah from '../kuliah/SKSKuliah';
import PengambilanMataKuliah from '../kuliah/PengambilanMataKuliah';
import KehadiranHarian from '../kuliah/KehadiranHarian';

const KuliahTab = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pengelola Kuliah</h1>
        <p className="text-sm sm:text-base text-gray-600">Kelola jadwal, nilai, dan SKS mata kuliah Anda</p>
      </div>

      <Tabs defaultValue="pengambilan" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 text-xs sm:text-sm">
          <TabsTrigger value="pengambilan" className="px-2 py-1 sm:px-3 sm:py-2">Pengambilan MK</TabsTrigger>
          <TabsTrigger value="jadwal" className="px-2 py-1 sm:px-3 sm:py-2">Jadwal</TabsTrigger>
          <TabsTrigger value="kehadiran" className="px-2 py-1 sm:px-3 sm:py-2">Kehadiran</TabsTrigger>
          <TabsTrigger value="sks" className="px-2 py-1 sm:px-3 sm:py-2">SKS</TabsTrigger>
          <TabsTrigger value="nilai" className="px-2 py-1 sm:px-3 sm:py-2">Nilai</TabsTrigger>
        </TabsList>

        <TabsContent value="pengambilan">
          <PengambilanMataKuliah />
        </TabsContent>

        <TabsContent value="jadwal">
          <JadwalKuliah />
        </TabsContent>

        <TabsContent value="kehadiran">
          <KehadiranHarian />
        </TabsContent>

        <TabsContent value="sks">
          <SKSKuliah />
        </TabsContent>

        <TabsContent value="nilai">
          <NilaiKuliah />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KuliahTab;
