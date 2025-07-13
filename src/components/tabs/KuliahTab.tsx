
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { GraduationCap, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import JadwalKuliah from '../kuliah/JadwalKuliah';
import NilaiKuliah from '../kuliah/NilaiKuliah';
import SKSKuliah from '../kuliah/SKSKuliah';
import PengambilanMataKuliah from '../kuliah/PengambilanMataKuliah';
import KehadiranHarian from '../kuliah/KehadiranHarian';

const KuliahTab = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMataKuliah: 0,
    totalSKS: 0,
    rataRataNilai: 0,
    persentaseKehadiran: 0
  });
  const [chartData, setChartData] = useState({
    sksPerSemester: [],
    nilaiPerMataKuliah: [],
    kehadiranBulanan: []
  });

  useEffect(() => {
    if (user) {
      fetchKuliahStats();
    }
  }, [user]);

  const fetchKuliahStats = async () => {
    try {
      // Fetch jadwal kuliah
      const { data: jadwalData } = await supabase
        .from('jadwal_kuliah')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch nilai
      const { data: nilaiData } = await supabase
        .from('nilai')
        .select(`
          *,
          jadwal_kuliah (mata_kuliah, sks)
        `)
        .eq('user_id', user?.id);

      // Fetch kehadiran
      const { data: kehadiranData } = await supabase
        .from('kehadiran')
        .select(`
          *,
          jadwal_kuliah (mata_kuliah)
        `)
        .eq('user_id', user?.id);

      // Calculate stats
      const totalMataKuliah = jadwalData?.length || 0;
      const totalSKS = jadwalData?.reduce((sum, item) => sum + (item.sks || 0), 0) || 0;
      const rataRataNilai = nilaiData?.length > 0 
        ? nilaiData.reduce((sum, item) => sum + (item.nilai_akhir || 0), 0) / nilaiData.length 
        : 0;
      
      const totalKehadiran = kehadiranData?.length || 0;
      const hadirCount = kehadiranData?.filter(k => k.status === 'H').length || 0;
      const persentaseKehadiran = totalKehadiran > 0 ? (hadirCount / totalKehadiran) * 100 : 0;

      setStats({
        totalMataKuliah,
        totalSKS,
        rataRataNilai,
        persentaseKehadiran
      });

      // Prepare chart data
      const semesterMap = new Map();
      nilaiData?.forEach(item => {
        const semester = item.semester;
        const sks = item.jadwal_kuliah?.sks || 0;
        
        if (!semesterMap.has(semester)) {
          semesterMap.set(semester, 0);
        }
        semesterMap.set(semester, semesterMap.get(semester) + sks);
      });

      const sksPerSemester = Array.from(semesterMap.entries()).map(([semester, sks]) => ({
        semester: `Sem ${semester}`,
        sks
      })).sort((a, b) => parseInt(a.semester.split(' ')[1]) - parseInt(b.semester.split(' ')[1]));

      const nilaiPerMataKuliah = nilaiData?.slice(0, 5).map(item => ({
        mataKuliah: item.jadwal_kuliah?.mata_kuliah?.substring(0, 15) + '...' || 'Unknown',
        nilai: item.nilai_akhir || 0
      })) || [];

      // Kehadiran bulanan (mock data for demonstration)
      const kehadiranBulanan = [
        { bulan: 'Jan', persentase: Math.random() * 100 },
        { bulan: 'Feb', persentase: Math.random() * 100 },
        { bulan: 'Mar', persentase: Math.random() * 100 },
        { bulan: 'Apr', persentase: Math.random() * 100 },
        { bulan: 'Mei', persentase: Math.random() * 100 },
        { bulan: 'Jun', persentase: Math.random() * 100 }
      ];

      setChartData({
        sksPerSemester,
        nilaiPerMataKuliah,
        kehadiranBulanan
      });

    } catch (error) {
      console.error('Error fetching kuliah stats:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pengelola Kuliah</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Kelola jadwal, nilai, dan SKS mata kuliah Anda
          {user?.prodi && user?.semester && (
            <span className="ml-2 text-blue-600 font-medium">
              | {user.prodi} - Semester {user.semester}
            </span>
          )}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Mata Kuliah</CardTitle>
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalMataKuliah}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total SKS</CardTitle>
            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalSKS}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Rata-rata Nilai</CardTitle>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.rataRataNilai.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Kehadiran</CardTitle>
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.persentaseKehadiran.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {stats.totalMataKuliah > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">SKS per Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.sksPerSemester}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Nilai per Mata Kuliah</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData.nilaiPerMataKuliah}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="nilai"
                  >
                    {chartData.nilaiPerMataKuliah.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Tren Kehadiran Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData.kehadiranBulanan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="persentase" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="pengambilan" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 text-xs sm:text-sm">
          <TabsTrigger value="pengambilan" className="px-2 py-1 sm:px-3 sm:py-2">Pengambilan MK</TabsTrigger>
          <TabsTrigger value="jadwal" className="px-2 py-1 sm:px-3 sm:py-2">Jadwal</TabsTrigger>
          <TabsTrigger value="kehadiran" className="px-2 py-1 sm:px-3 sm:py-2">Kehadiran</TabsTrigger>
          <TabsTrigger value="sks" className="px-2 py-1 sm:px-3 sm:py-2">SKS</TabsTrigger>
          <TabsTrigger value="nilai" className="px-2 py-1 sm:px-3 sm:py-2">Nilai</TabsTrigger>
        </TabsList>

        <TabsContent value="pengambilan">
          <PengambilanMataKuliah />
        </TabsContent>

        <TabsContent value="jadwal">
          <JadwalKuliah />
        </TabsContent>

        <TabsContent value="kehadiran">
          <KehadiranHarian />
        </TabsContent>

        <TabsContent value="sks">
          <SKSKuliah />
        </TabsContent>

        <TabsContent value="nilai">
          <NilaiKuliah />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KuliahTab;
