import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

export function ProgressPage() {
  // Mock data for charts
  const weeklyData = [
    { day: 'Seg', workouts: 1, calories: 250 },
    { day: 'Ter', workouts: 0, calories: 0 },
    { day: 'Qua', workouts: 1, calories: 280 },
    { day: 'Qui', workouts: 0, calories: 0 },
    { day: 'Sex', workouts: 1, calories: 320 },
    { day: 'Sab', workouts: 1, calories: 400 },
    { day: 'Dom', workouts: 0, calories: 0 },
  ];

  const maxCalories = Math.max(...weeklyData.map((d) => d.calories));

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      <Sidebar />
      <BottomNav />

      {/* Main Content */}
      <main className="md:ml-60 mb-20 md:mb-0 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Seu Progresso
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Acompanhe seu desenvolvimento ao longo do tempo
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Zap, label: 'Treinos Este Mês', value: '12', color: '#2563EB' },
              { icon: TrendingUp, label: 'Peso Atual', value: '75kg', color: '#22C55E' },
              { icon: Calendar, label: 'Dias Consecutivos', value: '7', color: '#F59E0B' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="fitai-card p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className="text-sm font-medium mb-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <Icon size={32} style={{ color: stat.color, opacity: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Chart */}
          <div className="fitai-card p-6 mb-8">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Calorias Queimadas Esta Semana
            </h2>
            <div className="flex items-end justify-between h-64 gap-2">
              {weeklyData.map((data, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      height: `${(data.calories / maxCalories) * 100}%`,
                      minHeight: data.calories > 0 ? '4px' : '0px',
                    }}
                  />
                  <p
                    className="text-xs font-medium mt-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {data.day}
                  </p>
                  {data.calories > 0 && (
                    <p
                      className="text-xs"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {data.calories}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="fitai-card p-6">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Conquistas Recentes
            </h2>
            <div className="space-y-4">
              {[
                { icon: '🏋️', title: '7 Dias em Sequência', date: 'Hoje' },
                { icon: '🔥', title: '1000 Calorias Queimadas', date: 'Ontem' },
                { icon: '💪', title: 'Novo Recorde de Peso', date: '2 dias atrás' },
              ].map((achievement, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderLeft: '3px solid var(--color-accent)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {achievement.title}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: 'var(--color-success)' }}>✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
