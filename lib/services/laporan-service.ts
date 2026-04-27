import { apiClient } from '@/lib/api/api-client';

export interface Laporan {
  id: number;
  title: string;
  description?: string;
  fileUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REVISI';
  pembuatId: number;
  pembuat: {
    id: number;
    name: string;
  };
  penyetujuId?: number;
  penyetuju?: {
    id: number;
    name: string;
  };
  bulan: number;
  tahun: number;
  createdAt: string;
  updatedAt: string;
}

export const laporanService = {
  async getAll(): Promise<Laporan[]> {
    try {
      const data = await apiClient('/laporan');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async create(data: { title: string; fileUrl?: string; bulan: number; tahun: number }): Promise<any> {
    return apiClient('/laporan', {
      method: 'POST',
      data
    });
  },

  async approve(id: number, status: 'APPROVED' | 'REVISI', komentar?: string): Promise<any> {
    return apiClient(`/laporan/${id}/approve`, {
      method: 'PUT',
      data: { status, komentar }
    });
  },

  async delete(id: number): Promise<any> {
    return apiClient(`/laporan/${id}`, {
      method: 'DELETE'
    });
  }
};
