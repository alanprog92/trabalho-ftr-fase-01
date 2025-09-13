import { UrlForm } from '../components/UrlForm';
import { UrlList } from '../components/UrlList';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-fluid py-8">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encurtador de URLs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transforme suas URLs longas em links curtos e fáceis de compartilhar. 
            Monitore acessos e gerencie todos os seus links em um só lugar.
          </p>
        </header>

        <main className="space-y-10 animate-fadeIn">
          <UrlForm />
          <UrlList />
        </main>

        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © 2025 Encurtador de URLs. Desenvolvido com React e TypeScript.
          </p>
        </footer>
      </div>
    </div>
  );
};
