
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JadwalKuliah {
  id: string;
  mata_kuliah: string;
  dosen: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruangan: string;
  sks: number;
}

const JadwalKuliah = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jadwal, setJadwal] = useState<JadwalKuliah[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalKuliah | null>(null);
  const [formData, setFormData] = useState({
    mata_kuliah: '',
    dosen: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: '',
    sks: 0
  });

  const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    if (user) {
      fetchJadwal();
    }
  }, [user]);

  const fetchJadwal = async () => {
    try {
      const { data, error } = await supabase
        .from('jadwal_kuliah')
        .select('*')
        .eq('user_id', user?.id)
        .order('hari', { ascending: true });

      if (error) throw error;
      setJadwal(data || []);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      toast({
        title: "Error",
        description: "Gagal memuat jadwal kuliah",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJadwal) {
        const { error } = await supabase
          .from('jadwal_kuliah')
          .update(formData)
          .eq('id', editingJadwal.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Jadwal berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('jadwal_kuliah')
          .insert([{ ...formData, user_id: user?.id }]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Jadwal berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingJadwal(null);
      resetForm();
      fetchJadwal();
    } catch (error) {
      console.error('Error saving jadwal:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan jadwal",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('jadwal_kuliah')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Jadwal berhasil dihapus",
      });
      fetchJadwal();
    } catch (error) {
      console.error('Error deleting jadwal:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus jadwal",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (jadwalItem: JadwalKuliah) => {
    setEditingJadwal(jadwalItem);
    setFormData({
      mata_kuliah: jadwalItem.mata_kuliah,
      dosen: jadwalItem.dosen,
      hari: jadwalItem.hari,
      jam_mulai: jadwalItem.jam_mulai,
      jam_selesai: jadwalItem.jam_selesai,
      ruangan: jadwalItem.ruangan,
      sks: jadwalItem.sks
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      mata_kuliah: '',
      dosen: '',
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: '',
      sks: 0
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingJadwal(null);
    resetForm();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Jadwal Kuliah
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jadwal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingJadwal ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="mata_kuliah">Mata Kuliah</Label>
                <Input
                  id="mata_kuliah"
                  value={formData.mata_kuliah}
                  onChange={(e) => setFormData({ ...formData, mata_kuliah: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dosen">Dosen</Label>
                <Input
                  id="dosen"
                  value={formData.dosen}
                  onChange={(e) => setFormData({ ...formData, dosen: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hari">Hari</Label>
                <Select
                  value={formData.hari}
                  onValueChange={(value) => setFormData({ ...formData, hari: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                  <SelectContent>
                    {hariOptions.map((hari) => (
                      <SelectItem key={hari} value={hari}>
                        {hari}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jam_mulai">Jam Mulai</Label>
                  <Input
                    id="jam_mulai"
                    type="time"
                    value={formData.jam_mulai}
                    onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jam_selesai">Jam Selesai</Label>
                  <Input
                    id="jam_selesai"
                    type="time"
                    value={formData.jam_selesai}
                    onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ruangan">Ruangan</Label>
                <Input
                  id="ruangan"
                  value={formData.ruangan}
                  onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sks">SKS</Label>
                <Input
                  id="sks"
                  type="number"
                  min="0"
                  max="6"
                  value={formData.sks}
                  onChange={(e) => setFormData({ ...formData, sks: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingJadwal ? 'Update' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {jadwal.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada jadwal kuliah</p>
            <p className="text-sm">Klik tombol "Tambah Jadwal" untuk memulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jadwal.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.mata_kuliah}</TableCell>
                    <TableCell>{item.dosen}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.hari}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.jam_mulai} - {item.jam_selesai}
                    </TableCell>
                    <TableCell>{item.ruangan}</TableCell>
                    <TableCell>
                      <Badge>{item.sks} SKS</Badge>
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
  );
};

export default JadwalKuliah;
