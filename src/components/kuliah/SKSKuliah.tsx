
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SKSData {
  semester: number;
  total_sks: number;
  mata_kuliah: string[];
}

const SKSKuliah = () => {
  const { user } = useAuth();
  const [sksData, setSksData] = useState<SKSData[]>([]);
  const [totalSKS, setTotalSKS] = useState(0);

  useEffect(() => {
    if (user) {
      fetchSKSData();
    }
  }, [user]);

  const fetchSKSData = async () => {
    try {
      // Get SKS data from jadwal_kuliah table
      const { data: jadwalData, error } = await supabase
        .from('jadwal_kuliah')
        .select('mata_kuliah, sks')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Get nilai data to group by semester
      const { data: nilaiData, error: nilaiError } = await supabase
        .from('nilai')
        .select(`
          semester,
          jadwal_kuliah (mata_kuliah, sks)
        `)
        .eq('user_id', user?.id);

      if (nilaiError) throw nilaiError;

      // Process data to group by semester
      const semesterMap = new Map<number, { sks: number; mata_kuliah: Set<string> }>();

      nilaiData?.forEach(item => {
        const semester = item.semester;
        const mataKuliah = item.jadwal_kuliah?.mata_kuliah || '';
        const sks = item.jadwal_kuliah?.sks || 0;

        if (!semesterMap.has(semester)) {
          semesterMap.set(semester, { sks: 0, mata_kuliah: new Set() });
        }

        const current = semesterMap.get(semester)!;
        current.sks += sks;
        current.mata_kuliah.add(mataKuliah);
      });

      // Convert to array format for display
      const processedData = Array.from(semesterMap.entries()).map(([semester, data]) => ({
        semester,
        total_sks: data.sks,
        mata_kuliah: Array.from(data.mata_kuliah)
      })).sort((a, b) => a.semester - b.semester);

      setSksData(processedData);
      setTotalSKS(processedData.reduce((sum, item) => sum + item.total_sks, 0));
    } catch (error) {
      console.error('Error fetching SKS data:', error);
    }
  };

  const chartData = sksData.map(item => ({
    semester: `Sem ${item.semester}`,
    sks: item.total_sks
  }));

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Ringkasan SKS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalSKS}</div>
              <div className="text-sm text-gray-600">Total SKS</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sksData.length}</div>
              <div className="text-sm text-gray-600">Semester Aktif</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {sksData.reduce((sum, item) => sum + item.mata_kuliah.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Mata Kuliah</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      {sksData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribusi SKS per Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail per Semester */}
      <div className="grid gap-4">
        {sksData.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada data SKS</p>
              <p className="text-sm">Data SKS akan muncul setelah Anda menambahkan jadwal dan nilai</p>
            </CardContent>
          </Card>
        ) : (
          sksData.map((semester) => (
            <Card key={semester.semester}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Semester {semester.semester}</span>
                  <Badge variant="secondary">{semester.total_sks} SKS</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600">Mata Kuliah:</h4>
                  <div className="flex flex-wrap gap-2">
                    {semester.mata_kuliah.map((matkul, index) => (
                      <Badge key={index} variant="outline">
                        {matkul}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SKSKuliah;
