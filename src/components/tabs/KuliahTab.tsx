
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JadwalKuliah from '../kuliah/JadwalKuliah';
import NilaiKuliah from '../kuliah/NilaiKuliah';
import SKSKuliah from '../kuliah/SKSKuliah';

const KuliahTab = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pengelola Kuliah</h1>
        <p className="text-gray-600">Kelola jadwal, nilai, dan SKS mata kuliah Anda</p>
      </div>

      <Tabs defaultValue="jadwal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jadwal">Jadwal & Kehadiran</TabsTrigger>
          <TabsTrigger value="sks">SKS</TabsTrigger>
          <TabsTrigger value="nilai">Nilai</TabsTrigger>
        </TabsList>

        <TabsContent value="jadwal">
          <JadwalKuliah />
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
