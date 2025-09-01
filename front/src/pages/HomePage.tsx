import { UrlForm } from '../components/UrlForm';
import { UrlList } from '../components/UrlList';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encurtador de URLs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transforme suas URLs longas em links curtos e fáceis de compartilhar. 
            Monitore acessos e gerencie todos os seus links em um só lugar.
          </p>
        </header>

        <main className="space-y-8">
          <UrlForm />
          <UrlList />
        </main>

        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © 2025 Encurtador de URLs. Desenvolvido com React e TypeScript.
          </p>
        </footer>
      </div>
    </div>
  );
};
