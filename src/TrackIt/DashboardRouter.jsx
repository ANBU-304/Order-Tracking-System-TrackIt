import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { CustomerDashboard } from './CustomerDashboard';
import { SupportPortal } from './SupportPortal';
import  AdminDashboard  from './AdminDashboard';

export default function DashboardRouter() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show appropriate dashboard based on user role
  switch (user?.role) {
    case 'customer':
      return <CustomerDashboard />;
    case 'support':
      return <SupportPortal />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}
