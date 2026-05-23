import { useState, useEffect, useRef } from 'react';
import { Package, Menu, LogOut, User, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from './useAuth';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: "Home", path: "/", show: !isAuthenticated && !(user?.role === 'customer') && !(user?.role === 'support') && !(user?.role === 'admin') },
    { label: "My Orders", path: "/dashboard/customer", show: isAuthenticated && (user?.role === 'customer') },
    { label: "Support Portal", path: "/dashboard/support", show: isAuthenticated && (user?.role === 'support') },
    { label: "Analytics", path: "/dashboard/admin", show: isAuthenticated && user?.role === 'admin' },
    { label: "Help Center", path: "/help", show: isAuthenticated && !(user?.role === 'support') && !(user?.role === 'admin') },
  ];

  const visibleLinks = navLinks.filter(link => link.show);

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl h-16 sm:h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full relative">

            {/* 1. Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group z-10 flex-shrink-0">
              <div className="bg-slate-900 p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:bg-yellow-400 transition-all duration-300">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-slate-900" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 uppercase">
                Track<span className="text-yellow-500 text-xl sm:text-2xl">.</span>It
              </span>
            </Link>

            {/* 2. Desktop Links */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1 lg:space-x-2">
              {visibleLinks.map((link) => (
                <Link key={link.path} to={link.path} className="relative group px-3 lg:px-4 py-2">
                  <span className={`text-xs lg:text-sm font-bold transition-colors whitespace-nowrap ${
                    isActive(link.path) ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}>
                    {link.label}
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform ${
                    isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </div>

            {/* 3. Right Side */}
            <div className="flex items-center gap-2 sm:gap-3 z-10">

              {!isAuthenticated ? (
                <Link to="/login" className="hidden sm:block">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-yellow-400 font-bold rounded-xl px-4 lg:px-6 h-9 sm:h-11 text-xs sm:text-sm">
                    Log In
                  </Button>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                    <div className="text-right">
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-900 leading-none truncate max-w-[60px] sm:max-w-[80px]">
                        {user?.name}
                      </p>
                      <p className="text-[7px] sm:text-[8px] uppercase text-yellow-600 font-black">
                        {user?.role}
                      </p>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-900 transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[99]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Menu Panel ── */}
      <div className={`md:hidden fixed top-16 sm:top-20 left-0 right-0 bottom-0 bg-white z-[100] overflow-y-auto transition-all duration-300 ease-in-out ${
        isMobileMenuOpen
          ? 'translate-y-0 opacity-100'
          : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        <div className="px-4 py-4 space-y-1">

          {/* Mobile Nav Links */}
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-px bg-slate-100 my-3" />

          {/* Mobile Auth */}
          {!isAuthenticated ? (
            <div className="space-y-2">
              <Link to="/login" className="block">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-yellow-400 font-bold rounded-xl h-12 text-sm">
                  Log In
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400 flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[10px] uppercase text-yellow-600 font-black">{user?.role}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}