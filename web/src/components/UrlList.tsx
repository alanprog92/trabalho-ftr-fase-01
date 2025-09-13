import { useUrls, useDeleteUrl, useDownloadReport } from '../hooks/useUrls';
import type { UrlData } from '../types';
import { useState } from 'react';

const UrlItem = ({ url, onDelete }: { url: UrlData; onDelete: (id: string) => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
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
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar URL:', err);
    }
  };

  return (
    <div className="card p-4 lg:p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-100 border border-transparent">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL Original</span>
            <p className="text-sm text-gray-900 truncate" title={url.originalUrl}>{url.originalUrl}</p>
          </div>
          
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Código Encurtado</span>
            <div className="flex items-center gap-2">
              <p className="text-sm text-blue-600 truncate font-medium" title={`${frontendUrl}/${url.shortCode}`}>
                {frontendUrl}/{url.shortCode}
              </p>
              <button
                onClick={() => copyToClipboard(`${frontendUrl}/${url.shortCode}`)}
                className={`text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1 rounded-full ${isCopied ? 'text-green-500' : ''}`}
                title={isCopied ? "Copiado!" : "Copiar URL"}
                aria-label="Copiar URL"
              >
                {isCopied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">{url.accessCount} {url.accessCount === 1 ? 'acesso' : 'acessos'}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(url.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2 lg:mt-0">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center text-sm py-1.5 px-3"
            aria-label="Abrir URL original"
            title="Abrir URL original"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir
          </a>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-danger inline-flex items-center text-sm py-1.5 px-3"
            aria-label="Deletar URL"
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
  const { data, isLoading, error } = useUrls();
  const deleteUrlMutation = useDeleteUrl();
  const downloadReportMutation = useDownloadReport();

  // Log para depuração
  console.log('Dados recebidos na UrlList:', data);

  // Garantir que urls seja sempre um array
  const urls = Array.isArray(data) ? data : [];

  const handleDelete = async (id: string) => {
    await deleteUrlMutation.mutateAsync(id);
  };

  const handleDownloadReport = async () => {
    try {
      console.log('Solicitando download do relatório...');
      await downloadReportMutation.mutateAsync();
      console.log('Download solicitado com sucesso');
    } catch (error) {
      console.error('Erro detalhado ao baixar relatório:', error);
      alert(`Erro ao baixar relatório: ${error instanceof Error ? error.message : 'Tente novamente mais tarde.'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="card p-6 lg:p-8 animate-fadeIn">
        <div className="flex items-center justify-center py-10">
          <svg className="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-600 font-medium">Carregando URLs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 lg:p-8 animate-fadeIn">
        <div className="text-center py-10">
          <svg className="mx-auto h-14 w-14 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.108 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Erro ao carregar URLs</h3>
          <p className="mt-2 text-gray-500">Tente recarregar a página ou verifique sua conexão.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 btn-secondary"
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="card p-6 lg:p-8 animate-fadeIn">
        <div className="text-center py-10">
          <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma URL encontrada</h3>
          <p className="mt-2 text-gray-500">Comece criando sua primeira URL encurtada acima.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 lg:p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          URLs Cadastradas <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full">{urls.length}</span>
        </h2>
        
        <button
          onClick={handleDownloadReport}
          disabled={downloadReportMutation.isPending}
          className="btn-secondary inline-flex items-center"
          aria-label="Baixar relatório CSV"
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
        {Array.isArray(urls) && urls.length > 0 ? (
          urls.map((url) => (
            <UrlItem key={url.id} url={url} onDelete={handleDelete} />
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Nenhuma URL encontrada ou erro ao carregar dados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
