
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TransaksiStats {
  periode: string;
  masuk: number;
  keluar: number;
  saldo: number;
}

interface KategoriStats {
  kategori: string;
  total: number;
  tipe: string;
}

const StatistikKeuangan = () => {
  const { user } = useAuth();
  const [transaksiStats, setTransaksiStats] = useState<TransaksiStats[]>([]);
  const [kategoriStats, setKategoriStats] = useState<KategoriStats[]>([]);
  const [viewType, setViewType] = useState<'bulanan' | 'mingguan'>('bulanan');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user) {
      fetchStatistikData();
    }
  }, [user, viewType, selectedYear]);

  const fetchStatistikData = async () => {
    try {
      const { data: transaksiData, error } = await supabase
        .from('transaksi')
        .select('*')
        .eq('user_id', user?.id)
        .gte('tanggal', `${selectedYear}-01-01`)
        .lte('tanggal', `${selectedYear}-12-31`)
        .order('tanggal', { ascending: true });

      if (error) throw error;

      // Process data for charts
      processTransaksiData(transaksiData || []);
      processKategoriData(transaksiData || []);
    } catch (error) {
      console.error('Error fetching statistik data:', error);
    }
  };

  const processTransaksiData = (data: any[]) => {
    const stats = new Map<string, { masuk: number; keluar: number }>();

    data.forEach(transaksi => {
      const date = new Date(transaksi.tanggal);
      let periode: string;

      if (viewType === 'bulanan') {
        periode = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        const weekNumber = getWeekNumber(date);
        periode = `Week ${weekNumber}`;
      }

      if (!stats.has(periode)) {
        stats.set(periode, { masuk: 0, keluar: 0 });
      }

      const current = stats.get(periode)!;
      if (transaksi.tipe === 'masuk') {
        current.masuk += transaksi.nominal;
      } else {
        current.keluar += transaksi.nominal;
      }
    });

    const processedStats = Array.from(stats.entries()).map(([periode, data]) => ({
      periode,
      masuk: data.masuk,
      keluar: data.keluar,
      saldo: data.masuk - data.keluar
    })).sort((a, b) => a.periode.localeCompare(b.periode));

    setTransaksiStats(processedStats);
  };

  const processKategoriData = (data: any[]) => {
    const kategoriMap = new Map<string, { total: number; tipe: string }>();

    data.forEach(transaksi => {
      const key = `${transaksi.kategori}-${transaksi.tipe}`;
      if (!kategoriMap.has(key)) {
        kategoriMap.set(key, { total: 0, tipe: transaksi.tipe });
      }
      kategoriMap.get(key)!.total += transaksi.nominal;
    });

    const processedKategori = Array.from(kategoriMap.entries()).map(([key, data]) => ({
      kategori: key.split('-')[0],
      total: data.total,
      tipe: data.tipe
    })).sort((a, b) => b.total - a.total);

    setKategoriStats(processedKategori);
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPeriode = (periode: string) => {
    if (viewType === 'bulanan') {
      const [year, month] = periode.split('-');
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return periode;
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const totalMasuk = transaksiStats.reduce((sum, item) => sum + item.masuk, 0);
  const totalKeluar = transaksiStats.reduce((sum, item) => sum + item.keluar, 0);
  const totalSaldo = totalMasuk - totalKeluar;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 items-center">
        <Select
          value={viewType}
          onValueChange={(value: 'bulanan' | 'mingguan') => setViewType(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bulanan">Bulanan</SelectItem>
            <SelectItem value="mingguan">Mingguan</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pemasukan {selectedYear}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalMasuk)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengeluaran {selectedYear}</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalKeluar)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Bersih {selectedYear}</p>
                <p className={`text-2xl font-bold ${totalSaldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(totalSaldo)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {transaksiStats.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data transaksi untuk ditampilkan</p>
            <p className="text-sm">Tambahkan transaksi untuk melihat statistik</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Bar Chart - Income vs Expense */}
          <Card>
            <CardHeader>
              <CardTitle>Pemasukan vs Pengeluaran {viewType === 'bulanan' ? 'Bulanan' : 'Mingguan'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transaksiStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periode" tickFormatter={formatPeriode} />
                    <YAxis tickFormatter={(value) => `${(value / 1000)}K`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="masuk" fill="#10b981" name="Pemasukan" />
                    <Bar dataKey="keluar" fill="#ef4444" name="Pengeluaran" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart - Saldo Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Saldo {viewType === 'bulanan' ? 'Bulanan' : 'Mingguan'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transaksiStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periode" tickFormatter={formatPeriode} />
                    <YAxis tickFormatter={(value) => `${(value / 1000)}K`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={3} name="Saldo" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Category Distribution */}
          {kategoriStats.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Pengeluaran per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={kategoriStats.filter(item => item.tipe === 'keluar')}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="total"
                          nameKey="kategori"
                        >
                          {kategoriStats.filter(item => item.tipe === 'keluar').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {kategoriStats.filter(item => item.tipe === 'keluar').map((item, index) => (
                      <div key={item.kategori} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.kategori}</span>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Pemasukan per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={kategoriStats.filter(item => item.tipe === 'masuk')}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="total"
                          nameKey="kategori"
                        >
                          {kategoriStats.filter(item => item.tipe === 'masuk').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {kategoriStats.filter(item => item.tipe === 'masuk').map((item, index) => (
                      <div key={item.kategori} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.kategori}</span>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatistikKeuangan;
