
import React, { useState, useEffect } from 'react';
import { Plus, Edit, BookOpen } from 'lucide-react';
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

interface Nilai {
  id: string;
  jadwal_id: string;
  tugas: number;
  uts: number;
  uas: number;
  nilai_akhir: number;
  grade: string;
  semester: number;
  mata_kuliah: string;
}

interface JadwalKuliah {
  id: string;
  mata_kuliah: string;
}

const NilaiKuliah = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nilai, setNilai] = useState<Nilai[]>([]);
  const [jadwalOptions, setJadwalOptions] = useState<JadwalKuliah[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNilai, setEditingNilai] = useState<Nilai | null>(null);
  const [formData, setFormData] = useState({
    jadwal_id: '',
    tugas: 0,
    uts: 0,
    uas: 0,
    semester: 1
  });

  useEffect(() => {
    if (user) {
      fetchNilai();
      fetchJadwalOptions();
    }
  }, [user]);

  const fetchNilai = async () => {
    try {
      const { data, error } = await supabase
        .from('nilai')
        .select(`
          *,
          jadwal_kuliah (mata_kuliah)
        `)
        .eq('user_id', user?.id)
        .order('semester', { ascending: true });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        mata_kuliah: item.jadwal_kuliah?.mata_kuliah || ''
      })) || [];
      
      setNilai(formattedData);
    } catch (error) {
      console.error('Error fetching nilai:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data nilai",
        variant: "destructive",
      });
    }
  };

  const fetchJadwalOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('jadwal_kuliah')
        .select('id, mata_kuliah')
        .eq('user_id', user?.id);

      if (error) throw error;
      setJadwalOptions(data || []);
    } catch (error) {
      console.error('Error fetching jadwal options:', error);
    }
  };

  const calculateGrade = (nilaiAkhir: number): string => {
    if (nilaiAkhir >= 85) return 'A';
    if (nilaiAkhir >= 80) return 'A-';
    if (nilaiAkhir >= 75) return 'B+';
    if (nilaiAkhir >= 70) return 'B';
    if (nilaiAkhir >= 65) return 'B-';
    if (nilaiAkhir >= 60) return 'C+';
    if (nilaiAkhir >= 55) return 'C';
    if (nilaiAkhir >= 50) return 'C-';
    if (nilaiAkhir >= 45) return 'D+';
    if (nilaiAkhir >= 40) return 'D';
    return 'E';
  };

  const calculateNilaiAkhir = (tugas: number, uts: number, uas: number): number => {
    // Bobot: Tugas 30%, UTS 30%, UAS 40%
    return Math.round((tugas * 0.3) + (uts * 0.3) + (uas * 0.4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nilaiAkhir = calculateNilaiAkhir(formData.tugas, formData.uts, formData.uas);
    const grade = calculateGrade(nilaiAkhir);
    
    try {
      const dataToSave = {
        ...formData,
        nilai_akhir: nilaiAkhir,
        grade,
        user_id: user?.id
      };

      if (editingNilai) {
        const { error } = await supabase
          .from('nilai')
          .update(dataToSave)
          .eq('id', editingNilai.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Nilai berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('nilai')
          .insert([dataToSave]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Nilai berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingNilai(null);
      resetForm();
      fetchNilai();
    } catch (error) {
      console.error('Error saving nilai:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan nilai",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (nilaiItem: Nilai) => {
    setEditingNilai(nilaiItem);
    setFormData({
      jadwal_id: nilaiItem.jadwal_id,
      tugas: nilaiItem.tugas,
      uts: nilaiItem.uts,
      uas: nilaiItem.uas,
      semester: nilaiItem.semester
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      jadwal_id: '',
      tugas: 0,
      uts: 0,
      uas: 0,
      semester: 1
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A-':
        return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
      case 'B-':
        return 'bg-blue-100 text-blue-800';
      case 'C+':
      case 'C':
      case 'C-':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Nilai Kuliah
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Nilai
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNilai ? 'Edit Nilai' : 'Tambah Nilai Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="jadwal_id">Mata Kuliah</Label>
                <Select
                  value={formData.jadwal_id}
                  onValueChange={(value) => setFormData({ ...formData, jadwal_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata kuliah" />
                  </SelectTrigger>
                  <SelectContent>
                    {jadwalOptions.map((jadwal) => (
                      <SelectItem key={jadwal.id} value={jadwal.id}>
                        {jadwal.mata_kuliah}
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
              <div>
                <Label htmlFor="tugas">Nilai Tugas (30%)</Label>
                <Input
                  id="tugas"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.tugas}
                  onChange={(e) => setFormData({ ...formData, tugas: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="uts">Nilai UTS (30%)</Label>
                <Input
                  id="uts"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.uts}
                  onChange={(e) => setFormData({ ...formData, uts: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="uas">Nilai UAS (40%)</Label>
                <Input
                  id="uas"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.uas}
                  onChange={(e) => setFormData({ ...formData, uas: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Preview Nilai Akhir:</p>
                <p className="text-lg font-bold">
                  {calculateNilaiAkhir(formData.tugas, formData.uts, formData.uas)} 
                  ({calculateGrade(calculateNilaiAkhir(formData.tugas, formData.uts, formData.uas))})
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingNilai ? 'Update' : 'Simpan'}
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
        {nilai.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data nilai</p>
            <p className="text-sm">Klik tombol "Tambah Nilai" untuk memulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Tugas</TableHead>
                  <TableHead>UTS</TableHead>
                  <TableHead>UAS</TableHead>
                  <TableHead>Nilai Akhir</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilai.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.mata_kuliah}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Semester {item.semester}</Badge>
                    </TableCell>
                    <TableCell>{item.tugas}</TableCell>
                    <TableCell>{item.uts}</TableCell>
                    <TableCell>{item.uas}</TableCell>
                    <TableCell className="font-bold">{item.nilai_akhir}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(item.grade)}>
                        {item.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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

export default NilaiKuliah;
