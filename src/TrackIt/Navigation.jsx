import { Package, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from './useAuth';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show different nav items based on user role
  const showCustomerNav = user?.role === 'customer' || !isAuthenticated;
  const showSupportNav = user?.role === 'support' || user?.role === 'admin';
  const showAdminNav = user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="gradient-primary p-2 rounded-xl group-hover:shadow-lg transition-all">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TrackIt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Public tracking - always visible */}
            <Link to="/">
              <Button
                variant={isActive('/') ? 'secondary' : 'ghost'}
                className="hover:bg-gray-100"
              >
                Track Order
              </Button>
            </Link>

            {/* Customer Dashboard */}
            {isAuthenticated && showCustomerNav && (
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  className="hover:bg-gray-100"
                >
                  My Orders
                </Button>
              </Link>
            )}

            {/* Support Portal */}
            {isAuthenticated && showSupportNav && (
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  className="hover:bg-gray-100"
                >
                  Support Portal
                </Button>
              </Link>
            )}

            {/* Admin Dashboard */}
            {isAuthenticated && showAdminNav && (
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  className="hover:bg-gray-100"
                >
                  Analytics
                </Button>
              </Link>
            )}

            {/* Help Center - always visible */}
            <Link to="/help">
              <Button
                variant={isActive('/help') ? 'secondary' : 'ghost'}
                className="hover:bg-gray-100"
              >
                Help
              </Button>
            </Link>

            {/* Auth buttons */}
            {!isAuthenticated ? (
              <Link to="/login">
                <Button className="ml-4 gradient-primary hover:opacity-90 transition-opacity">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="ml-4 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-in">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/') ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  Track Order
                </Button>
              </Link>

              {isAuthenticated && showCustomerNav && (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    My Orders
                  </Button>
                </Link>
              )}

              {isAuthenticated && showSupportNav && (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    Support Portal
                  </Button>
                </Link>
              )}

              {isAuthenticated && showAdminNav && (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    Analytics
                  </Button>
                </Link>
              )}

              {/* Help Center - always visible */}
              <Link to="/help" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/help') ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  Help
                </Button>
              </Link>

              {!isAuthenticated ? (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gradient-primary hover:opacity-90 transition-opacity">
                    Login
                  </Button>
                </Link>
              ) : (
                <>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                      {user.role}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}