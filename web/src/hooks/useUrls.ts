import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { urlService } from '../services/api';
import type { CreateUrlRequest } from '../types';

export const useUrls = () => {
  return useQuery({
    queryKey: ['urls'],
    queryFn: urlService.getAllUrls,
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
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: urlService.downloadReport,
  });
};
