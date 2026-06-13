import { Link } from 'react-router-dom';
import { Zap, Dumbbell, TrendingUp, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      {/* Header */}
      <header
        className="border-b"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-accent)' }}
          >
            FitAI
          </h1>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-accent)',
                borderColor: 'var(--color-accent)',
                border: '1px solid',
              }}
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className="fitai-btn-primary"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Seu Treino Inteligente Começa Aqui
        </h1>
        <p
          className="text-xl mb-8 max-w-2xl mx-auto"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          FitAI usa inteligência artificial para criar planos de treino personalizados
          que se adaptam ao seu progresso em tempo real.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="fitai-btn-primary flex items-center gap-2">
            Começar Agora
            <ArrowRight size={20} />
          </Link>
          <Link
            to="/demo"
            className="px-8 py-3 rounded-lg border transition-all"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Ver Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Por que escolher FitAI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Planos Inteligentes',
              description:
                'IA cria treinos personalizados baseados em seus objetivos e capacidade',
            },
            {
              icon: Dumbbell,
              title: '1000+ Exercícios',
              description:
                'Banco de dados completo com variações e técnicas corretas',
            },
            {
              icon: TrendingUp,
              title: 'Progresso em Tempo Real',
              description:
                'Acompanhe seu desenvolvimento com gráficos e análises detalhadas',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="fitai-card p-8 text-center">
                <Icon
                  size={48}
                  className="mx-auto mb-4"
                  style={{ color: 'var(--color-accent)' }}
                />
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section
        className="max-w-6xl mx-auto px-6 py-20 rounded-lg text-center"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Pronto para transformar seu treino?
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Comece grátis hoje e veja os resultados em 30 dias
        </p>
        <Link to="/signup" className="fitai-btn-primary">
          Criar Conta Grátis
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="border-t mt-20"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            © 2024 FitAI. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
