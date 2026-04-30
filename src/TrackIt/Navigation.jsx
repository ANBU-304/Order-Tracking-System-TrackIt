import { useState } from 'react';
import { Package, Menu, LogOut, User, X, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from './useAuth';


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
    { label: "Home", path: "", show:!isAuthenticated && !(user?.role === 'customer') && !(user?.role === 'support' ) && !(user?.role === 'admin') },
    { label: "My Orders", path: "/dashboard/customer", show: isAuthenticated && (user?.role === 'customer') },
    { label: "Support Portal", path: "/dashboard/support", show: isAuthenticated && (user?.role === 'support') },
    { label: "Analytics", path: "/dashboard/admin", show: isAuthenticated && user?.role === 'admin' },
    { label: "Help Center", path: "/help", show:isAuthenticated &&!(user?.role === 'support' ) && !(user?.role === 'admin') },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/1 backdrop-blur-xl h-20">
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

     
    </nav>
  );
}