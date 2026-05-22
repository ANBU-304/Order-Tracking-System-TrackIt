import { useState, useEffect } from "react";
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
  ShieldCheck,
  Loader2
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { useAuth } from "./useAuth";
import { Layout } from "./Layout";
import { profileService } from "../services/profileService";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile data from backend
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.email) {
        try {
          setLoading(true);
          const result = await profileService.loginByEmail(user.email);
          
          if (result.success) {
            setProfileData(result.data);
          } else {
            console.log("No profile found, user may need to create one");
          }
        } catch (error) {
          console.error("Error loading profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.email]);

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

  // Get user name from profile data or fallback to auth user
  const displayName = profileData 
    ? `${profileData.firstName} ${profileData.lastName}`
    : user?.name || "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    
    // Navigate to login
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Layout />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-slate-900 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Loading Profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

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
              Account Management / Terminal ID: {profileData?.id?.slice(-8) || user?.id || 'AUTH-001'}
            </p>
          </div>

          {/* User Hero Card */}
          <Card className="mb-8 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="h-2 w-full bg-slate-900" />
            <CardContent className="pt-8 pb-8 flex flex-col sm:flex-row items-center gap-8 px-8">
              

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                    {displayName}
                  </h2>
                  <ShieldCheck className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-slate-500 font-mono font-medium">
                  {profileData?.email || user?.email}
                </p>
                
                {/* Additional Info from Backend */}
                {profileData?.phoneNumber && (
                  <p className="text-slate-400 font-mono text-sm mt-1">
                    {profileData.phoneNumber}
                  </p>
                )}
                
                {profileData?.geographicData && (
                  <p className="text-slate-400 text-sm mt-1">
                    {profileData.geographicData.city}, {profileData.geographicData.state}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Role: {profileData?.securityClearanceLevel || user?.role || 'Customer'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Status: Verified
                  </span>
                  {profileData?.createdAt && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      Member Since: {new Date(profileData.createdAt).getFullYear()}
                    </span>
                  )}
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

          {/* Profile Completeness Warning */}
          {!profileData && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50 rounded-2xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-yellow-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-yellow-900 uppercase text-sm tracking-tight mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-xs text-yellow-700 font-medium">
                    Add your personal details to unlock all features and improve your experience.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/profile/details")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl px-6"
                >
                  Complete Now
                </Button>
              </CardContent>
            </Card>
          )}

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
                    <p className="text-xs font-medium text-red-400">
                      End current session
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Summary (if data exists) */}
          {profileData?.geographicData && (
            <Card className="mt-8 border-none shadow-sm bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Registered Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="font-medium">{profileData.geographicData.street}</p>
                  <p>
                    {profileData.geographicData.city}, {profileData.geographicData.state} {profileData.geographicData.zipCode}
                  </p>
                  <p>{profileData.geographicData.country}</p>
                </div>
              </CardContent>
            </Card>
          )}
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
              <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Terminate Session?
              </CardTitle>
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
                onClick={handleLogout}
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