
import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateNilaiAkhir, calculateGrade } from './nilai/utils';
import { NilaiFormData, Nilai } from './nilai/types';
import { useNilaiData } from './nilai/useNilaiData';
import NilaiForm from './nilai/NilaiForm';
import NilaiTable from './nilai/NilaiTable';

const NilaiKuliah = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { nilai, jadwalOptions, refreshNilai } = useNilaiData(user?.id);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNilai, setEditingNilai] = useState<Nilai | null>(null);
  const [formData, setFormData] = useState<NilaiFormData>({
    jadwal_id: '',
    tugas: 0,
    uts: 0,
    uas: 0,
    semester: 1
  });

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

      handleCloseDialog();
      refreshNilai();
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNilai(null);
    setFormData({
      jadwal_id: '',
      tugas: 0,
      uts: 0,
      uas: 0,
      semester: 1
    });
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
          <NilaiForm
            editingNilai={editingNilai}
            formData={formData}
            setFormData={setFormData}
            jadwalOptions={jadwalOptions}
            onSubmit={handleSubmit}
            onClose={handleCloseDialog}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        <NilaiTable nilai={nilai} onEdit={handleEdit} />
      </CardContent>
    </Card>
  );
};

export default NilaiKuliah;
