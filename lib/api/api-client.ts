export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiClient(endpoint: string, options: RequestOptions = {}) {
  const { data, headers: customHeaders, ...customOptions } = options;

  let token = null;
  if (typeof window !== 'undefined') {
    // Membaca token autentikasi kalau ada
    token = localStorage.getItem('token');
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
    ...customOptions,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Lemparkan error agar bisa di-catch oleh caller
    throw new Error(responseData.error || responseData.message || 'An error occurred');
  }

  return responseData;
}
