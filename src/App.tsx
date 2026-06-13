import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ExercisesPage } from '@/pages/ExercisesPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { NutritionPage } from '@/pages/NutritionPage';
import { CoachPage } from '@/pages/CoachPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  const { setInitialized, initialized } = useAuthStore();

  useEffect(() => {
    // Check if user has a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, user is logged in
      useAuthStore.getState().setUser({
        id: 'user-id',
        email: 'user@example.com',
        name: 'User',
      });
    }
    // Mark initialization as complete
    setInitialized(true);
  }, []); // Empty dependency array - only run once on mount

  if (!initialized) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" 
          style={{ borderColor: 'var(--color-accent)' }}>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder Routes (to be implemented) */}
        <Route path="/demo" element={<LandingPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/plan" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/workout/:sessionId" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/exercises" element={
          <ProtectedRoute>
            <ExercisesPage />
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        } />
        <Route path="/nutrition" element={
          <ProtectedRoute>
            <NutritionPage />
          </ProtectedRoute>
        } />
        <Route path="/coach" element={
          <ProtectedRoute>
            <CoachPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
