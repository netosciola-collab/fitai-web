import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Dumbbell,
  TrendingUp,
  Apple,
  Lightbulb,
  Settings,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/plan', label: 'Plano', icon: Zap },
  { path: '/exercises', label: 'Exercícios', icon: Dumbbell },
  { path: '/progress', label: 'Progresso', icon: TrendingUp },
  { path: '/nutrition', label: 'Nutrição', icon: Apple },
  { path: '/coach', label: 'Coach', icon: Lightbulb },
  { path: '/settings', label: 'Config', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 border-t"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
