
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MahasiswaTab = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    prodi: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);

  const prodiOptions = [
    'Teknik Informatika',
    'Sistem Informasi',
    'Teknik Elektro',
    'Teknik Mesin',
    'Teknik Sipil',
    'Manajemen',
    'Akuntansi',
    'Ekonomi',
    'Hukum',
    'Psikologi'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        nim: user.nim || '',
        prodi: user.prodi || '',
        semester: user.semester?.toString() || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          prodi: formData.prodi,
          semester: parseInt(formData.semester) || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Data berhasil diperbarui!');
      
      // Update local storage
      const updatedUser = {
        ...user,
        prodi: formData.prodi,
        semester: parseInt(formData.semester) || null
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Informasi Mahasiswa</h1>
        <p className="text-gray-600">Kelola data pribadi Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Mahasiswa</CardTitle>
          <CardDescription>
            Nama dan NIM tidak dapat diubah. Anda dapat mengatur prodi dan semester.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  value={formData.nim}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prodi">Program Studi</Label>
              <Select 
                value={formData.prodi} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, prodi: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  {prodiOptions.map((prodi) => (
                    <SelectItem key={prodi} value={prodi}>
                      {prodi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select 
                value={formData.semester} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Semester" />
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

            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MahasiswaTab;
