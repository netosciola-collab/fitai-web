import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CheckInModal } from '@/components/checkin/CheckInModal';
import { api } from '@/lib/api';
import { Zap, TrendingUp, Calendar, ArrowRight, Loader } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Buscar plano ativo
      const planResponse = await api.get('/v1/plans/active').catch(() => null);
      if (planResponse?.data) {
        setActivePlan(planResponse.data);
      }

      // Buscar estatísticas de treino
      const statsResponse = await api.get('/v1/workouts/sessions').catch(() => null);
      if (statsResponse?.data) {
        setWorkoutStats(statsResponse.data);
      }

      // Buscar check-in de hoje
      const checkInResponse = await api.get('/v1/checkin/today').catch(() => null);
      if (checkInResponse?.data) {
        setTodayCheckIn(checkInResponse.data);
      } else if (activePlan) {
        // Se não há check-in e há plano ativo, mostrar modal
        setShowCheckInModal(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
        className="min-h-screen flex items-center justify-center"
      >
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      <Sidebar />
      <BottomNav />
      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onSuccess={() => {
          setShowCheckInModal(false);
          loadDashboardData();
        }}
      />

      {/* Main Content */}
      <main className="md:ml-60 mb-20 md:mb-0 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Bem-vindo, {user?.name || 'Usuário'}! 👋
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {activePlan ? 'Seu plano de treino está ativo' : 'Crie seu primeiro plano personalizado'}
            </p>
          </div>

          {/* Stats Grid */}
          {activePlan && workoutStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: Zap,
                  label: 'Treinos Esta Semana',
                  value: workoutStats.weeklyWorkouts || 0,
                  color: '#2563EB',
                },
                {
                  icon: TrendingUp,
                  label: 'Volume Total',
                  value: `${(workoutStats.totalVolume || 0).toFixed(0)} kg`,
                  color: '#22C55E',
                },
                {
                  icon: Calendar,
                  label: 'Próximo Treino',
                  value: workoutStats.nextWorkoutDay || 'Amanhã',
                  color: '#F59E0B',
                },
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
                        <p className="text-3xl font-bold" style={{ color: stat.color }}>
                          {stat.value}
                        </p>
                      </div>
                      <Icon size={32} style={{ color: stat.color, opacity: 0.5 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Plan Card */}
          {activePlan ? (
            <div className="fitai-card p-8 mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Seu Plano Atual
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Nome
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
                    {activePlan.name}
                  </p>
                </div>
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Frequência
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
                    {activePlan.frequency}x por semana
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/exercises')}
                className="fitai-btn-primary w-full flex items-center justify-center gap-2"
              >
                Ver Próximo Treino
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div
              className="fitai-card p-8 text-center mb-8"
              style={{
                backgroundColor: 'var(--color-accent-muted)',
                borderLeft: '3px solid var(--color-accent)',
              }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: 'var(--color-accent)' }}
              >
                Comece Agora! 🚀
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-primary)' }}>
                Crie seu primeiro plano de treino personalizado com IA em menos de 5 minutos.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="fitai-btn-primary inline-flex items-center gap-2"
              >
                Gerar Meu Plano
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Check-in Status */}
          {todayCheckIn && (
            <div className="fitai-card p-6">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Check-in de Hoje
              </h3>
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderLeft: '3px solid var(--color-accent)',
                }}
              >
                <p className="font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                  {todayCheckIn.decision}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {todayCheckIn.aiRationale}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
