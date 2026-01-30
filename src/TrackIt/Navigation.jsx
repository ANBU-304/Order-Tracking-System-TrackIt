import { useState } from 'react';
import { Package, Menu, LogOut, User, X, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from './useAuth';
import { NotificationFeed } from './NotificationFeed'; // Import your notification component

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: "Track Order", path: "/", show: true },
    { label: "My Orders", path: "/dashboard/customer", show: isAuthenticated && (user?.role === 'customer') },
    { label: "Support Portal", path: "/dashboard/support", show: isAuthenticated && (user?.role === 'support' || user?.role === 'admin') },
    { label: "Analytics", path: "/dashboard/admin", show: isAuthenticated && user?.role === 'admin' },
    { label: "Help Center", path: "/help", show: true },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/20 backdrop-blur-xl h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full relative">
          
          {/* 1. Logo */}
          <Link to="/" className="flex items-center space-x-3 group z-10">
            <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-yellow-400 transition-all duration-300">
              <Package className="w-5 h-5 text-white group-hover:text-slate-900" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              Track<span className="text-yellow-500 text-2xl">.</span>It
            </span>
          </Link>

          {/* 2. Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-2">
            {navLinks.filter(link => link.show).map((link) => (
              <Link key={link.path} to={link.path} className="relative group px-4 py-2">
                <span className={`text-sm font-bold transition-colors ${isActive(link.path) ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                  {link.label}
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </div>

          {/* 3. Right Side Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            
            {/* Notification Bell (Visible on all screens) */}
            {isAuthenticated && <NotificationFeed />}

            {!isAuthenticated ? (
              <Link to="/login" className="hidden sm:block">
                <Button className="bg-slate-900 hover:bg-slate-800 text-yellow-400 font-bold rounded-xl px-6 h-11">
                  Log In
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 leading-none truncate max-w-[80px]">{user.name}</p>
                    <p className="text-[8px] uppercase text-yellow-600 font-black">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-full h-10 w-10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-900 hover:bg-slate-50 rounded-xl ml-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-white z-[90] md:hidden animate-in slide-in-from-top duration-300">
          <div className="p-6 space-y-4">
            {/* User section in mobile menu */}
            {isAuthenticated && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-yellow-400 font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
            )}

            {/* Nav links in mobile menu */}
            <div className="space-y-2">
              {navLinks.filter(link => link.show).map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-4 rounded-xl font-bold text-lg transition-colors ${
                    isActive(link.path) ? 'bg-yellow-400 text-slate-900' : 'text-slate-600 active:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100">
              {!isAuthenticated ? (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-slate-900 text-yellow-400 h-14 rounded-2xl font-black uppercase tracking-widest">
                    Sign In to Account
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full border-red-100 text-red-600 h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Terminate Session
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}