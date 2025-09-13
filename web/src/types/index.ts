export interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  shortCode: string;
}

export interface CreateUrlResponse {
  success: boolean;
  data?: UrlData;
  error?: string;
  suggestion?: string;
  errorType?: 'duplicate' | 'validation' | 'server';
}
