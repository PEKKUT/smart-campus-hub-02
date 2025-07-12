
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Transaksi {
  id: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

interface FormData {
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

interface TransaksiFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaksi: Transaksi | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  kategoriOptions: {
    masuk: string[];
    keluar: string[];
  };
}

const TransaksiForm = ({
  isOpen,
  onClose,
  editingTransaksi,
  formData,
  setFormData,
  onSubmit,
  kategoriOptions
}: TransaksiFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTransaksi ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="tipe">Tipe Transaksi</Label>
            <Select
              value={formData.tipe}
              onValueChange={(value: 'masuk' | 'keluar') => setFormData({ ...formData, tipe: value, kategori: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masuk">Pemasukan</SelectItem>
                <SelectItem value="keluar">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Select
              value={formData.kategori}
              onValueChange={(value) => setFormData({ ...formData, kategori: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions[formData.tipe].map((kategori) => (
                  <SelectItem key={kategori} value={kategori}>
                    {kategori}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="nominal">Nominal</Label>
            <Input
              id="nominal"
              type="number"
              min="0"
              value={formData.nominal}
              onChange={(e) => setFormData({ ...formData, nominal: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Masukkan deskripsi transaksi..."
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingTransaksi ? 'Update' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransaksiForm;
