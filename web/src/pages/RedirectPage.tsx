import { useParams, Navigate } from 'react-router-dom';
import { useGetUrlByShortCode } from '../hooks/useUrls';
import { urlService } from '../services/api';
import { useEffect, useState } from 'react';

export const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [redirecting, setRedirecting] = useState(false);
  
  const { data: urlData, isLoading, error } = useGetUrlByShortCode(shortCode || '');

  useEffect(() => {
    if (urlData && !redirecting) {
      setRedirecting(true);
      
      // Incrementar contador de acessos
      urlService.incrementAccess(shortCode || '');
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        window.location.href = urlData.originalUrl;
      }, 1000);
    }
  }, [urlData, shortCode, redirecting]);

  if (!shortCode) {
    return <Navigate to="/404" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando URL...</h2>
          <p className="text-gray-600">Aguarde enquanto processamos seu link.</p>
        </div>
      </div>
    );
  }

  if (error || !urlData) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecionamento</h1>
            <p className="text-gray-600">Você será redirecionado em instantes...</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Destino:</p>
            <p className="text-blue-600 font-medium break-all">{urlData.originalUrl}</p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Redirecionando...</span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Se não for redirecionado automaticamente, 
              <a href={urlData.originalUrl} className="text-blue-500 hover:underline ml-1">
                clique aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
