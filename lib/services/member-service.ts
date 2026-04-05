import { Member, CreateMemberInput, UpdateMemberInput, MembersResponse, MembersStats } from '@/lib/types/member';
import { mockMembers, mockMembersStats } from '@/lib/mock-data/members';
import { PaginationParams } from '@/lib/types/common';

// This service layer is prepared for API integration
// Replace mock data calls with actual API calls when backend is ready

export const memberService = {
  // Fetch all members with pagination
  async getMembers(params: PaginationParams): Promise<MembersResponse> {
    // TODO: Replace with API call
    // const response = await fetch(`/api/members?page=${params.page}&limit=${params.limit}...`);
    
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedData = mockMembers.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: mockMembers.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(mockMembers.length / params.limit),
    };
  },

  // Fetch single member
  async getMember(id: string): Promise<Member | null> {
    // TODO: Replace with API call
    // const response = await fetch(`/api/members/${id}`);
    
    return mockMembers.find(m => m.id === id) || null;
  },

  // Create new member
  async createMember(input: CreateMemberInput): Promise<Member> {
    // TODO: Replace with API call
    // const response = await fetch('/api/members', {
    //   method: 'POST',
    //   body: JSON.stringify(input),
    // });
    
    const newMember: Member = {
      id: String(mockMembers.length + 1),
      ...input,
      status: 'aktif',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockMembers.push(newMember);
    return newMember;
  },

  // Update member
  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    // TODO: Replace with API call
    // const response = await fetch(`/api/members/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(input),
    // });
    
    const member = mockMembers.find(m => m.id === id);
    if (!member) throw new Error('Member not found');

    Object.assign(member, input, { updatedAt: new Date() });
    return member;
  },

  // Delete member
  async deleteMember(id: string): Promise<void> {
    // TODO: Replace with API call
    // await fetch(`/api/members/${id}`, { method: 'DELETE' });
    
    const index = mockMembers.findIndex(m => m.id === id);
    if (index > -1) {
      mockMembers.splice(index, 1);
    }
  },

  // Fetch members statistics
  async getMembersStats(): Promise<MembersStats> {
    // TODO: Replace with API call
    // const response = await fetch('/api/members/stats');
    
    return mockMembersStats;
  },

  // Search members
  async searchMembers(query: string, params: PaginationParams): Promise<MembersResponse> {
    // TODO: Replace with API call
    // const response = await fetch(`/api/members/search?q=${query}&...`);
    
    const filtered = mockMembers.filter(m =>
      m.familyHeadName.toLowerCase().includes(query.toLowerCase()) ||
      m.phoneNumber.includes(query) ||
      m.address.toLowerCase().includes(query.toLowerCase())
    );

    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;

    return {
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(filtered.length / params.limit),
    };
  },
};
