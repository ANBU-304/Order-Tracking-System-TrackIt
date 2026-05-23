import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  User,
  SettingsIcon,
  HelpCircle,
  LogOut,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Headphones,
  BarChart3,
} from 'lucide-react';
import { useAuth } from './useAuth';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.trim().split(' ');
      if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/dashboard/admin';
    if (user?.role === 'support') return '/dashboard/support';
    return '/dashboard/customer';
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: getDashboardPath(),
      show: true,
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      show: true,
    },
    
    {
      icon: SettingsIcon,
      label: 'Settings',
      path: '/settings',
      show: true,
    },
  ];

  const visibleItems = menuItems.filter((item) => item.show);

  const roleBadge = {
    admin: { label: 'Admin', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    support: { label: 'Support', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    customer: { label: 'Customer', color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' },
  }[user?.role] || { label: 'User', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-4 border-b border-slate-800 ${isCollapsed ? 'px-3' : 'px-5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/10 flex-shrink-0">
              <Package className="w-5 h-5 text-slate-900" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-black text-white uppercase tracking-tighter">
                Track<span className="text-yellow-400 text-xl">.</span>It
              </span>
            )}
          </div>

          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Close button - mobile only */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {!isCollapsed && (
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">
            Menu
          </p>
        )}
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path.includes('/dashboard') && location.pathname.includes('/dashboard'));

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 ${
                      isCollapsed ? '-left-2' : '-left-3'
                    }`}
                  />
                )}

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive
                      ? 'bg-yellow-400/10'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <span className="text-sm font-bold truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className={`border-t border-slate-800 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all group ${
            isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />
          </div>
          {!isCollapsed && <span className="text-sm font-bold">Sign Out</span>}

          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
              Sign Out
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45" />
            </div>
          )}
        </button>

        
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <div
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 h-screen sticky top-0 transition-all duration-300 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </div>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tighter">
                Track<span className="text-yellow-400 text-xl">.</span>It
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* User avatar */}
              <div className="w-8 h-8  text-slate-900 font-black text-xs">
                {getUserInitials()}
              </div>
              {/* Menu button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar */}
          <div className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-50 shadow-2xl">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}