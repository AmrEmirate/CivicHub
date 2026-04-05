import { Announcement, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/lib/types/announcement';
import { PaginationParams } from '@/lib/types/common';

// Service stubbed since no BE endpoint exists yet
export const announcementService = {
  async getAnnouncements(params: PaginationParams): Promise<any> {
    return { data: [], total: 0, page: params.page, limit: params.limit, totalPages: 0 };
  },

  async getAnnouncement(id: string): Promise<Announcement | null> {
    return null;
  },

  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    throw new Error('Not implemented');
  },

  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    throw new Error('Not implemented');
  },

  async deleteAnnouncement(id: string): Promise<void> {
    throw new Error('Not implemented');
  },

  async togglePin(id: string): Promise<Announcement> {
    throw new Error('Not implemented');
  },

  async searchAnnouncements(query: string, params: PaginationParams): Promise<any> {
     return { data: [], total: 0, page: params.page, limit: params.limit, totalPages: 0 };
  },

  async getPinnedAnnouncements(): Promise<Announcement[]> {
    return [];
  },
};
