import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth} from "./TrackIt/useAuth";
import { AuthProvider } from "./TrackIt/AuthContext";
import { Navigation } from "./TrackIt/Navigation";

import Login from "./TrackIt/Login";
import { PublicTracking } from "./TrackIt/PublicTracking";
import { OrderDetails } from "./TrackIt/OrderDetails";
import DashboardRouter from "./TrackIt/DashboardRouter";

import Profile from "./TrackIt/Profile";
import { PersonalDetails } from "./TrackIt/PersonalDetails";
import { ProfilePicture } from "./TrackIt/ProfilePicture";
import ChangePassword from "./TrackIt/ChangePassword";
import NotificationPreferences from "./TrackIt/NotificationPreferences";
import Settings from "./TrackIt/Settings";

import { HelpCenter } from "./TrackIt/HelpCenter";
import ContactSupport from "./TrackIt/ContactSupport";
import ReportIssue from "./TrackIt/ReportIssue";
import { SupportPortal } from "./TrackIt/SupportPortal";
import { NotificationFeed } from "./TrackIt/NotificationFeed";
import QRScanner from "./TrackIt/QRScanner";
import { Toaster } from "sonner";
import "./index.css";

/* ---------- Protected Route ---------- */
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role) {
    const userRole = user.role.toLowerCase();
    const allowed = allowedRoles.map((r) => r.toLowerCase());

    if (!allowed.includes(userRole)) {
      return <Navigate to={`/dashboard/${userRole}`} replace />;
    }
  }

  return children;
}

/* ---------- ✅ Public Route - Redirect if logged in ---------- */
function PublicRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ If user is logged in, redirect to their dashboard
  if (isAuthenticated && user?.role) {
    const role = user.role.toLowerCase();
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
}

/* ---------- ✅ Home Route - Redirect based on auth status ---------- */
function HomeRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ If logged in, go to dashboard
  if (isAuthenticated && user?.role) {
    const role = user.role.toLowerCase();
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  // ✅ If not logged in, show public tracking page
  return <PublicTracking />;
}

/* ---------- App Routes ---------- */
function AppRoutes() {
  return (
    <>
      <Navigation />
      <Routes>
        {/* ✅ Home Route - Redirects logged-in users */}
        <Route path="/" element={<HomeRoute />} />
        <Route path="/scan" element={<QRScanner />} />
        {/* ✅ Login Route - Redirects logged-in users */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/support/contact" element={<ContactSupport />} />
        <Route path="/support/report" element={<ReportIssue />} />

        {/* Dashboard Routes - Role-Based */}
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/support/*"
          element={
            <ProtectedRoute allowedRoles={["support"]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/customer/*"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Support Portal */}
        <Route
          path="/portal/support"
          element={
            <ProtectedRoute allowedRoles={["support", "admin"]}>
              <SupportPortal />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <NotificationFeed />
            </ProtectedRoute>
          }
        />

        {/* Profile Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/details"
          element={
            <ProtectedRoute>
              <PersonalDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/picture"
          element={
            <ProtectedRoute>
              <ProfilePicture />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/notifications"
          element={
            <ProtectedRoute>
              <NotificationPreferences />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ✅ Fallback - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

/* ---------- App Wrapper ---------- */
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}