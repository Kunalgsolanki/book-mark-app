import { supabase } from './supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  site: string;
}

interface CreateLinkRequest {
  url: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
}

interface Link {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface PaginatedLinksResponse {
  items: Link[];
  total: number;
  page: number;
  pageSize: number;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Preview a URL
  async previewUrl(url: string): Promise<LinkPreview> {
    return apiRequest<LinkPreview>('/api/links/preview', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  // Create a link
  async createLink(linkData: CreateLinkRequest): Promise<Link> {
    return apiRequest<Link>('/api/links', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  },

  // Get links with pagination and filters
  async getLinks(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    tag?: string;
  } = {}): Promise<PaginatedLinksResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.tag) searchParams.append('tag', params.tag);

    return apiRequest<PaginatedLinksResponse>(`/api/links?${searchParams.toString()}`);
  },

  // Delete a link
  async deleteLink(id: string): Promise<void> {
    return apiRequest<void>(`/api/links/${id}`, {
      method: 'DELETE',
    });
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    return apiRequest<{ status: string; timestamp: string; uptime: number }>('/api/healthz');
  },
};
