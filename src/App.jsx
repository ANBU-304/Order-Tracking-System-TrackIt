
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./TrackIt/useAuth";
import { AuthProvider } from "./TrackIt/AuthContext";

import {Navigation} from "./TrackIt/Navigation";

import Login from "./TrackIt/Login";
import {PublicTracking} from "./TrackIt/PublicTracking";
import {OrderDetails} from "./TrackIt/OrderDetails";
import DashboardRouter from "./TrackIt/DashboardRouter";

import Profile from "./TrackIt/Profile";
import {PersonalDetails} from "./TrackIt/PersonalDetails";
import { ProfilePicture} from "./TrackIt/ProfilePicture";
import ChangePassword from "./TrackIt/ChangePassword";
import NotificationPreferences from "./TrackIt/NotificationPreferences";
import Settings from "./TrackIt/Settings";

import {HelpCenter} from "./TrackIt/HelpCenter";
import ContactSupport from "./TrackIt/ContactSupport";
import ReportIssue from "./TrackIt/ReportIssue";

import { Toaster } from "sonner";
import "./index.css";
import { SupportPortal } from "./TrackIt/SupportPortal";
import { NotificationFeed } from "./TrackIt/NotificationFeed";

/* ---------- Protected Route ---------- */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/* ---------- App Routes ---------- */
function AppRoutes() {
  return (
    <>
      <Navigation />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="dashboard/support" element={<SupportPortal/>} />
        <Route path="/support/contact" element={<ContactSupport />} />
        <Route path="/support/report" element={<ReportIssue />} />
<Route path="/notification" element={<NotificationFeed/>} />
        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

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

        {/* Fallback */}
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
