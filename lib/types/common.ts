// Role types
export type UserRole = 'rt' | 'wakil_rt' | 'sekretaris' | 'bendahara' | 'warga';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
