import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { api } from '@/lib/api';
import { Search, Loader } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  equipment?: string;
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/v1/exercises');
      setExercises(response.data);
      setFilteredExercises(response.data);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = exercises;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by muscle group
    if (selectedMuscle !== 'all') {
      filtered = filtered.filter((ex) => ex.muscleGroup === selectedMuscle);
    }

    setFilteredExercises(filtered);
  }, [searchTerm, selectedMuscle, exercises]);

  const muscleGroups = ['all', ...new Set(exercises.map((ex) => ex.muscleGroup).filter(Boolean))];

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
              Exercícios
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Explore nossa biblioteca de {exercises.length} exercícios
            </p>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <input
                type="text"
                placeholder="Buscar exercício..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-input)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>

            {/* Muscle Group Filter */}
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-input)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group === 'all' ? 'Todos os grupos' : group}
                </option>
              ))}
            </select>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size={40} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            </div>
          ) : filteredExercises.length === 0 ? (
            <div
              className="text-center py-12 rounded-lg"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Nenhum exercício encontrado
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <div key={exercise.id} className="fitai-card p-6">
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {exercise.name}
                  </h3>
                  {exercise.muscleGroup && (
                    <p
                      className="text-sm mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <strong>Grupo:</strong> {exercise.muscleGroup}
                    </p>
                  )}
                  {exercise.equipment && (
                    <p
                      className="text-sm mb-3"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <strong>Equipamento:</strong> {exercise.equipment}
                    </p>
                  )}
                  {exercise.description && (
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {exercise.description}
                    </p>
                  )}
                  <button
                    className="fitai-btn-primary w-full mt-4"
                    style={{ fontSize: '0.875rem', padding: '8px 16px' }}
                  >
                    Adicionar ao Treino
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
