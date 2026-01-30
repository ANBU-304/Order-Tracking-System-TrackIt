// Layout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
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
import { NotificationFeed } from './NotificationFeed';  

export function Layout() {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    
  
    
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
  {/* Sidebar */}
  <div className="bg-gray-900 text-white lg:w-64 w-20 fixed lg:relative h-full flex flex-col border-r border-gray-800 shadow-2xl">
    
    

    {/* User Profile */}
    <div className="p-6 border-b border-gray-800 bg-gray-900/50">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-yellow-400 shadow-xl border-slate-800 ">
          <span className="text-lg font-bold">JS</span>
        </div>
        <div className="hidden lg:block">
          <p className="font-medium text-gray-100">John Smith</p>
          <p className="text-xxs text-gray-400 truncate">john@example.com</p>
         
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
              <Icon className={`w-5 h-5 mr-3 shrink-0 ${
            'text-gray-500 group-hover:text-gray-300'
              }`} />
              <span className="hidden lg:inline">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </div>

    {/* Logout Area */}
    <div className="p-4 border-t border-gray-800">
      <Button
        onClick={() => navigate('/login')}
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