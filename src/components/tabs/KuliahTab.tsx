
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

      // Fetch nilai with related jadwal data
      const { data: nilaiData } = await supabase
        .from('nilai')
        .select(`
          *,
          jadwal_kuliah (mata_kuliah, sks)
        `)
        .eq('user_id', user?.id);

      // Fetch kehadiran with related jadwal data
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

      const kehadiranBulanan = [
        { bulan: 'Jan', persentase: 85 },
        { bulan: 'Feb', persentase: 92 },
        { bulan: 'Mar', persentase: 78 },
        { bulan: 'Apr', persentase: 95 },
        { bulan: 'Mei', persentase: 88 },
        { bulan: 'Jun', persentase: 90 }
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 relative">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Pengelola Kuliah
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 ml-13">
          Kelola jadwal, nilai, dan SKS mata kuliah Anda dengan mudah
          {user?.prodi && user?.semester && (
            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {user.prodi} - Semester {user.semester}
            </span>
          )}
        </p>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Total Mata Kuliah</CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalMataKuliah}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Mata kuliah aktif</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Total SKS</CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalSKS}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Sistem Kredit Semester</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Rata-rata Nilai</CardTitle>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.rataRataNilai.toFixed(1)}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Prestasi akademik</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Kehadiran</CardTitle>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.persentaseKehadiran.toFixed(1)}%</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Tingkat kehadiran</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts */}
      {stats.totalMataKuliah > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                SKS per Semester
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.sksPerSemester}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="sks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Distribusi Nilai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData.nilaiPerMataKuliah}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="nilai"
                  >
                    {chartData.nilaiPerMataKuliah.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Tren Kehadiran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData.kehadiranBulanan}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="persentase" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Tabs */}
      <Card className="bg-white shadow-lg border-0 relative z-10">
        <CardContent className="p-6">
          <Tabs defaultValue="pengambilan" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="pengambilan" 
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all cursor-pointer"
              >
                Pengambilan MK
              </TabsTrigger>
              <TabsTrigger 
                value="jadwal" 
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all cursor-pointer"
              >
                Jadwal
              </TabsTrigger>
              <TabsTrigger 
                value="kehadiran" 
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all cursor-pointer"
              >
                Kehadiran
              </TabsTrigger>
              <TabsTrigger 
                value="sks" 
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all cursor-pointer"
              >
                SKS
              </TabsTrigger>
              <TabsTrigger 
                value="nilai" 
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all cursor-pointer"
              >
                Nilai
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pengambilan" className="mt-6">
              <PengambilanMataKuliah />
            </TabsContent>

            <TabsContent value="jadwal" className="mt-6">
              <JadwalKuliah />
            </TabsContent>

            <TabsContent value="kehadiran" className="mt-6">
              <KehadiranHarian />
            </TabsContent>

            <TabsContent value="sks" className="mt-6">
              <SKSKuliah />
            </TabsContent>

            <TabsContent value="nilai" className="mt-6">
              <NilaiKuliah />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KuliahTab;
