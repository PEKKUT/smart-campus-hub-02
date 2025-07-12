
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
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

  useEffect(() => {
    if (user) {
      fetchTransaksi();
    }
  }, [user]);

  const fetchTransaksi = async () => {
    try {
      const { data, error } = await supabase
        .from('transaksi')
        .select('*')
        .eq('user_id', user?.id)
        .order('tanggal', { ascending: false });

      if (error) throw error;
      
      // Type-safe mapping to ensure tipe is properly typed
      const typedTransaksi: Transaksi[] = (data || []).map(item => ({
        id: item.id,
        tanggal: item.tanggal,
        kategori: item.kategori,
        deskripsi: item.deskripsi,
        nominal: item.nominal,
        tipe: item.tipe as 'masuk' | 'keluar'
      }));
      
      setTransaksi(typedTransaksi);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data transaksi",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTransaksi) {
        const { error } = await supabase
          .from('transaksi')
          .update({ ...formData, user_id: user?.id })
          .eq('id', editingTransaksi.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('transaksi')
          .insert([{ ...formData, user_id: user?.id }]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingTransaksi(null);
      resetForm();
      fetchTransaksi();
    } catch (error) {
      console.error('Error saving transaksi:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan transaksi",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transaksi')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dihapus",
      });
      fetchTransaksi();
    } catch (error) {
      console.error('Error deleting transaksi:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus transaksi",
        variant: "destructive",
      });
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
      currency: 'IDR'
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalMasuk)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalKeluar)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(saldo)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Riwayat Transaksi
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaksi ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {transaksi.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada transaksi</p>
              <p className="text-sm">Klik tombol "Tambah Transaksi" untuk memulai</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaksi.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.kategori}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.deskripsi}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.tipe === 'masuk' ? 'default' : 'secondary'}
                          className={item.tipe === 'masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {item.tipe === 'masuk' ? 'Masuk' : 'Keluar'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className={item.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'}>
                          {item.tipe === 'masuk' ? '+' : '-'}{formatCurrency(item.nominal)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransaksiKeuangan;
