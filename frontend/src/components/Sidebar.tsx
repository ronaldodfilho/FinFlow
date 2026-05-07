import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  TrendingDown,
  TrendingUp,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { to: '/payables', label: 'Contas a Pagar', icon: TrendingDown },
  { to: '/receivables', label: 'Contas a Receber', icon: TrendingUp },
];

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-finflow-card border-r border-finflow-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-finflow-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-finflow-primary to-finflow-accent flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FinFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-finflow-primary/10 text-finflow-primary border border-finflow-primary/20'
                  : 'text-finflow-textMuted hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-finflow-primary' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-finflow-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-finflow-primary to-finflow-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-finflow-textMuted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-finflow-textMuted hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
