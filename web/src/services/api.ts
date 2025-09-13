import type { CreateUrlRequest, CreateUrlResponse, UrlData } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const urlService = {
  async createUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erro ao criar URL',
        };
      }

      const urlData = await response.json();
      return {
        success: true,
        data: urlData,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor',
      };
    }
  },

  async getAllUrls(): Promise<UrlData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls`);
      if (!response.ok) {
        throw new Error('Erro ao buscar URLs');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar URLs:', error);
      return [];
    }
  },

  async getUrlByShortCode(shortCode: string): Promise<UrlData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${shortCode}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar URL:', error);
      return null;
    }
  },

  async deleteUrl(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Erro ao deletar URL:', error);
      return false;
    }
  },

  async incrementAccess(shortCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${shortCode}/access`, {
        method: 'PATCH',
      });
      return response.ok;
    } catch (error) {
      console.error('Erro ao incrementar acesso:', error);
      return false;
    }
  },

  async downloadReport(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls/report/csv`);
      if (!response.ok) {
        throw new Error('Erro ao baixar relatório');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-urls.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      throw error;
    }
  },
};
