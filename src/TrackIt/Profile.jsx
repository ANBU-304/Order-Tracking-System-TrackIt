import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  Lock,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Edit2,
  ShieldCheck
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { useAuth } from "./useAuth";
import { Layout } from "./Layout";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      description: "Update your personal information",
      path: "/profile/details",
      color: "text-slate-900",
    },
    {
      icon: Lock,
      label: "Security Access",
      description: "Manage your credentials and password",
      path: "/profile/password",
      color: "text-slate-900",
    },
    {
      icon: Bell,
      label: "Logistics Alerts",
      description: "Manage shipment notifications",
      path: "/profile/notifications",
      color: "text-slate-900",
    },
    {
      icon: SettingsIcon,
      label: "System Settings",
      description: "App configuration and terminal preferences",
      path: "/settings",
      color: "text-slate-900",
    },
  ];

  const initials =
    user?.name?.split(" ").map((n) => n[0]).join("") || "U";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking uppercase">
              User Profile
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              Account Management / Terminal ID: {user?.id || 'AUTH-001'}
            </p>
          </div>

          {/* User Hero Card */}
          <Card className="mb-8 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="h-2 w-full bg-slate-900" />
            <CardContent className="pt-8 pb-8 flex flex-col sm:flex-row items-center gap-8 px-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl bg-slate-900 text-yellow-400 flex items-center justify-center text-4xl font-black shadow-xl ring-4 ring-slate-50 group-hover:scale-105 transition-transform">
                  {initials}
                </div>
                <button
                  onClick={() => navigate("/profile/picture")}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-xl shadow-lg flex items-center justify-center border-4 border-white hover:bg-yellow-500 transition-colors"
                >
                  <Camera className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{user?.name}</h2>
                  <ShieldCheck className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-slate-500 font-mono font-medium">{user?.email}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Role: {user?.role || 'Customer'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Status: Verified
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/profile/details")}
                className="border-slate-200 text-slate-600 font-bold text-xs rounded-xl h-11 px-6 hover:bg-slate-50"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Settings Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card 
                key={item.path}
                className="group cursor-pointer border-none shadow-sm hover:shadow-md transition-all bg-white rounded-2xl overflow-hidden"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-colors duration-300">
                      <item.icon className={`w-6 h-6 ${item.color} group-hover:text-slate-900 transition-colors`} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.label}</h3>
                      <p className="text-xs font-medium text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            ))}

            {/* Logout Card */}
            <Card 
              className="md:col-span-2 group cursor-pointer border-none shadow-sm hover:shadow-md transition-all bg-red-50 rounded-2xl overflow-hidden border-2 border-transparent hover:border-red-100"
              onClick={() => setShowLogoutModal(true)} 
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <LogOut className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-red-600 uppercase text-sm tracking-tight">Logout</h3>
                   
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="h-2 w-full bg-red-600" />
            <CardHeader className="text-center pt-8">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Terminate Session?</CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pt-2">
                All unsaved logistics data may be lost
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 pb-8 px-8">
              <Button 
                variant="outline"
                className="flex-1 border-slate-200 font-bold rounded-xl h-12"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-bold rounded-xl h-12"
                onClick={() => navigate("/login")}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}