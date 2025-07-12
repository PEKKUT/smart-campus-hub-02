
import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import TransaksiSummaryCards from './TransaksiSummaryCards';
import TransaksiForm from './TransaksiForm';
import TransaksiTable from './TransaksiTable';
import { useTransaksiData } from './useTransaksiData';

interface Transaksi {
  id: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

const TransaksiKeuangan = () => {
  const { user } = useAuth();
  const { transaksi, saveTransaksi, deleteTransaksi } = useTransaksiData(user?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaksi, setEditingTransaksi] = useState<Transaksi | null>(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: '',
    deskripsi: '',
    nominal: 0,
    tipe: 'keluar' as 'masuk' | 'keluar'
  });

  const kategoriOptions = {
    masuk: ['Uang Saku', 'Beasiswa', 'Part Time', 'Lainnya'],
    keluar: ['Makanan', 'Transport', 'Buku', 'Fotocopy', 'Internet', 'Hiburan', 'Lainnya']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveTransaksi(formData, editingTransaksi?.id);
    if (success) {
      setIsDialogOpen(false);
      setEditingTransaksi(null);
      resetForm();
    }
  };

  const handleEdit = (transaksiItem: Transaksi) => {
    setEditingTransaksi(transaksiItem);
    setFormData({
      tanggal: transaksiItem.tanggal,
      kategori: transaksiItem.kategori,
      deskripsi: transaksiItem.deskripsi,
      nominal: transaksiItem.nominal,
      tipe: transaksiItem.tipe
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      kategori: '',
      deskripsi: '',
      nominal: 0,
      tipe: 'keluar'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalMasuk = transaksi
    .filter(t => t.tipe === 'masuk')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalKeluar = transaksi
    .filter(t => t.tipe === 'keluar')
    .reduce((sum, t) => sum + t.nominal, 0);

  const saldo = totalMasuk - totalKeluar;

  return (
    <div className="space-y-6">
      <TransaksiSummaryCards
        totalMasuk={totalMasuk}
        totalKeluar={totalKeluar}
        saldo={saldo}
        formatCurrency={formatCurrency}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Riwayat Transaksi
          </CardTitle>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <TransaksiTable
            transaksi={transaksi}
            onEdit={handleEdit}
            onDelete={deleteTransaksi}
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>

      <TransaksiForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingTransaksi={editingTransaksi}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        kategoriOptions={kategoriOptions}
      />
    </div>
  );
};

export default TransaksiKeuangan;
