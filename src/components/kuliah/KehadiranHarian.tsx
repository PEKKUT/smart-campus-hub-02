
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Kehadiran {
  id: string;
  tanggal: string;
  status: string;
  mata_kuliah: string;
  jadwal_id: string;
}

interface JadwalKuliah {
  id: string;
  mata_kuliah: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

const KehadiranHarian = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kehadiran, setKehadiran] = useState<Kehadiran[]>([]);
  const [jadwalOptions, setJadwalOptions] = useState<JadwalKuliah[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      fetchKehadiran();
      fetchJadwalOptions();
    }
  }, [user]);

  const fetchKehadiran = async () => {
    try {
      const { data, error } = await supabase
        .from('kehadiran')
        .select(`
          *,
          jadwal_kuliah (mata_kuliah)
        `)
        .eq('user_id', user?.id)
        .order('tanggal', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        mata_kuliah: item.jadwal_kuliah?.mata_kuliah || ''
      })) || [];
      
      setKehadiran(formattedData);
    } catch (error) {
      console.error('Error fetching kehadiran:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kehadiran",
        variant: "destructive",
      });
    }
  };

  const fetchJadwalOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('jadwal_kuliah')
        .select('id, mata_kuliah, hari, jam_mulai, jam_selesai')
        .eq('user_id', user?.id);

      if (error) throw error;
      setJadwalOptions(data || []);
    } catch (error) {
      console.error('Error fetching jadwal options:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('kehadiran')
        .insert([{
          user_id: user?.id,
          jadwal_id: selectedJadwal,
          tanggal: selectedDate,
          status: selectedStatus
        }]);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data kehadiran berhasil ditambahkan",
      });

      setIsDialogOpen(false);
      setSelectedJadwal('');
      setSelectedStatus('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      fetchKehadiran();
    } catch (error) {
      console.error('Error saving kehadiran:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data kehadiran",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'H':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'S':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'A':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'H':
        return 'Hadir';
      case 'S':
        return 'Sakit';
      case 'A':
        return 'Alpa';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'H':
        return 'bg-green-100 text-green-800';
      case 'S':
        return 'bg-yellow-100 text-yellow-800';
      case 'A':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Kehadiran Harian
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kehadiran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Kehadiran Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium mb-2">Tanggal</label>
                <input
                  id="tanggal"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="jadwal" className="block text-sm font-medium mb-2">Mata Kuliah</label>
                <Select value={selectedJadwal} onValueChange={setSelectedJadwal} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata kuliah" />
                  </SelectTrigger>
                  <SelectContent>
                    {jadwalOptions.map((jadwal) => (
                      <SelectItem key={jadwal.id} value={jadwal.id}>
                        {jadwal.mata_kuliah} - {jadwal.hari} ({jadwal.jam_mulai}-{jadwal.jam_selesai})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">Status Kehadiran</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H">Hadir</SelectItem>
                    <SelectItem value="S">Sakit</SelectItem>
                    <SelectItem value="A">Alpa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Simpan</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {kehadiran.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data kehadiran</p>
            <p className="text-sm">Klik tombol "Tambah Kehadiran" untuk memulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kehadiran.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="font-medium">{item.mata_kuliah}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(item.status)}
                        {getStatusLabel(item.status)}
                      </Badge>
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

export default KehadiranHarian;
