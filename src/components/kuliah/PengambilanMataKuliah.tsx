
import React, { useState, useEffect } from 'react';
import { BookPlus, GraduationCap, Clock, User, MapPin } from 'lucide-react';
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

interface MataKuliah {
  id: string;
  mata_kuliah: string;
  dosen: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruangan: string;
  sks: number;
}

const PengambilanMataKuliah = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mataKuliah, setMataKuliah] = useState<MataKuliah[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    mata_kuliah: '',
    dosen: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: '',
    sks: 1
  });

  const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    if (user) {
      fetchMataKuliah();
    }
  }, [user]);

  const fetchMataKuliah = async () => {
    try {
      const { data, error } = await supabase
        .from('jadwal_kuliah')
        .select('*')
        .eq('user_id', user?.id)
        .order('mata_kuliah', { ascending: true });

      if (error) throw error;
      
      setMataKuliah(data || []);
    } catch (error) {
      console.error('Error fetching mata kuliah:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data mata kuliah",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('jadwal_kuliah')
        .insert([{
          ...formData,
          user_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Mata kuliah berhasil ditambahkan",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchMataKuliah();
    } catch (error) {
      console.error('Error saving mata kuliah:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan mata kuliah",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      mata_kuliah: '',
      dosen: '',
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: '',
      sks: 1
    });
  };

  const totalSKS = mataKuliah.reduce((total, mk) => total + mk.sks, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <BookPlus className="w-5 h-5 text-white" />
            </div>
            Pengambilan Mata Kuliah
          </h2>
          <p className="text-gray-600 mt-1">Kelola dan pantau mata kuliah yang Anda ambil</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <BookPlus className="h-4 w-4 mr-2" />
              Tambah Mata Kuliah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">Tambah Mata Kuliah Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mata_kuliah" className="text-sm font-medium text-gray-700">Nama Mata Kuliah</Label>
                  <Input
                    id="mata_kuliah"
                    value={formData.mata_kuliah}
                    onChange={(e) => setFormData({ ...formData, mata_kuliah: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosen" className="text-sm font-medium text-gray-700">Nama Dosen</Label>
                  <Input
                    id="dosen"
                    value={formData.dosen}
                    onChange={(e) => setFormData({ ...formData, dosen: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hari" className="text-sm font-medium text-gray-700">Hari</Label>
                  <Select
                    value={formData.hari}
                    onValueChange={(value) => setFormData({ ...formData, hari: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
                <div className="space-y-2">
                  <Label htmlFor="jam_mulai" className="text-sm font-medium text-gray-700">Jam Mulai</Label>
                  <Input
                    id="jam_mulai"
                    type="time"
                    value={formData.jam_mulai}
                    onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jam_selesai" className="text-sm font-medium text-gray-700">Jam Selesai</Label>
                  <Input
                    id="jam_selesai"
                    type="time"
                    value={formData.jam_selesai}
                    onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruangan" className="text-sm font-medium text-gray-700">Ruangan</Label>
                  <Input
                    id="ruangan"
                    value={formData.ruangan}
                    onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Contoh: A101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sks" className="text-sm font-medium text-gray-700">SKS</Label>
                  <Select
                    value={formData.sks.toString()}
                    onValueChange={(value) => setFormData({ ...formData, sks: parseInt(value) })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Pilih SKS" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((sks) => (
                        <SelectItem key={sks} value={sks.toString()}>
                          {sks} SKS
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Simpan Mata Kuliah
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-6">
          {mataKuliah.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookPlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Mata Kuliah</h3>
              <p className="text-gray-500 mb-6">Mulai tambahkan mata kuliah yang Anda ambil semester ini</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <BookPlus className="h-4 w-4 mr-2" />
                Tambah Mata Kuliah Pertama
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Semester {user?.semester || 'Aktif'}
                    </h3>
                    <p className="text-sm text-gray-600">{mataKuliah.length} mata kuliah</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1"
                >
                  Total: {totalSKS} SKS
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold text-gray-700">Mata Kuliah</TableHead>
                      <TableHead className="font-semibold text-gray-700">Dosen</TableHead>
                      <TableHead className="font-semibold text-gray-700">Jadwal</TableHead>
                      <TableHead className="font-semibold text-gray-700">Ruangan</TableHead>
                      <TableHead className="font-semibold text-gray-700">SKS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mataKuliah.map((course) => (
                      <TableRow key={course.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          {course.mata_kuliah}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-700">
                            <User className="h-4 w-4 text-gray-400" />
                            {course.dosen}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {course.hari}, {course.jam_mulai}-{course.jam_selesai}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {course.ruangan || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="border-blue-200 text-blue-700 bg-blue-50"
                          >
                            {course.sks} SKS
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PengambilanMataKuliah;
