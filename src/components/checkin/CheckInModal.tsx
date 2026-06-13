import { useState } from 'react';
import { api } from '@/lib/api';
import { Loader, X } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (decision: any) => void;
}

export function CheckInModal({ isOpen, onClose, onSuccess }: CheckInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<any>(null);

  const [data, setData] = useState({
    sleepQuality: 3,
    energyLevel: 3,
    muscleSoreness: 3,
    stressLevel: 3,
    motivation: 3,
    availableTime: 60,
  });

  const emojis: Record<string, string> = {
    sleepQuality: '😴',
    energyLevel: '⚡',
    muscleSoreness: '💪',
    stressLevel: '😰',
    motivation: '🔥',
    availableTime: '⏱️',
  };

  const labels: Record<string, string> = {
    sleepQuality: 'Qualidade do Sono',
    energyLevel: 'Nível de Energia',
    muscleSoreness: 'Dor Muscular',
    stressLevel: 'Nível de Estresse',
    motivation: 'Motivação',
    availableTime: 'Tempo Disponível (min)',
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/checkin', data);
      setDecision(response.data);
      onSuccess(response.data);
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const decisionEmojis: Record<string, string> = {
    TREINO_NORMAL: '✅',
    TREINO_MODERADO: '⚡',
    TREINO_LEVE: '🔄',
    RECUPERACAO_ATIVA: '🧘',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="w-full max-w-md rounded-lg p-6"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {!decision ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Check-in do Dia
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <X size={24} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-6 mb-6">
              {['sleepQuality', 'energyLevel', 'muscleSoreness', 'stressLevel', 'motivation'].map(
                (key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {emojis[key]} {labels[key]}
                      </label>
                      <span
                        className="text-sm font-bold"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {data[key as keyof typeof data]}/5
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={data[key as keyof typeof data]}
                      onChange={(e) =>
                        setData({
                          ...data,
                          [key]: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                )
              )}

              {/* Tempo Disponível */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {emojis.availableTime} {labels.availableTime}
                  </label>
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {data.availableTime}min
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={data.availableTime}
                  onChange={(e) =>
                    setData({
                      ...data,
                      availableTime: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full fitai-btn-primary font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analisando...
                </>
              ) : (
                'Analisar Meu Dia'
              )}
            </button>
          </>
        ) : (
          <>
            {/* Decision Result */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{decisionEmojis[decision.decision]}</div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--color-accent)' }}
              >
                {decision.decision === 'TREINO_NORMAL' && 'Treino Normal'}
                {decision.decision === 'TREINO_MODERADO' && 'Treino Moderado'}
                {decision.decision === 'TREINO_LEVE' && 'Treino Leve'}
                {decision.decision === 'RECUPERACAO_ATIVA' && 'Recuperação Ativa'}
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Score: {decision.score.toFixed(1)}/5.0
              </p>
            </div>

            {/* Rationale */}
            <div
              className="p-4 rounded-lg mb-6"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderLeft: '3px solid var(--color-accent)',
              }}
            >
              <p style={{ color: 'var(--color-text-primary)' }}>{decision.aiRationale}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg border-2 font-medium transition-all"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Fechar
              </button>
              <button
                onClick={onClose}
                className="flex-1 fitai-btn-primary font-medium"
              >
                Ver Meu Treino →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
