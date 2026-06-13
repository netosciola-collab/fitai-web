import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="text-center">
        <h1
          className="text-6xl font-bold mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          404
        </h1>
        <p
          className="text-2xl font-semibold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Página não encontrada
        </p>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link
          to="/"
          className="fitai-btn-primary inline-flex items-center gap-2"
        >
          <Home size={20} />
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
