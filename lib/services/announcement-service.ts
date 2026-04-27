import { Announcement, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/lib/types/announcement';
import { PaginationParams } from '@/lib/types/common';
import { apiClient } from '@/lib/api/api-client';

/**
 * Map respons BE (Prisma Pengumuman) ke tipe Announcement FE.
 * BE fields: { id, title, content, type, targetRole, authorId, author, createdAt, updatedAt }
 * FE fields: { id, title, content, createdAt, updatedAt, createdBy, isPinned, tags }
 */
function mapPengumumanToAnnouncement(raw: any): Announcement {
  return {
    id: String(raw.id),
    title: raw.title || '',
    content: raw.content || '',
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
    createdBy: raw.author?.name || undefined,
    isPinned: raw.isPinned || false,   // BE belum punya field ini, default false
    tags: raw.tags || (raw.type && raw.type !== 'INFO' ? [raw.type] : []),
    imageUrl: raw.imageUrl || undefined,
  };
}

export const announcementService = {
  async getAnnouncements(params: PaginationParams & { search?: string }): Promise<any> {
    // BE belum support pagination/search di pengumuman, kirim saja tanpa params
    const rawData = await apiClient('/pengumuman');
    const dataArray = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
    const mapped = dataArray.map(mapPengumumanToAnnouncement);
    const total = mapped.length;

    return { 
      data: mapped, 
      total, 
      page: params.page, 
      limit: params.limit, 
      totalPages: Math.ceil(total / params.limit) || 1
    };
  },

  async getAnnouncement(id: string): Promise<Announcement | null> {
    try {
      const data = await apiClient(`/pengumuman/${id}`);
      return mapPengumumanToAnnouncement(data);
    } catch {
      return null;
    }
  },

  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const response = await apiClient('/pengumuman', {
      method: 'POST',
      data: {
        title: input.title,
        content: input.content,
        // BE hanya menerima: title, content, type, targetRole
        // Field 'tags' dan 'isPinned' tidak ada di schema Prisma
        type: 'INFO',
        targetRole: 'ALL',
      },
    });
    // BE returns { message, data: {...} }
    return mapPengumumanToAnnouncement(response.data || response);
  },

  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    const response = await apiClient(`/pengumuman/${id}`, {
      method: 'PUT',
      data: {
        title: input.title,
        content: input.content,
      },
    });
    // BE returns { message, data: {...} }
    return mapPengumumanToAnnouncement(response.data || response);
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await apiClient(`/pengumuman/${id}`, { method: 'DELETE' });
  },

  async searchAnnouncements(query: string, params: PaginationParams): Promise<any> {
     return this.getAnnouncements({ ...params, search: query });
  },

  /**
   * Ambil pengumuman terbaru untuk ditampilkan di dashboard.
   * Karena schema BE belum memiliki field `isPinned`, kita ambil 3 terbaru saja.
   */
  async getPinnedAnnouncements(): Promise<Announcement[]> {
    const res = await this.getAnnouncements({ page: 1, limit: 5 });
    return res.data.slice(0, 3);
  },

  // togglePin: karena BE tidak support field isPinned, update client-side saja
  // Jika BE ingin support ini, perlu tambah field isPinned ke schema Prisma
  async togglePin(id: string): Promise<Announcement> {
    // Untuk sementara, hanya fetch data terbaru (tidak ada endpoint togglePin di BE)
    const data = await apiClient(`/pengumuman/${id}`);
    return mapPengumumanToAnnouncement(data);
  },
};

