import { PaginatedResponse } from './common';

export type OwnershipStatus = 'milik' | 'sewa';
export type MemberStatus = 'aktif' | 'nonaktif' | 'pindah';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // Suami, Istri, Anak, Lainnya
  age: number;
}

export interface Member {
  id: string;
  kkNumber: string; // No KK (Kartu Keluarga)
  familyHeadName: string; // Nama KK
  address: string; // Blok/Nama Jalan
  houseNumber: string; // No Rumah
  ownershipStatus: OwnershipStatus;
  totalFamilyMembers: number;
  members?: FamilyMember[];
  phoneNumber: string;
  status: MemberStatus;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembersStats {
  totalKK: number;
  totalWarga: number;
  hunianMilik: number;
  hunianSewa: number;
  aktif: number;
  nonaktif: number;
}

export interface CreateMemberInput {
  kkNumber: string;
  familyHeadName: string;
  address: string;
  houseNumber: string;
  ownershipStatus: OwnershipStatus;
  totalFamilyMembers: number;
  phoneNumber: string;
  email?: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  status?: MemberStatus;
}

export interface MembersResponse extends PaginatedResponse<Member> {}
