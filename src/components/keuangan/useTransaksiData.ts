
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaksi {
  id: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

interface FormData {
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

export const useTransaksiData = (userId?: string) => {
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);

  const fetchTransaksi = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('transaksi')
        .select('*')
        .eq('user_id', userId)
        .order('tanggal', { ascending: false });

      if (error) throw error;
      
      // Type-safe mapping to ensure tipe is properly typed
      const typedTransaksi: Transaksi[] = (data || []).map(item => ({
        id: item.id,
        tanggal: item.tanggal,
        kategori: item.kategori,
        deskripsi: item.deskripsi,
        nominal: item.nominal,
        tipe: item.tipe as 'masuk' | 'keluar'
      }));
      
      setTransaksi(typedTransaksi);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data transaksi",
        variant: "destructive",
      });
    }
  };

  const saveTransaksi = async (formData: FormData, editingId?: string) => {
    if (!userId) return false;
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('transaksi')
          .update({ ...formData, user_id: userId })
          .eq('id', editingId);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('transaksi')
          .insert([{ ...formData, user_id: userId }]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil ditambahkan",
        });
      }

      fetchTransaksi();
      return true;
    } catch (error) {
      console.error('Error saving transaksi:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan transaksi",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTransaksi = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transaksi')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dihapus",
      });
      fetchTransaksi();
    } catch (error) {
      console.error('Error deleting transaksi:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus transaksi",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransaksi();
    }
  }, [userId]);

  return {
    transaksi,
    fetchTransaksi,
    saveTransaksi,
    deleteTransaksi
  };
};
