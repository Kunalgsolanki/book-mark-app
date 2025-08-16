export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  site: string;
}

export interface CreateLinkRequest {
  url: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
}

export interface Link {
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

export interface PaginatedLinksResponse {
  items: Link[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuthUser {
  id: string;
  email: string;
  aud: string;
  role: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
