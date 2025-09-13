import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUrlSchema, type CreateUrlFormData } from '../schemas';
import { useCreateUrl } from '../hooks/useUrls';
import { useState } from 'react';

export const UrlForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const createUrlMutation = useCreateUrl();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
  });

  const onSubmit = async (data: CreateUrlFormData) => {
    setIsSubmitting(true);
    setDuplicateError(null);
    setSuggestion(null);

    try {
      const result = await createUrlMutation.mutateAsync(data);
      
      if (result.success) {
        reset();
      } else {
        // Verificar se é um erro de código duplicado
        if (result.errorType === 'duplicate') {
          setDuplicateError(result.error || `O código "${data.shortCode}" já está em uso.`);
          
          if (result.suggestion) {
            setSuggestion(result.suggestion);
          }
        } else {
          setError('shortCode', {
            type: 'manual',
            message: result.error || 'Erro ao criar URL',
          });
        }
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

  const useSuggestion = () => {
    if (suggestion) {
      setValue('shortCode', suggestion);
      setDuplicateError(null);
      setSuggestion(null);
    }
  };

  return (
    <div className="card p-6 lg:p-8 animate-fadeIn transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Encurtar URL</h2>
      
      {duplicateError && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm0-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">{duplicateError}</p>
              
              {suggestion && (
                <div className="mt-2">
                  <p className="text-xs text-amber-600 mb-2">Sugestão de código alternativo:</p>
                  <div className="flex items-center">
                    <code className="px-2 py-1 bg-white border border-amber-200 rounded text-amber-700 text-sm mr-2">
                      {suggestion}
                    </code>
                    <button 
                      type="button" 
                      onClick={useSuggestion}
                      className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-1 px-2 rounded transition-colors"
                    >
                      Usar este código
                    </button>
                  </div>
                </div>
              )}
              
              {!suggestion && (
                <p className="mt-2 text-xs text-amber-600">Sugestão: Adicione números ou palavras extras para tornar seu código único.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="originalUrl" className="form-label">
            URL Original *
          </label>
          <input
            {...register('originalUrl')}
            type="url"
            id="originalUrl"
            placeholder="https://exemplo.com/url-muito-longa"
            className="input-field"
            disabled={isSubmitting}
            aria-invalid={errors.originalUrl ? "true" : "false"}
          />
          {errors.originalUrl && (
            <p className="error-text" role="alert">{errors.originalUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="shortCode" className="form-label">
            Código Encurtado *
            <span className="ml-1 text-xs font-normal text-gray-500">(6-10 caracteres, apenas letras e números)</span>
          </label>
          <div className="flex flex-wrap md:flex-nowrap">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
              {import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/
            </span>
            <input
              {...register('shortCode')}
              type="text"
              id="shortCode"
              placeholder="abc123"
              className={`flex-1 min-w-0 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${duplicateError ? 'border-amber-400 bg-amber-50' : 'border-gray-300'}`}
              disabled={isSubmitting}
              aria-invalid={errors.shortCode || duplicateError ? "true" : "false"}
            />
          </div>
          {errors.shortCode && !duplicateError && (
            <p className="error-text" role="alert">{errors.shortCode.message}</p>
          )}
        </div>

        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
            <p className="text-sm">{errors.root.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full md:w-auto md:px-8"
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
