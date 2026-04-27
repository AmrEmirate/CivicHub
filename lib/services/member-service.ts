import { Member, CreateMemberInput, UpdateMemberInput, MembersResponse, MembersStats } from '@/lib/types/member';
import { PaginationParams } from '@/lib/types/common';
import { apiClient } from '@/lib/api/api-client';

const transformMember = (data: any): Member => ({
  id: String(data.id),
  familyHeadName: data.kepalaKeluarga || data.user?.name || '',
  phoneNumber: data.noTelepon || data.user?.noTelepon || '',
  email: data.user?.email || data.email || undefined,
  kkNumber: data.noKK || '',
  address: data.noRumah || '',      // BE tidak punya alamat terpisah
  houseNumber: data.noRumah || '',
  totalFamilyMembers: data.jumlahAnggota || 0,
  ownershipStatus: data.statusRumah === 'MILIK_SENDIRI' ? 'milik' : 'sewa',
  status: 'aktif',                  // BE belum punya field status warga
  createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
  updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
});

export const memberService = {
  // Fetch all members with pagination
  async getMembers(params: PaginationParams & { search?: string, status?: string }): Promise<MembersResponse> {
    let url = `/warga?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.status && params.status !== 'semua') url += `&status=${encodeURIComponent(params.status)}`;
    
    const response = await apiClient(url);
    
    return {
      data: (response.data || []).map(transformMember),
      total: response.total || 0,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil((response.total || 0) / params.limit),
    };
  },

  // Fetch single member
  async getMember(id: string): Promise<Member | null> {
    try {
      const data = await apiClient(`/warga/${id}`);
      return transformMember(data);
    } catch {
      return null;
    }
  },

  // Create new member
  async createMember(input: CreateMemberInput): Promise<Member> {
    const defaultPassword = `Warga${input.phoneNumber.slice(-4)}2024`; // min 8 chars password
    const response = await apiClient('/warga', {
      data: {
        password: defaultPassword,
        name: input.familyHeadName,
        kepalaKeluarga: input.familyHeadName,
        noTelepon: input.phoneNumber,
        email: input.email || undefined,
        noKK: input.kkNumber,
        noRumah: input.houseNumber,
        jumlahAnggota: input.totalFamilyMembers,
        statusRumah: input.ownershipStatus === 'milik' ? 'MILIK_SENDIRI' : 'SEWA',
      },
    });
    // BE returns { message, user: { id, name, ..., warga: {...} } }
    const raw = response.user?.warga || response.user || response;
    // Merge user name into warga for transformer
    if (response.user && !raw.kepalaKeluarga) raw.kepalaKeluarga = response.user.name;
    if (response.user && !raw.user) raw.user = response.user;
    return transformMember(raw);
  },

  // Update member
  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    const response = await apiClient(`/warga/${id}`, {
      method: 'PUT',
      data: {
        kepalaKeluarga: input.familyHeadName,
        noTelepon: input.phoneNumber,
        noKK: input.kkNumber,
        noRumah: input.houseNumber,
        jumlahAnggota: input.totalFamilyMembers,
        statusRumah: input.ownershipStatus === 'milik' ? 'MILIK_SENDIRI' : 'SEWA',
      },
    });
    // BE returns { message, warga: {...} }
    const raw = response.warga || response;
    return transformMember(raw);
  },

  // Delete member (Opsional, backend mungkin belum implementasi delete)
  async deleteMember(id: string): Promise<void> {
    await apiClient(`/warga/${id}`, { method: 'DELETE' });
  },

  // Fetch members statistics
  async getMembersStats(): Promise<MembersStats> {
    const data = await apiClient('/warga/stats');
    return data;
  },

  // Search members
  async searchMembers(query: string, params: PaginationParams): Promise<MembersResponse> {
    return this.getMembers({ ...params, search: query });
  },
};
