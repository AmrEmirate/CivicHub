import { PaginatedResponse } from './common';

export type DocumentType = 'lpj' | 'tunggakan' | 'surat_keterangan' | 'lainnya';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  description?: string;
  fileUrl?: string;
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
}

export interface Report {
  id: string;
  title: string;
  reportType: DocumentType;
  period: string; // e.g., "2024-01" for January 2024
  content?: string;
  fileUrl?: string;
  generatedAt: Date;
  generatedBy?: string;
}

export interface DocumentsResponse extends PaginatedResponse<Document> {}
export interface ReportsResponse extends PaginatedResponse<Report> {}
