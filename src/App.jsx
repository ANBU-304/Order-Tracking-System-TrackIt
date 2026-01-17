import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./TrackIt/Login";
import AdminDashboard from "./TrackIt/AdminDashboard";
import ContactSupport from "./TrackIt/ContactSupport";
import CustomerDashboard from "./TrackIt/CustomerDashboard";
import DashboardRouter from "./TrackIt/DashboardRouter";
import {HelpCenter} from "./TrackIt/HelpCenter";
import Settings from "./TrackIt/Settings";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {PublicTracking} from "./TrackIt/PublicTracking";
import { AuthContext } from "./TrackIt/auth-context";
import { SupportPortal } from "./TrackIt/SupportPortal";
import { OrderDetails } from "./TrackIt/OrderDetails";
function App() {
  return (
    <AuthContext.Provider value={AuthContext}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/dashboard/*" element={<DashboardRouter />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<PublicTracking />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/support-portal" element={<SupportPortal />} />
      </Routes>
    </BrowserRouter> 
    </AuthContext.Provider> 
  );
}

export default App;
