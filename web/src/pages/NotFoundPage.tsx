import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto animate-fadeIn">
        <div className="text-center">
          <div className="mb-8">
            <svg className="h-24 w-24 text-gray-400 mx-auto mb-4 transform transition-transform duration-500 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
          </div>

          <div className="card p-6 mb-8 border-l-4 border-yellow-400">
            <div className="flex items-start space-x-3">
              <svg className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="text-gray-800 font-medium mb-2">URL não encontrada</p>
                <p className="text-gray-600 text-sm">
                  A URL encurtada que você está tentando acessar não existe ou pode ter sido removida.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary block w-full py-3 px-6 font-medium text-center"
            >
              Voltar para a página inicial
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-secondary block w-full py-3 px-6 font-medium text-center"
            >
              Voltar para a página anterior
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Se você acredita que isso é um erro, entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
