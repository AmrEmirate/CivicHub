'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types/common';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('civic_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('civic_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/login`, {
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

      const mappedUser: User = {
        id: String(backendUser.id),
        name: backendUser.nama || backendUser.email || backendUser.nomorKK,
        phone: backendUser.noTelp || backendUser.email || phone,
        email: backendUser.email || '',
        role: backendUser.role || backendUser.hakAkses || 'warga', // Adapts to multiple DB schemas
        createdAt: new Date(backendUser.createdAt || new Date()),
      };

      setUser(mappedUser);
      setIsAuthenticated(true);
      localStorage.setItem('civic_user', JSON.stringify(mappedUser));
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
