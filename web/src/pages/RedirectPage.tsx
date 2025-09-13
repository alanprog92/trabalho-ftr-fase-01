import { useParams, Navigate } from 'react-router-dom';
import { useGetUrlByShortCode, useIncrementAccess } from '../hooks/useUrls';
import { useEffect, useState } from 'react';

export const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [accessIncremented, setAccessIncremented] = useState(false);
  
  const { 
    data: urlData, 
    isLoading, 
    error, 
    isError 
  } = useGetUrlByShortCode(shortCode || '');

  const incrementAccessMutation = useIncrementAccess();

  // Efeito para incrementar o contador de acesso
  useEffect(() => {
    const incrementAccess = async () => {
      if (shortCode && !accessIncremented && urlData) {
        console.log('Tentando incrementar acesso para:', shortCode);
        try {
          // Aguardar um momento para garantir que o processo de redirecionamento não interfira
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Tentar incrementar o acesso com tentativas múltiplas
          let attempts = 0;
          const maxAttempts = 3;
          let success = false;
          
          while (!success && attempts < maxAttempts) {
            attempts++;
            console.log(`Tentativa ${attempts}/${maxAttempts} de incrementar acesso para ${shortCode}`);
            
            try {
              success = await incrementAccessMutation.mutateAsync(shortCode);
              console.log(`Resultado da tentativa ${attempts}: ${success ? 'Sucesso' : 'Falha'}`);
            } catch (err) {
              console.error(`Erro na tentativa ${attempts}:`, err);
              // Aguardar antes de tentar novamente
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (success) {
            console.log(`Incremento de acesso bem-sucedido após ${attempts} tentativa(s)`);
            setAccessIncremented(true);
          } else {
            console.error(`Falha ao incrementar acesso após ${maxAttempts} tentativas`);
            // Mesmo com falha, vamos permitir o redirecionamento para não bloquear o usuário
            setAccessIncremented(true);
          }
        } catch (err) {
          console.error('Erro geral ao incrementar acesso:', err);
          // Mesmo com erro, vamos permitir o redirecionamento
          setAccessIncremented(true);
        }
      }
    };

    incrementAccess();
  }, [shortCode, urlData, accessIncremented, incrementAccessMutation]);

  // Efeito para redirecionar após contagem regressiva
  useEffect(() => {
    if (urlData && !redirecting && accessIncremented) {
      setRedirecting(true);
      
      console.log('Iniciando contagem regressiva para redirecionamento para:', urlData.originalUrl);
      
      // Contagem regressiva antes do redirecionamento
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            console.log('Redirecionando para:', urlData.originalUrl);
            window.location.href = urlData.originalUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [urlData, redirecting, accessIncremented]);

  if (!shortCode) {
    console.log('Nenhum shortCode fornecido, redirecionando para 404');
    return <Navigate to="/404" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center animate-fadeIn">
          <div className="relative">
            <svg className="animate-spin h-16 w-16 text-blue-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Verificando URL...</h2>
          <p className="text-gray-600">Aguarde enquanto processamos seu link.</p>
        </div>
      </div>
    );
  }

  if (isError || !urlData) {
    console.error('Erro ao buscar URL ou URL não encontrada:', error);
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-6 text-center animate-fadeIn">
        <svg className="mx-auto h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirecionando...</h1>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-1">Você será redirecionado para:</p>
          <p className="text-blue-600 font-medium truncate hover:text-clip">{urlData?.originalUrl}</p>
        </div>
        
        <div className="relative pt-1 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-blue-600">
                Redirecionando em {countdown} segundos
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
            <div 
              style={{ width: `${(countdown / 3) * 100}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-1000"
            ></div>
          </div>
        </div>
        
        <div className="text-gray-500 text-sm">
          <p>Esta URL já foi acessada <span className="font-semibold text-blue-600">{urlData?.accessCount || 0}</span> vezes</p>
        </div>
      </div>
    </div>
  );
};
