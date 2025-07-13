
export interface Nilai {
  id: string;
  jadwal_id: string;
  tugas: number;
  uts: number;
  uas: number;
  nilai_akhir: number;
  grade: string;
  semester: number;
  mata_kuliah: string;
}

export interface JadwalKuliah {
  id: string;
  mata_kuliah: string;
}

export interface NilaiFormData {
  jadwal_id: string;
  tugas: number;
  uts: number;
  uas: number;
  semester: number;
}
