'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '@/lib/types/common';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('civic_user');
    const savedToken = localStorage.getItem('token');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Map backend roles if they were saved directly
        const roleMap: Record<string, any> = {
          'SUPER_ADMIN': 'rt',
          'ADMIN_ADMINISTRASI': 'sekretaris',
          'ADMIN_KEUANGAN': 'bendahara',
          'WARGA': 'warga'
        };
        if (roleMap[parsedUser.role]) {
           parsedUser.role = roleMap[parsedUser.role];
        }

        setUser(parsedUser);
        setIsAuthenticated(true);

        // Restore cookies agar middleware tetap bekerja setelah page refresh
        if (savedToken) {
          const maxAge = 60 * 60 * 24;
          document.cookie = `civichub_token=${savedToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
          document.cookie = `civichub_role=${parsedUser.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('civic_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Akun dengan nomor telepon tersebut tidak ditemukan' };
      }

      const { user: backendUser, token } = data;
      
      // Save token for apiClient
      localStorage.setItem('token', token);

      const roleMap: Record<string, UserRole> = {
        'SUPER_ADMIN': 'rt',
        'ADMIN_ADMINISTRASI': 'sekretaris',
        'ADMIN_KEUANGAN': 'bendahara',
        'WARGA': 'warga'
      };

      const mappedUser: User = {
        id: String(backendUser.id),
        name: backendUser.name || backendUser.nama || backendUser.email || backendUser.nomorKK,
        phone: backendUser.noTelepon || backendUser.noTelp || backendUser.email || phone,
        email: backendUser.email || '',
        role: roleMap[backendUser.role] || backendUser.role || backendUser.hakAkses || 'warga',
        createdAt: new Date(backendUser.createdAt || new Date()),
      };

      setUser(mappedUser);
      setIsAuthenticated(true);
      localStorage.setItem('civic_user', JSON.stringify(mappedUser));

      // Set cookies for Next.js middleware (edge runtime tidak bisa baca localStorage)
      const maxAge = 60 * 60 * 24; // 24 jam
      document.cookie = `civichub_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `civichub_role=${mappedUser.role}; path=/; max-age=${maxAge}; SameSite=Lax`;

      return { success: true };
    } catch (err: any) {
      console.error("Login Error:", err);
      return { success: false, error: 'Gagal terhubung ke server' };
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('civic_user');
    localStorage.removeItem('token');

    // Hapus cookies agar middleware tahu user sudah logout
    document.cookie = 'civichub_token=; path=/; max-age=0';
    document.cookie = 'civichub_role=; path=/; max-age=0';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
