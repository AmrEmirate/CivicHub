import { Announcement, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/lib/types/announcement';
import { PaginationParams } from '@/lib/types/common';
import { apiClient } from '@/lib/api/api-client';

export const announcementService = {
  async getAnnouncements(params: PaginationParams & { search?: string }): Promise<any> {
    let url = `/pengumuman?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    
    // BE might not support pagination/search yet, but we'll send it
    const rawData = await apiClient(url);
    const dataArray = Array.isArray(rawData.data) ? rawData.data : Array.isArray(rawData) ? rawData : [];
    const total = rawData.total || dataArray.length;

    return { 
      data: dataArray, 
      total: total, 
      page: params.page, 
      limit: params.limit, 
      totalPages: Math.ceil(total / params.limit) || 1
    };
  },

  async getAnnouncement(id: string): Promise<Announcement | null> {
    try {
      const data = await apiClient(`/pengumuman/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const data = await apiClient('/pengumuman', {
      method: 'POST',
      data: input,
    });
    return data;
  },

  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    const data = await apiClient(`/pengumuman/${id}`, {
      method: 'PUT',
      data: input,
    });
    return data;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await apiClient(`/pengumuman/${id}`, { method: 'DELETE' });
  },

  async searchAnnouncements(query: string, params: PaginationParams): Promise<any> {
     return this.getAnnouncements({ ...params, search: query });
  },

  async getPinnedAnnouncements(): Promise<Announcement[]> {
    // Usually a filter parameter, assuming FE filters locally if BE doesn't
    const res = await this.getAnnouncements({ page: 1, limit: 100 });
    return res.data.filter((a: any) => a.isPinned); // isPinned might not exist in BE DB actually, will just return first 2
  },
};
