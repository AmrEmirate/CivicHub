import { Announcement, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/lib/types/announcement';
import { mockAnnouncements } from '@/lib/mock-data/announcements';
import { PaginationParams } from '@/lib/types/common';

// This service layer is prepared for API integration
// Replace mock data calls with actual API calls when backend is ready

export const announcementService = {
  // Fetch all announcements
  async getAnnouncements(params: PaginationParams): Promise<any> {
    // TODO: Replace with API call
    const sorted = [...mockAnnouncements].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: sorted.slice(startIndex, endIndex),
      total: mockAnnouncements.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(mockAnnouncements.length / params.limit),
    };
  },

  // Fetch single announcement
  async getAnnouncement(id: string): Promise<Announcement | null> {
    // TODO: Replace with API call
    return mockAnnouncements.find(a => a.id === id) || null;
  },

  // Create new announcement
  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    // TODO: Replace with API call
    const newAnnouncement: Announcement = {
      id: String(mockAnnouncements.length + 1),
      ...input,
      isPinned: false,
      createdBy: 'Current User', // Get from auth context
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAnnouncements.push(newAnnouncement);
    return newAnnouncement;
  },

  // Update announcement
  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    // TODO: Replace with API call
    const announcement = mockAnnouncements.find(a => a.id === id);
    if (!announcement) throw new Error('Announcement not found');

    Object.assign(announcement, input, { updatedAt: new Date() });
    return announcement;
  },

  // Delete announcement
  async deleteAnnouncement(id: string): Promise<void> {
    // TODO: Replace with API call
    const index = mockAnnouncements.findIndex(a => a.id === id);
    if (index > -1) {
      mockAnnouncements.splice(index, 1);
    }
  },

  // Toggle pin status
  async togglePin(id: string): Promise<Announcement> {
    // TODO: Replace with API call
    const announcement = mockAnnouncements.find(a => a.id === id);
    if (!announcement) throw new Error('Announcement not found');

    announcement.isPinned = !announcement.isPinned;
    announcement.updatedAt = new Date();
    return announcement;
  },

  // Search announcements
  async searchAnnouncements(query: string, params: PaginationParams): Promise<any> {
    // TODO: Replace with API call
    const filtered = mockAnnouncements.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.content.toLowerCase().includes(query.toLowerCase()) ||
      a.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    const sorted = [...filtered].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: sorted.slice(startIndex, endIndex),
      total: filtered.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(filtered.length / params.limit),
    };
  },

  // Fetch pinned announcements
  async getPinnedAnnouncements(): Promise<Announcement[]> {
    // TODO: Replace with API call
    return mockAnnouncements.filter(a => a.isPinned);
  },
};
