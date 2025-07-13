
import React from 'react';
import { Edit, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Nilai } from './types';
import { getGradeColor } from './utils';

interface NilaiTableProps {
  nilai: Nilai[];
  onEdit: (nilaiItem: Nilai) => void;
}

const NilaiTable = ({ nilai, onEdit }: NilaiTableProps) => {
  if (nilai.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Belum ada data nilai</p>
        <p className="text-sm">Klik tombol "Tambah Nilai" untuk memulai</p>
      </div>
    );
  }

  return (
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
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NilaiTable;
