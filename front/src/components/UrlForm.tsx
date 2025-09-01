import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUrlSchema, type CreateUrlFormData } from '../schemas';
import { useCreateUrl } from '../hooks/useUrls';
import { useState } from 'react';

export const UrlForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createUrlMutation = useCreateUrl();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
  });

  const onSubmit = async (data: CreateUrlFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createUrlMutation.mutateAsync(data);
      
      if (result.success) {
        reset();
      } else {
        setError('shortCode', {
          type: 'manual',
          message: result.error || 'Erro ao criar URL',
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Erro inesperado. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Encurtar URL</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL Original *
          </label>
          <input
            {...register('originalUrl')}
            type="url"
            id="originalUrl"
            placeholder="https://exemplo.com/url-muito-longa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700 mb-2">
            Código Encurtado *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
              {import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/
            </span>
            <input
              {...register('shortCode')}
              type="text"
              id="shortCode"
              placeholder="meu-codigo"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          {errors.shortCode && (
            <p className="mt-1 text-sm text-red-600">{errors.shortCode.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-600">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando...
            </span>
          ) : (
            'Encurtar URL'
          )}
        </button>
      </form>
    </div>
  );
};
