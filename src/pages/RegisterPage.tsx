import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Preencha todos os campos');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/v1/auth/register', { name, email });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '-0.02em' }}>FitAI</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Crie sua conta e comece seu treino</p>
        </div>
        <div className="fitai-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)', fontSize: '14px', outline: 'none' }}
              />
            </div>
            {error && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', fontSize: '14px', marginBottom: '16px', borderLeft: '3px solid var(--color-danger)' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="fitai-btn-primary"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {isLoading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </form>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Já tenho conta </span>
            <button type="button" onClick={() => navigate('/login')} style={{ color: 'var(--color-accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              Entrar aqui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
