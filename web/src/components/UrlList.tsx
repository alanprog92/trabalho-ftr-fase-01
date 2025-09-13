import { useUrls, useDeleteUrl, useDownloadReport } from '../hooks/useUrls';
import type { UrlData } from '../types';
import { useState } from 'react';

const UrlItem = ({ url, onDelete }: { url: UrlData; onDelete: (id: string) => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar esta URL?')) {
      setIsDeleting(true);
      await onDelete(url.id);
      setIsDeleting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copiada para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar URL:', err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL Original</span>
            <p className="text-sm text-gray-900 truncate">{url.originalUrl}</p>
          </div>
          
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Código Encurtado</span>
            <div className="flex items-center gap-2">
              <p className="text-sm text-blue-600 truncate">{frontendUrl}/{url.shortCode}</p>
              <button
                onClick={() => copyToClipboard(`${frontendUrl}/${url.shortCode}`)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copiar URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Acessos: {url.accessCount}</span>
            <span>Criado em: {new Date(url.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`${frontendUrl}/${url.shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir
          </a>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm text-red-700 bg-white rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? (
              <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

export const UrlList = () => {
  const { data: urls = [], isLoading, error } = useUrls();
  const deleteUrlMutation = useDeleteUrl();
  const downloadReportMutation = useDownloadReport();

  const handleDelete = async (id: string) => {
    await deleteUrlMutation.mutateAsync(id);
  };

  const handleDownloadReport = async () => {
    try {
      await downloadReportMutation.mutateAsync();
    } catch (error) {
      alert('Erro ao baixar relatório. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Carregando URLs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.108 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar URLs</h3>
          <p className="mt-1 text-sm text-gray-500">Tente recarregar a página.</p>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma URL encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira URL encurtada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          URLs Cadastradas ({urls.length})
        </h2>
        
        <button
          onClick={handleDownloadReport}
          disabled={downloadReportMutation.isPending}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {downloadReportMutation.isPending ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          Baixar Relatório CSV
        </button>
      </div>

      <div className="space-y-4">
        {urls.map((url) => (
          <UrlItem key={url.id} url={url} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};
