import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Dumbbell,
  TrendingUp,
  Apple,
  Lightbulb,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/plan', label: 'Plano', icon: Zap },
  { path: '/exercises', label: 'Exercícios', icon: Dumbbell },
  { path: '/progress', label: 'Progresso', icon: TrendingUp },
  { path: '/nutrition', label: 'Nutrição', icon: Apple },
  { path: '/coach', label: 'Coach', icon: Lightbulb },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <aside
      className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 border-r"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
          FitAI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'var(--color-accent-muted)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-danger)',
          }}
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
