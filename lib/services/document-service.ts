import { apiClient } from '@/lib/api/api-client';

export interface Document {
  id: number;
  title: string;
  fileUrl: string;
  type: string;
  size?: string;
  author: { name: string };
  createdAt: string;
}

export const documentService = {
  async getAll(type?: string): Promise<Document[]> {
    const url = type ? `/dokumen?type=${type}` : '/dokumen';
    return apiClient(url);
  },

  async upload(data: { title: string; fileUrl: string; type: string; size?: string }): Promise<Document> {
    return apiClient('/dokumen', {
      method: 'POST',
      data
    });
  },

  async delete(id: number): Promise<void> {
    return apiClient(`/dokumen/${id}`, {
      method: 'DELETE'
    });
  }
};
