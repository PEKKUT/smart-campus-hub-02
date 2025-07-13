
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { NilaiFormData, JadwalKuliah, Nilai } from './types';
import { calculateNilaiAkhir, calculateGrade } from './utils';

interface NilaiFormProps {
  editingNilai: Nilai | null;
  formData: NilaiFormData;
  setFormData: (data: NilaiFormData) => void;
  jadwalOptions: JadwalKuliah[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const NilaiForm = ({ 
  editingNilai, 
  formData, 
  setFormData, 
  jadwalOptions, 
  onSubmit, 
  onClose 
}: NilaiFormProps) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {editingNilai ? 'Edit Nilai' : 'Tambah Nilai Baru'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
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
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NilaiForm;
