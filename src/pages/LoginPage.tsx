import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Mail, Loader } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email) {
      setLocalError('Digite seu email');
      return;
    }

    try {
      await signIn(email);
      // Redirect to onboarding after successful login
      navigate('/onboarding');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setLocalError(error || 'Falha ao fazer login');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: 'var(--color-accent)' }}
          >
            FitAI
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Seu treino inteligente começa aqui
          </p>
        </div>

        {/* Form Card */}
        <div className="fitai-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-input)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-danger)',
                  borderLeft: '3px solid var(--color-danger)',
                }}
              >
                {localError || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full fitai-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold transition-colors cursor-pointer"
                style={{ color: 'var(--color-accent)', background: 'none', border: 'none', padding: 0 }}
              >
                Criar conta grátis
              </button>
            </p>
          </div>
        </div>

        {/* Demo Link */}
        <div className="text-center mt-6">
          <Link
            to="/demo"
            className="text-sm transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Ou explore a demo
          </Link>
        </div>
      </div>
    </div>
  );
}
