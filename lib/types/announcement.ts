import { PaginatedResponse } from './common';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  isPinned: boolean;
  tags?: string[];
  imageUrl?: string;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  tags?: string[];
  imageUrl?: string;
}

export interface UpdateAnnouncementInput extends Partial<CreateAnnouncementInput> {}

export interface AnnouncementsResponse extends PaginatedResponse<Announcement> {}
