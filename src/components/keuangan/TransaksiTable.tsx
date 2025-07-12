
import React from 'react';
import { Edit, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Transaksi {
  id: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

interface TransaksiTableProps {
  transaksi: Transaksi[];
  onEdit: (item: Transaksi) => void;
  onDelete: (id: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const TransaksiTable = ({ transaksi, onEdit, onDelete, formatCurrency }: TransaksiTableProps) => {
  if (transaksi.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Belum ada transaksi</p>
        <p className="text-sm">Klik tombol "Tambah Transaksi" untuk memulai</p>
      </div>
    );
  }

  return (
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
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
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
  );
};

export default TransaksiTable;
