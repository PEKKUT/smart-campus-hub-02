
export const calculateGrade = (nilaiAkhir: number): string => {
  if (nilaiAkhir >= 85) return 'A';
  if (nilaiAkhir >= 80) return 'A-';
  if (nilaiAkhir >= 75) return 'B+';
  if (nilaiAkhir >= 70) return 'B';
  if (nilaiAkhir >= 65) return 'B-';
  if (nilaiAkhir >= 60) return 'C+';
  if (nilaiAkhir >= 55) return 'C';
  if (nilaiAkhir >= 50) return 'C-';
  if (nilaiAkhir >= 45) return 'D+';
  if (nilaiAkhir >= 40) return 'D';
  return 'E';
};

export const calculateNilaiAkhir = (tugas: number, uts: number, uas: number): number => {
  // Bobot: Tugas 30%, UTS 30%, UAS 40%
  return Math.round((tugas * 0.3) + (uts * 0.3) + (uas * 0.4));
};

export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A':
    case 'A-':
      return 'bg-green-100 text-green-800';
    case 'B+':
    case 'B':
    case 'B-':
      return 'bg-blue-100 text-blue-800';
    case 'C+':
    case 'C':
    case 'C-':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-red-100 text-red-800';
  }
};
