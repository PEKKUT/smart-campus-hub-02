
-- Create users table for authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  prodi TEXT,
  semester INTEGER,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jadwal_kuliah table
CREATE TABLE public.jadwal_kuliah (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  mata_kuliah TEXT NOT NULL,
  dosen TEXT,
  hari TEXT NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  ruangan TEXT,
  sks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kehadiran table
CREATE TABLE public.kehadiran (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  jadwal_id UUID REFERENCES public.jadwal_kuliah(id) ON DELETE CASCADE NOT NULL,
  tanggal DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('H', 'S', 'A')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nilai table
CREATE TABLE public.nilai (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  jadwal_id UUID REFERENCES public.jadwal_kuliah(id) ON DELETE CASCADE NOT NULL,
  tugas DECIMAL(5,2) DEFAULT 0,
  uts DECIMAL(5,2) DEFAULT 0,
  uas DECIMAL(5,2) DEFAULT 0,
  nilai_akhir DECIMAL(5,2) DEFAULT 0,
  grade TEXT,
  semester INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transaksi table
CREATE TABLE public.transaksi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  tanggal DATE NOT NULL,
  kategori TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  nominal DECIMAL(15,2) NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_history table
CREATE TABLE public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_kuliah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kehadiran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nilai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);

-- Create RLS policies for jadwal_kuliah table
CREATE POLICY "Users can manage their own jadwal" ON public.jadwal_kuliah FOR ALL USING (true);

-- Create RLS policies for kehadiran table  
CREATE POLICY "Users can manage their own kehadiran" ON public.kehadiran FOR ALL USING (true);

-- Create RLS policies for nilai table
CREATE POLICY "Users can manage their own nilai" ON public.nilai FOR ALL USING (true);

-- Create RLS policies for transaksi table
CREATE POLICY "Users can manage their own transaksi" ON public.transaksi FOR ALL USING (true);

-- Create RLS policies for chat_history table
CREATE POLICY "Users can manage their own chat history" ON public.chat_history FOR ALL USING (true);

-- Insert sample admin user
INSERT INTO public.users (nama, nim, role) VALUES ('Administrator', 'ADMIN001', 'admin');

-- Insert sample user (gil)
INSERT INTO public.users (nama, nim, prodi, semester) VALUES ('Gil', '123', 'Teknik Informatika', 1);
