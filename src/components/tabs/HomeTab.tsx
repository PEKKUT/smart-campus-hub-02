
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { GraduationCap, TrendingUp, Calendar, BookOpen } from 'lucide-react';

const HomeTab = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSKS: 0,
    ipk: 0,
    kehadiran: 0,
    mataKuliah: 0
  });
  const [chartData, setChartData] = useState({
    sksPerSemester: [],
    ipkTrend: [],
    kehadiranData: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch jadwal kuliah
      const { data: jadwalData } = await supabase
        .from('jadwal_kuliah')
        .select('*')
        .eq('user_id', user.id);

      // Fetch nilai
      const { data: nilaiData } = await supabase
        .from('nilai')
        .select('*')
        .eq('user_id', user.id);

      // Fetch kehadiran
      const { data: kehadiranData } = await supabase
        .from('kehadiran')
        .select('*')
        .eq('user_id', user.id);

      // Calculate stats
      const totalSKS = jadwalData?.reduce((sum, item) => sum + (item.sks || 0), 0) || 0;
      const avgNilai = nilaiData?.length > 0 
        ? nilaiData.reduce((sum, item) => sum + (item.nilai_akhir || 0), 0) / nilaiData.length 
        : 0;
      
      const totalKehadiran = kehadiranData?.length || 0;
      const hadirCount = kehadiranData?.filter(k => k.status === 'H').length || 0;
      const persentaseKehadiran = totalKehadiran > 0 ? (hadirCount / totalKehadiran) * 100 : 0;

      setStats({
        totalSKS,
        ipk: avgNilai,
        kehadiran: persentaseKehadiran,
        mataKuliah: jadwalData?.length || 0
      });

      // Prepare chart data
      const sksPerSemester = [
        { semester: 1, sks: totalSKS }
      ];

      const ipkTrend = [
        { semester: 1, ipk: avgNilai }
      ];

      const kehadiranChart = jadwalData?.map(jadwal => ({
        mataKuliah: jadwal.mata_kuliah,
        persentase: Math.random() * 100 // Placeholder
      })) || [];

      setChartData({
        sksPerSemester,
        ipkTrend,
        kehadiranData: kehadiranChart
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Selamat datang, {user?.nama}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
            <CardTitle className="text-xs sm:text-sm font-medium">IPK</CardTitle>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.ipk.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Kehadiran</CardTitle>
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.kehadiran.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Mata Kuliah</CardTitle>
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.mataKuliah}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Distribusi SKS per Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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
            <CardTitle className="text-sm sm:text-base">Tren IPK per Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.ipkTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Line type="monotone" dataKey="ipk" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {stats.totalSKS === 0 && (
        <Card>
          <CardContent className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-gray-500">
              Belum ada data. Mulai dengan menambahkan mata kuliah di menu Pengelola Kuliah.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeTab;
