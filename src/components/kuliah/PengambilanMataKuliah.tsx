
import React, { useState, useEffect } from 'react';
import { BookPlus, GraduationCap, Clock, User } from 'lucide-react';
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
  semester: number;
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
    sks: 1,
    semester: 1
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
        .order('semester', { ascending: true });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        semester: user?.semester || 1
      })) || [];
      
      setMataKuliah(formattedData);
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
      sks: 1,
      semester: 1
    });
  };

  const totalSKSPerSemester = (semester: number) => {
    return mataKuliah
      .filter(mk => mk.semester === semester)
      .reduce((total, mk) => total + mk.sks, 0);
  };

  const groupedBySemester = mataKuliah.reduce((acc, mk) => {
    if (!acc[mk.semester]) {
      acc[mk.semester] = [];
    }
    acc[mk.semester].push(mk);
    return acc;
  }, {} as Record<number, MataKuliah[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookPlus className="h-5 w-5" />
            Pengambilan Mata Kuliah
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <BookPlus className="h-4 w-4 mr-2" />
                Tambah Mata Kuliah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mata_kuliah">Nama Mata Kuliah</Label>
                    <Input
                      id="mata_kuliah"
                      value={formData.mata_kuliah}
                      onChange={(e) => setFormData({ ...formData, mata_kuliah: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosen">Nama Dosen</Label>
                    <Input
                      id="dosen"
                      value={formData.dosen}
                      onChange={(e) => setFormData({ ...formData, dosen: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Select
                      value={formData.sks.toString()}
                      onValueChange={(value) => setFormData({ ...formData, sks: parseInt(value) })}
                    >
                      <SelectTrigger>
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
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={formData.semester.toString()}
                      onValueChange={(value) => setFormData({ ...formData, semester: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
          {Object.keys(groupedBySemester).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada mata kuliah yang diambil</p>
              <p className="text-sm">Klik tombol "Tambah Mata Kuliah" untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedBySemester)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([semester, courses]) => (
                  <div key={semester}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Semester {semester}
                      </h3>
                      <Badge variant="secondary">
                        Total: {totalSKSPerSemester(parseInt(semester))} SKS
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mata Kuliah</TableHead>
                            <TableHead>Dosen</TableHead>
                            <TableHead>Jadwal</TableHead>
                            <TableHead>Ruangan</TableHead>
                            <TableHead>SKS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.mata_kuliah}</TableCell>
                              <TableCell className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {course.dosen}
                              </TableCell>
                              <TableCell className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {course.hari}, {course.jam_mulai}-{course.jam_selesai}
                              </TableCell>
                              <TableCell>{course.ruangan}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{course.sks} SKS</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PengambilanMataKuliah;
