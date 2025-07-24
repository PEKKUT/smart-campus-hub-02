
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  nama: string;
  nim: string;
  prodi?: string;
  semester?: number;
  role?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (nim: string, nama: string) => Promise<LoginResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
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
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Refresh user data from database
      refreshUserData(userData.id);
    }
    setLoading(false);
  }, []);

  const refreshUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const updatedUser = {
          id: data.id,
          nama: data.nama,
          nim: data.nim,
          prodi: data.prodi,
          semester: data.semester,
          role: data.role
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      await refreshUserData(user.id);
    }
  };

  const login = async (nim: string, nama: string): Promise<LoginResult> => {
    try {
      // Check if user exists by NIM first
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('nim', nim)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let userData;

      if (existingUser) {
        // User exists, check if nama matches or update it
        if (existingUser.nama !== nama) {
          // Update the nama for this NIM
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ nama })
            .eq('nim', nim)
            .select()
            .single();

          if (updateError) throw updateError;
          userData = updatedUser;
        } else {
          userData = existingUser;
        }
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              nim,
              nama,
              role: 'user'
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        userData = newUser;
      }

      const user = {
        id: userData.id,
        nama: userData.nama,
        nim: userData.nim,
        prodi: userData.prodi,
        semester: userData.semester,
        role: userData.role
      };

      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login gagal' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
