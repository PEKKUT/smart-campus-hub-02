
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Nilai, JadwalKuliah } from './types';

export const useNilaiData = (userId: string | undefined) => {
  const { toast } = useToast();
  const [nilai, setNilai] = useState<Nilai[]>([]);
  const [jadwalOptions, setJadwalOptions] = useState<JadwalKuliah[]>([]);

  const fetchNilai = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('nilai')
        .select(`
          *,
          jadwal_kuliah (mata_kuliah)
        `)
        .eq('user_id', userId)
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
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('jadwal_kuliah')
        .select('id, mata_kuliah')
        .eq('user_id', userId);

      if (error) throw error;
      setJadwalOptions(data || []);
    } catch (error) {
      console.error('Error fetching jadwal options:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNilai();
      fetchJadwalOptions();
    }
  }, [userId]);

  return {
    nilai,
    jadwalOptions,
    refreshNilai: fetchNilai
  };
};
