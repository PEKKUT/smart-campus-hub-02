
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type User = Tables<'users'>;

interface AuthContextType {
  user: User | null;
  login: (nama: string, nim: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (nama: string, nim: string) => {
    try {
      // First, try to find existing user
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('nim', nim)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        return { success: false, error: 'Terjadi kesalahan saat login' };
      }

      let userData: User;

      if (existingUser) {
        // User exists, check if nama matches
        if (existingUser.nama.toLowerCase() !== nama.toLowerCase()) {
          return { success: false, error: 'Nama tidak sesuai dengan NIM yang terdaftar' };
        }
        userData = existingUser;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({ nama, nim })
          .select()
          .single();

        if (createError) {
          return { success: false, error: 'Gagal membuat akun baru' };
        }
        userData = newUser;
      }

      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Terjadi kesalahan yang tidak terduga' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
