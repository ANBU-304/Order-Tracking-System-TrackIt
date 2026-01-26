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
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { useAuth } from "./useAuth";

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
      color: "text-indigo-600",
    },
    {
      icon: Lock,
      label: "Change Password",
      description: "Update your password",
      path: "/profile/password",
      color: "text-green-600",
    },
    {
      icon: Bell,
      label: "Notification Preferences",
      description: "Manage your notifications",
      path: "/profile/notifications",
      color: "text-blue-600",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      description: "App settings and preferences",
      path: "/settings",
      color: "text-purple-600",
    },
  ];

  const initials =
    user?.name?.split(" ").map((n) => n[0]).join("") || "U";

  return (
    
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">My Profile</h1>
        <p className="text-gray-600 mb-6">
          Manage your account settings and preferences
        </p>

        <Card className="mb-6 shadow-xl">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
              <button
                onClick={() => navigate("/profile/picture")}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile/details")}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <Card key={item.path}
              className="cursor-pointer hover:shadow-lg"
              onClick={() => navigate(item.path)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </CardContent>
            </Card>
          ))}

          <Card className="cursor-pointer hover:shadow-lg"
            onClick={() => setShowLogoutModal(true)} >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LogOut className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-600">Logout</h3>
                  <p className="text-sm text-gray-600">
                    Sign out of your account
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </CardContent>
          </Card>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Logout</CardTitle>
              <CardDescription>
                Are you sure you want to logout?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline"
                className="flex-1"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 text-white"
                onClick={() => navigate("/login")}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
