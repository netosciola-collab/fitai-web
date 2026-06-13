import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Send, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

export function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'coach',
      content: 'Olá! Sou seu Coach de IA. Estou aqui para ajudar você a alcançar seus objetivos de fitness. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate coach response
    setTimeout(() => {
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: 'Ótima pergunta! Com base no seu histórico de treinos, recomendo aumentar o volume de exercícios compostos. Isso ajudará a maximizar seus ganhos de força e hipertrofia.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }} className="min-h-screen">
      <Sidebar />
      <BottomNav />

      {/* Main Content */}
      <main className="md:ml-60 mb-20 md:mb-0 p-6">
        <div className="max-w-4xl mx-auto h-screen md:h-auto flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Coach de IA
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Obtenha recomendações personalizadas baseadas em IA
            </p>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: TrendingUp,
                title: 'Aumento de Volume',
                description: 'Aumente 10% o peso nos exercícios compostos',
              },
              {
                icon: AlertCircle,
                title: 'Alerta de Recuperação',
                description: 'Você dormiu apenas 6h. Considere descansar hoje.',
              },
              {
                icon: Lightbulb,
                title: 'Dica de Nutrição',
                description: 'Aumente a ingestão de proteína para 2.2g/kg',
              },
              {
                icon: TrendingUp,
                title: 'Próximo Objetivo',
                description: 'Você está 5kg longe do seu objetivo de peso',
              },
            ].map((rec, i) => {
              const Icon = rec.icon;
              return (
                <div key={i} className="fitai-card p-4">
                  <div className="flex items-start gap-3">
                    <Icon size={24} style={{ color: 'var(--color-accent)' }} />
                    <div>
                      <h3
                        className="font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {rec.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat */}
          <div className="flex-1 fitai-card p-6 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor:
                        message.type === 'user'
                          ? 'var(--color-accent)'
                          : 'var(--color-bg-secondary)',
                      color:
                        message.type === 'user'
                          ? 'white'
                          : 'var(--color-text-primary)',
                    }}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <div className="flex gap-2">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          animationDelay: '0.2s',
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          animationDelay: '0.4s',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Faça uma pergunta ao seu coach..."
                className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-input)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="fitai-btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
