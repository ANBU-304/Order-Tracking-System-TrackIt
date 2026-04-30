// Layout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  User,
  SettingsIcon,
  HelpCircle,
  LogOut,
  Home,
  Bell,
  CreditCard,
  Menu
} from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from './useAuth';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  // ✅ Get user initials from name or email
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // ✅ Get display name
  const getDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // ✅ Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white lg:w-64 w-20 fixed lg:relative h-full flex flex-col border-r border-gray-800 shadow-2xl">

        {/* User Profile */}
        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-yellow-400 shadow-xl border-slate-800">
              <span className="text-lg font-bold">{getUserInitials()}</span>
            </div>
            <div className="hidden lg:block">
              <p className="font-medium text-gray-100">{getDisplayName()}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gray-800'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 shrink-0 ${'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Logout Area */}
        <div className="p-4 border-t border-gray-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile Header (Matching Footer Theme) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              TrackIt
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="pt-20 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}