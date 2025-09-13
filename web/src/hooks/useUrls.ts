import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { urlService } from '../services/api';
import type { CreateUrlRequest } from '../types';

export const useUrls = () => {
  return useQuery({
    queryKey: ['urls'],
    queryFn: urlService.getAllUrls,
    staleTime: 1000 * 30, // Dados permanecem fresh por 30 segundos
    gcTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

export const useCreateUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUrlRequest) => urlService.createUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => urlService.deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useGetUrlByShortCode = (shortCode: string) => {
  return useQuery({
    queryKey: ['url', shortCode],
    queryFn: () => urlService.getUrlByShortCode(shortCode),
    enabled: !!shortCode,
    retry: 2,
    staleTime: 0, // Sempre buscar do servidor
    gcTime: 1000 * 60 * 5, // Cache por 5 minutos
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useIncrementAccess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shortCode: string) => {
      console.log(`[useIncrementAccess] Iniciando mutação para incrementar acesso: ${shortCode}`);
      
      if (!shortCode) {
        console.error('[useIncrementAccess] shortCode inválido:', shortCode);
        return false;
      }
      
      try {
        const result = await urlService.incrementAccess(shortCode);
        console.log(`[useIncrementAccess] Resultado da operação para ${shortCode}:`, result ? 'Sucesso' : 'Falha');
        return result;
      } catch (error) {
        console.error(`[useIncrementAccess] Erro ao incrementar acesso para ${shortCode}:`, error);
        throw error;
      }
    },
    onMutate: (shortCode) => {
      console.log(`[useIncrementAccess] Preparando mutação para ${shortCode}`);
    },
    onSuccess: (result, shortCode) => {
      console.log(`[useIncrementAccess] Sucesso na mutação para ${shortCode}. Invalidando queries...`);
      
      // Invalidar a consulta específica para esta URL
      queryClient.invalidateQueries({ queryKey: ['url', shortCode] });
      // Invalidar a lista de URLs para refletir a contagem atualizada
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      
      console.log(`[useIncrementAccess] Queries invalidadas para ${shortCode}`);
    },
    onError: (error, shortCode) => {
      console.error(`[useIncrementAccess] Erro na mutação para ${shortCode}:`, error);
    },
    retry: 2,
    retryDelay: 1000, // 1 segundo entre tentativas
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: urlService.downloadReport,
  });
};
