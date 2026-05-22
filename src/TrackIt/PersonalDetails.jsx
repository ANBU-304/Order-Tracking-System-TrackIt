// src/components/PersonalDetails.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { useAuth } from "./useAuth";
import { profileService } from "../services/profileService";
import { toast } from "sonner";
import { Layout } from "./Layout";

export function PersonalDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        toast.error("Please login to access your profile");
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        // Fetch profile from MongoDB
        const profileData = await profileService.getUserProfile(user.email);
        
        if (profileData) {
          // Profile exists in MongoDB
          setFormData({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            email: profileData.email || user.email,
            phone: profileData.phoneNumber || "",
            address: profileData.geographicData?.street || "",
            city: profileData.geographicData?.city || "",
            state: profileData.geographicData?.state || "",
            zipCode: profileData.geographicData?.zipCode || "",
            country: profileData.geographicData?.country || "",
          });
          setIsNewProfile(false);
        } else {
          // Profile doesn't exist in MongoDB - create new
          const nameParts = (user.name || user.username || "").split(" ");
          setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          });
          setIsNewProfile(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to basic user data
        const nameParts = (user.name || user.username || "").split(" ");
        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
        setIsNewProfile(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  // Save user profile data to backend
  const handleSave = async () => {
    // Validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsSaving(true);
    try {
      const result = await profileService.updateUserProfile(user.email, formData);
      
      if (result.success) {
        // Update local storage with new user data
        const updatedUser = {
          ...user,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        };
        localStorage.setItem("trackitUser", JSON.stringify(updatedUser));
        
        setIsNewProfile(false);
        
        if (result.created) {
          toast.success("Profile created successfully! 🎉");
        } else {
          toast.success("Profile updated successfully! ✨");
        }
      } else {
        toast.error(result.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Layout />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading profile data...</p>
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
          {/* Back Navigation */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Profile</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Account <span className="text-yellow-500">Details</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Security clearance level: {user?.role || "customer"}
            </p>
            
            {/* New Profile Alert */}
            {isNewProfile && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-semibold text-sm">New Profile Detected</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Please fill in your details and click "Create Profile" to save your information.
                  </p>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            {/* Identity Profile Card */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-slate-900" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-2.5 rounded-xl">
                    <User className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">
                      Identity Profile
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Personal identification and contact nodes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 transition-all font-mono text-sm"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Last Name
                    </Label>
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 transition-all font-mono text-sm"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Primary Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        className="rounded-xl border-slate-200 bg-slate-200 pl-10 font-mono text-sm cursor-not-allowed text-slate-600"
                        value={formData.email}
                        disabled
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono">
                      ⚠️ Email is linked to your account and cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Contact Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input
                        type="tel"
                        className="rounded-xl border-slate-200 bg-slate-50 pl-10 focus:bg-white focus:border-yellow-400 font-mono text-sm"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 8925733008"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Data Card */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-yellow-500" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-50 p-2.5 rounded-xl">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">
                      Geographic Data
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Standard shipping and billing node
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Street Address
                  </Label>
                  <Input
                    className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 font-mono text-sm"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="9b street, kokila colony, avinashi nagar, madurai central"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      City
                    </Label>
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 font-mono text-sm"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="madurai"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      State
                    </Label>
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 font-mono text-sm"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="Tamil Nadu"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Zip Code
                    </Label>
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 font-mono text-sm"
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      placeholder="641009"
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Country
                    </Label>
                    <Input
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-yellow-400 font-mono text-sm"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="Republic of India"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest h-14 rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => navigate("/profile")}
              >
                Discard Changes
              </Button>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-xl shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isNewProfile ? "Creating Profile..." : "Saving Changes..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isNewProfile ? "Create Profile" : "Commit To Database"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}