import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Globe,
  Database
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
import { toast } from "sonner";
import { Layout } from "./Layout";

export function PersonalDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Terminal database updated successfully");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
              Security clearance level: Authorized User
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            {/* Basic Information Section */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-slate-900" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-2.5 rounded-xl">
                    <User className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Identity Profile</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Personal identification and contact nodes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Name</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono text-sm"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Name</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono text-sm"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input
                        type="email"
                        className="rounded-xl border-slate-100 bg-slate-50 pl-10 font-mono text-sm"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input
                        className="rounded-xl border-slate-100 bg-slate-50 pl-10 font-mono text-sm"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information Section */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-yellow-500" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-50 p-2.5 rounded-xl">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Geographic Data</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Standard shipping and billing node
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Street Address</Label>
                  <Input
                    className="rounded-xl border-slate-100 bg-slate-50 font-mono text-sm"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">City</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50 font-mono text-sm"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">State</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50 font-mono text-sm"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Zip Code</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50 font-mono text-sm"
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Country</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50 font-mono text-sm"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
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
                className="flex-1 border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest h-14 rounded-xl"
                onClick={() => navigate("/profile")}
              >
                Discard Changes
              </Button>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-xl shadow-slate-200"
              >
                {isSaving ? (
                  <Database className="w-4 h-4 mr-2 animate-pulse" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Syncing Terminal..." : "Commit To Database"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}