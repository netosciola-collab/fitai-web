import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Apple, Droplet, Flame, Plus } from 'lucide-react';

export function NutritionPage() {
  const dailyGoals = {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 80,
    water: 3000,
  };

  const consumed = {
    calories: 1850,
    protein: 120,
    carbs: 220,
    fat: 55,
    water: 2100,
  };

  const getMacroPercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100);
  };

  const macros = [
    { label: 'Proteína', icon: Apple, consumed: consumed.protein, goal: dailyGoals.protein, unit: 'g', color: '#2563EB' },
    { label: 'Carboidratos', icon: Flame, consumed: consumed.carbs, goal: dailyGoals.carbs, unit: 'g', color: '#F59E0B' },
    { label: 'Gordura', icon: Droplet, consumed: consumed.fat, goal: dailyGoals.fat, unit: 'g', color: '#22C55E' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      <Sidebar />
      <BottomNav />

      {/* Main Content */}
      <main className="md:ml-60 mb-20 md:mb-0 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Nutrição
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Acompanhe sua ingestão de alimentos e macronutrientes
              </p>
            </div>
            <button className="fitai-btn-primary flex items-center gap-2">
              <Plus size={20} />
              Registrar Refeição
            </button>
          </div>

          {/* Calories Card */}
          <div className="fitai-card p-8 mb-8">
            <div className="text-center">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Calorias Hoje
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span
                  className="text-5xl font-bold"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {consumed.calories}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  / {dailyGoals.calories} kcal
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${getMacroPercentage(consumed.calories, dailyGoals.calories)}%`,
                    backgroundColor: 'var(--color-accent)',
                  }}
                />
              </div>
              <p
                className="text-sm mt-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {dailyGoals.calories - consumed.calories} kcal restantes
              </p>
            </div>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {macros.map((macro, i) => {
              const Icon = macro.icon;
              const percentage = getMacroPercentage(macro.consumed, macro.goal);
              return (
                <div key={i} className="fitai-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon size={24} style={{ color: macro.color }} />
                    <h3
                      className="font-bold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {macro.label}
                    </h3>
                  </div>
                  <div className="mb-3">
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: macro.color,
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    <strong>{macro.consumed}</strong> / {macro.goal} {macro.unit}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Water Intake */}
          <div className="fitai-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Ingestão de Água
              </h2>
              <Droplet size={24} style={{ color: '#2563EB' }} />
            </div>
            <div
              className="w-full h-4 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${getMacroPercentage(consumed.water, dailyGoals.water)}%`,
                  backgroundColor: '#2563EB',
                }}
              />
            </div>
            <p
              className="text-sm mt-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {consumed.water} / {dailyGoals.water} ml
            </p>
          </div>

          {/* Recent Meals */}
          <div className="fitai-card p-6">
            <h2
              className="text-lg font-bold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Refeições Recentes
            </h2>
            <div className="space-y-4">
              {[
                { meal: 'Café da Manhã', time: '08:00', calories: 450 },
                { meal: 'Almoço', time: '12:30', calories: 850 },
                { meal: 'Lanche', time: '15:00', calories: 200 },
                { meal: 'Jantar', time: '19:30', calories: 350 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderLeft: '3px solid var(--color-accent)',
                  }}
                >
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.meal}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.time}
                    </p>
                  </div>
                  <p
                    className="font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {item.calories} kcal
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
