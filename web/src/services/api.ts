import type { CreateUrlRequest, CreateUrlResponse, UrlData } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';

// Função auxiliar para gerar sugestões de código
const generateSuggestion = (code: string): string => {
  // Garantir que o código base esteja dentro dos limites
  let baseCode = code.replace(/[^a-zA-Z0-9]/g, ''); // Remover caracteres não permitidos
  
  // Limitar o tamanho do código base para garantir espaço para números aleatórios
  if (baseCode.length > 7) {
    baseCode = baseCode.substring(0, 7);
  } else if (baseCode.length < 3) {
    // Se o código for muito curto, completar com letras aleatórias
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    while (baseCode.length < 3) {
      baseCode += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
  }
  
  // Adicionar números aleatórios ao final do código
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  const randomStr = randomNum.toString().padStart(3, '0');
  
  // Garantir que o resultado final tenha entre 6 e 10 caracteres
  const suggestion = `${baseCode}${randomStr}`;
  return suggestion.substring(0, 10);
};

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
        const errorMessage = errorData.message || 'Erro ao criar URL';
        
        // Verificar se é um erro de código duplicado
        if (
          errorMessage.toLowerCase().includes('já existe') || 
          errorMessage.toLowerCase().includes('already exists') || 
          errorMessage.toLowerCase().includes('duplicado') || 
          errorMessage.toLowerCase().includes('duplicate')
        ) {
          // Gerar uma sugestão para o código
          const suggestion = generateSuggestion(data.shortCode);
          
          return {
            success: false,
            error: `O código "${data.shortCode}" já está em uso.`,
            suggestion,
            errorType: 'duplicate'
          };
        }
        
        return {
          success: false,
          error: errorMessage,
          errorType: 'validation'
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
        errorType: 'server'
      };
    }
  },

  async getAllUrls(): Promise<UrlData[]> {
    try {
      console.log('Buscando todas as URLs');
      const response = await fetch(`${API_BASE_URL}/urls`);
      
      if (!response.ok) {
        console.error(`Erro ao buscar URLs. Status: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      // Verificar diferentes formatos de resposta da API
      if (Array.isArray(data)) {
        // Resposta diretamente como array
        console.log(`${data.length} URLs encontradas (formato array)`);
        return data;
      } else if (data && typeof data === 'object') {
        // Resposta como objeto
        console.log('Resposta da API é um objeto:', data);
        
        // Verificar se o objeto tem uma propriedade 'data' que é um array
        if (data.data && Array.isArray(data.data)) {
          console.log(`${data.data.length} URLs encontradas (no campo data)`);
          return data.data;
        }
        
        // Verificar se o objeto tem uma propriedade 'urls' que é um array
        if (data.urls && Array.isArray(data.urls)) {
          console.log(`${data.urls.length} URLs encontradas (no campo urls)`);
          return data.urls;
        }
        
        // Se não encontrar arrays conhecidos, converter as próprias chaves em um array como último recurso
        const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          const largestArray = possibleArrays.reduce((a, b) => a.length > b.length ? a : b, []);
          console.log(`${largestArray.length} URLs encontradas (em um campo array desconhecido)`);
          return largestArray;
        }
      }
      
      console.error('Não foi possível extrair URLs da resposta:', data);
      return [];
    } catch (error) {
      console.error('Erro ao buscar URLs:', error);
      return [];
    }
  },

  async getUrlByShortCode(shortCode: string): Promise<UrlData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${shortCode}`);
      
      if (!response.ok) {
        console.error(`Erro ao buscar URL com código ${shortCode}. Status: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      console.log('URL encontrada:', data);
      return data;
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
      console.log(`Incrementando acesso para shortCode: '${shortCode}'`);
      
      if (!shortCode || shortCode.trim() === '') {
        console.error('Erro: tentativa de incrementar acesso com shortCode vazio ou inválido');
        return false;
      }
      
      // Tentar diferentes formatos de URL:
      // 1. Versão com /access no final
      const url1 = `${API_BASE_URL}/urls/${shortCode}/access`;
      // 2. Versão sem /access no final (apenas o shortCode)
      const url2 = `${API_BASE_URL}/urls/${shortCode}`;
      // 3. Versão alternativa com /increment
      const url3 = `${API_BASE_URL}/urls/${shortCode}/increment`;
      
      // Primeira tentativa com a URL padrão
      let url = url1;
      console.log('Tentativa #1 - URL da requisição:', url);
      
      console.log('Timestamp da requisição:', new Date().toISOString());
      
      // Tentar primeiro com PATCH
      console.log('Tentando com método PATCH e corpo vazio...');
      let response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      // Informações detalhadas sobre a resposta para debug
      console.log('Resposta do servidor (tentativa #1):', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        ok: response.ok
      });
      
      // Se falhar a primeira tentativa, tenta com a URL alternativa
      if (!response.ok) {
        // Tentar segunda URL (sem /access)
        url = `${API_BASE_URL}/urls/${shortCode}`;
        console.log('Tentativa #2 - URL da requisição:', url);
        
        // Tentativa com método PUT
        console.log('Tentando com método PUT...');
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            incrementAccess: true 
          }),
        });
        
        console.log('Resposta do servidor (tentativa #2):', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()]),
          ok: response.ok
        });
        
        // Se ainda falhar, tenta uma terceira abordagem
        if (!response.ok) {
          // Tentar terceira URL (com /increment)
          url = `${API_BASE_URL}/urls/${shortCode}/increment`;
          console.log('Tentativa #3 - URL da requisição:', url);
          
          // Tentativa com método POST
          console.log('Tentando com método POST...');
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
          
          console.log('Resposta do servidor (tentativa #3):', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers.entries()]),
            ok: response.ok
          });
        }
      }
      
      if (!response.ok) {
        // Tentar ler o corpo do erro
        let errorBody = 'Não foi possível ler o corpo da resposta';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorJson = await response.json();
            errorBody = JSON.stringify(errorJson);
          } else {
            errorBody = await response.text();
          }
        } catch (e) {
          console.error('Erro ao ler corpo da resposta:', e);
        }
        
        console.error(`Erro ao incrementar acesso. Status: ${response.status}. Detalhes:`, errorBody);
        
        // Se for erro 404, o endpoint pode estar incorreto
        if (response.status === 404) {
          console.warn('Endpoint não encontrado. Verificar se a rota está correta no backend.');
        }
        
        return false;
      }
      
      // Verificar se há resposta JSON
      try {
        const result = await response.json();
        console.log('Acesso incrementado com sucesso. Resposta:', result);
        return true;
      } catch (e) {
        console.log('Acesso incrementado com sucesso, mas sem corpo JSON na resposta');
        return true;
      }
    } catch (error) {
      console.error('Erro ao incrementar acesso:', error);
      
      // Informações mais detalhadas sobre o erro
      if (error instanceof Error) {
        console.error('Detalhes do erro:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      return false;
    }
  },

  async downloadReport(): Promise<void> {
    try {
      console.log('Iniciando download do relatório CSV');
      
      // Usar método POST conforme esperado pelo backend
      const response = await fetch(`${API_BASE_URL}/urls/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Incluindo um corpo vazio para evitar o erro FST_ERR_CTP_EMPTY_JSON_BODY
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        throw new Error(`Erro ao solicitar relatório: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Resposta do download:', result);
      
      if (!result.success || !result.data || !result.data.downloadUrl) {
        throw new Error('URL de download não encontrada na resposta');
      }
      
      // Agora fazemos o download do arquivo a partir da URL fornecida
      console.log('Baixando arquivo de:', result.data.downloadUrl);
      const downloadResponse = await fetch(result.data.downloadUrl);
      
      if (!downloadResponse.ok) {
        throw new Error(`Erro ao baixar arquivo: ${downloadResponse.status}`);
      }
      
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-urls.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Download concluído com sucesso');
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      throw error;
    }
  },
};
