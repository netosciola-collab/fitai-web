import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface OnboardingData {
  // Step 1
  name: string;
  sex: string;
  birthDate: string;
  weight: number;
  height: number;
  // Step 2
  goal: string;
  experienceLevel: string;
  // Step 3
  availableDays: number;
  sessionDuration: number;
  gymType: string;
  // Step 4
  injuries: string[];
  physicalLimits: string;
  // Step 5
  stressLevel: number;
  sleepQuality: number;
  preferredCardio: string[];
  // Step 6 (summary)
}

const GOALS = [
  { id: 'hypertrophy', label: 'Hipertrofia', icon: '💪' },
  { id: 'weight-loss', label: 'Emagrecimento', icon: '⚖️' },
  { id: 'definition', label: 'Definição', icon: '✨' },
  { id: 'strength', label: 'Força', icon: '🏋️' },
  { id: 'conditioning', label: 'Recondicionamento', icon: '🏃' },
  { id: 'health', label: 'Saúde Geral', icon: '❤️' },
  { id: 'performance', label: 'Performance', icon: '🎯' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Iniciante' },
  { id: 'intermediate', label: 'Intermediário' },
  { id: 'advanced', label: 'Avançado' },
];

const INJURIES = ['Joelho', 'Ombro', 'Lombar', 'Quadril', 'Tornozelo'];
const CARDIO_OPTIONS = ['Corrida', 'Bicicleta', 'Natação', 'Elíptico', 'Remo'];
const GYM_TYPES = [
  { id: 'gym', label: 'Academia', icon: '🏋️' },
  { id: 'home', label: 'Casa', icon: '🏠' },
  { id: 'outdoor', label: 'Ao ar livre', icon: '🌳' },
  { id: 'no-equipment', label: 'Sem equipamento', icon: '🤸' },
];

const SPLITS = {
  2: 'Upper/Lower',
  3: 'PPL (Push/Pull/Legs)',
  4: 'Upper/Lower 2x',
  5: 'PPL + 2 dias',
  6: 'Full Body 6x',
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<OnboardingData>({
    name: user?.name || '',
    sex: '',
    birthDate: '',
    weight: 0,
    height: 0,
    goal: '',
    experienceLevel: '',
    availableDays: 3,
    sessionDuration: 60,
    gymType: '',
    injuries: [],
    physicalLimits: '',
    stressLevel: 3,
    sleepQuality: 3,
    preferredCardio: [],
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.name) newErrors.name = 'Nome é obrigatório';
        if (!data.sex) newErrors.sex = 'Sexo é obrigatório';
        if (!data.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
        if (!data.weight || data.weight <= 0) newErrors.weight = 'Peso deve ser maior que 0';
        if (!data.height || data.height <= 0) newErrors.height = 'Altura deve ser maior que 0';
        break;
      case 2:
        if (!data.goal) newErrors.goal = 'Objetivo é obrigatório';
        if (!data.experienceLevel) newErrors.experienceLevel = 'Nível é obrigatório';
        break;
      case 3:
        if (!data.gymType) newErrors.gymType = 'Tipo de local é obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      await api.post('/v1/plans/generate', {
        userId: user?.id,
        ...data,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      setErrors({ submit: 'Erro ao gerar plano. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (currentStep / 6) * 100;

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      {/* Progress Bar */}
      <div
        className="h-1 transition-all duration-500"
        style={{
          backgroundColor: 'var(--color-accent)',
          width: `${progressPercentage}%`,
        }}
      />

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step Indicator */}
          <div className="text-center mb-8">
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Etapa {currentStep} de 6
            </p>
            <h1
              className="text-3xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {currentStep === 1 && 'Informações Pessoais'}
              {currentStep === 2 && 'Seus Objetivos'}
              {currentStep === 3 && 'Disponibilidade'}
              {currentStep === 4 && 'Lesões e Limitações'}
              {currentStep === 5 && 'Estilo de Vida'}
              {currentStep === 6 && 'Resumo'}
            </h1>
          </div>

          {/* Step Content */}
          <div className="fitai-card p-8 mb-8">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-input)',
                      borderColor: errors.name ? 'var(--color-danger)' : 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                  {errors.name && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Sexo *
                  </label>
                  <div className="flex gap-4">
                    {['M', 'F', 'Outro'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setData({ ...data, sex: option })}
                        className="flex-1 py-3 rounded-lg border-2 font-medium transition-all"
                        style={{
                          borderColor: data.sex === option ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.sex === option ? 'var(--color-accent-muted)' : 'transparent',
                          color: data.sex === option ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {errors.sex && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.sex}</p>}
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={data.birthDate}
                    onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-input)',
                      borderColor: errors.birthDate ? 'var(--color-danger)' : 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                  {errors.birthDate && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.birthDate}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-2">
                      Peso (kg) *
                    </label>
                    <input
                      type="number"
                      value={data.weight || ''}
                      onChange={(e) => setData({ ...data, weight: parseFloat(e.target.value) })}
                      placeholder="70"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                      style={{
                        backgroundColor: 'var(--color-bg-input)',
                        borderColor: errors.weight ? 'var(--color-danger)' : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    {errors.weight && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.weight}</p>}
                  </div>
                  <div>
                    <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-2">
                      Altura (cm) *
                    </label>
                    <input
                      type="number"
                      value={data.height || ''}
                      onChange={(e) => setData({ ...data, height: parseFloat(e.target.value) })}
                      placeholder="180"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                      style={{
                        backgroundColor: 'var(--color-bg-input)',
                        borderColor: errors.height ? 'var(--color-danger)' : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    {errors.height && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.height}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Objetivo Principal *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GOALS.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setData({ ...data, goal: goal.id })}
                        className="p-4 rounded-lg border-2 text-center transition-all"
                        style={{
                          borderColor: data.goal === goal.id ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.goal === goal.id ? 'var(--color-accent-muted)' : 'transparent',
                        }}
                      >
                        <div className="text-2xl mb-2">{goal.icon}</div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: data.goal === goal.id ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
                        >
                          {goal.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  {errors.goal && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.goal}</p>}
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Nível de Experiência *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setData({ ...data, experienceLevel: level.id })}
                        className="py-3 rounded-lg border-2 font-medium transition-all"
                        style={{
                          borderColor: data.experienceLevel === level.id ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.experienceLevel === level.id ? 'var(--color-accent-muted)' : 'transparent',
                          color: data.experienceLevel === level.id ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        }}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                  {errors.experienceLevel && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.experienceLevel}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Dias Disponíveis: {data.availableDays}x por semana
                  </label>
                  <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mb-4">
                    Split sugerido: <strong>{SPLITS[data.availableDays as keyof typeof SPLITS]}</strong>
                  </p>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={data.availableDays}
                    onChange={(e) => setData({ ...data, availableDays: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Duração por Sessão: {data.sessionDuration}min
                  </label>
                  <div className="flex gap-2">
                    {[30, 45, 60, 75, 90].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setData({ ...data, sessionDuration: duration })}
                        className="flex-1 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          borderColor: data.sessionDuration === duration ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.sessionDuration === duration ? 'var(--color-accent-muted)' : 'transparent',
                          color: data.sessionDuration === duration ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        }}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Tipo de Local *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GYM_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setData({ ...data, gymType: type.id })}
                        className="p-4 rounded-lg border-2 text-center transition-all"
                        style={{
                          borderColor: data.gymType === type.id ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.gymType === type.id ? 'var(--color-accent-muted)' : 'transparent',
                        }}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: data.gymType === type.id ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
                        >
                          {type.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  {errors.gymType && <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">{errors.gymType}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Injuries */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Lesões ou Problemas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INJURIES.map((injury) => (
                      <button
                        key={injury}
                        onClick={() => {
                          const updated = data.injuries.includes(injury)
                            ? data.injuries.filter((i) => i !== injury)
                            : [...data.injuries, injury];
                          setData({ ...data, injuries: updated });
                        }}
                        className="px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          borderColor: data.injuries.includes(injury) ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.injuries.includes(injury) ? 'var(--color-accent-muted)' : 'transparent',
                          color: data.injuries.includes(injury) ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        }}
                      >
                        {injury}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-2">
                    Limitações Físicas
                  </label>
                  <textarea
                    value={data.physicalLimits}
                    onChange={(e) => setData({ ...data, physicalLimits: e.target.value })}
                    placeholder="Descreva qualquer limitação física..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-input)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Lifestyle */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Nível de Estresse: {data.stressLevel}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={data.stressLevel}
                    onChange={(e) => setData({ ...data, stressLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Qualidade do Sono: {data.sleepQuality}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={data.sleepQuality}
                    onChange={(e) => setData({ ...data, sleepQuality: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label style={{ color: 'var(--color-text-primary)' }} className="block text-sm font-medium mb-3">
                    Cardio Preferido
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CARDIO_OPTIONS.map((cardio) => (
                      <button
                        key={cardio}
                        onClick={() => {
                          const updated = data.preferredCardio.includes(cardio)
                            ? data.preferredCardio.filter((c) => c !== cardio)
                            : [...data.preferredCardio, cardio];
                          setData({ ...data, preferredCardio: updated });
                        }}
                        className="px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          borderColor: data.preferredCardio.includes(cardio) ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: data.preferredCardio.includes(cardio) ? 'var(--color-accent-muted)' : 'transparent',
                          color: data.preferredCardio.includes(cardio) ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        }}
                      >
                        {cardio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Summary */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs mb-1">Nome</p>
                    <p style={{ color: 'var(--color-text-primary)' }} className="font-bold">{data.name}</p>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs mb-1">Objetivo</p>
                    <p style={{ color: 'var(--color-text-primary)' }} className="font-bold">
                      {GOALS.find((g) => g.id === data.goal)?.label}
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs mb-1">Peso / Altura</p>
                    <p style={{ color: 'var(--color-text-primary)' }} className="font-bold">
                      {data.weight}kg / {data.height}cm
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs mb-1">Disponibilidade</p>
                    <p style={{ color: 'var(--color-text-primary)' }} className="font-bold">
                      {data.availableDays}x por semana
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--color-accent-muted)', borderLeft: '3px solid var(--color-accent)' }}
                >
                  <p style={{ color: 'var(--color-accent)' }} className="font-bold mb-2">
                    Seu Plano Personalizado
                  </p>
                  <p style={{ color: 'var(--color-text-primary)' }}>
                    Baseado em suas respostas, vamos gerar um plano de treino personalizado com IA que se adapta ao seu progresso em tempo real.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div
                className="p-4 rounded-lg text-sm mt-6"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-danger)',
                  borderLeft: '3px solid var(--color-danger)',
                }}
              >
                {errors.submit}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <ChevronLeft size={20} />
              Voltar
            </button>
            <button
              onClick={currentStep === 6 ? handleSubmit : handleNext}
              disabled={isLoading}
              className="flex-1 fitai-btn-primary font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Gerando...
                </>
              ) : currentStep === 6 ? (
                <>
                  Gerar Meu Plano
                  <ChevronRight size={20} />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
