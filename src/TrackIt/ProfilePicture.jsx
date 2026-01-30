import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, Trash2, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function ProfilePicture() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success("Identity profile updated in terminal database");
    setTimeout(() => navigate("/profile"), 500);
  };

  const handleRemove = () => {
    setSelectedImage(null);
    toast.success("Profile image cleared");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Themed Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Command Center</span>
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            Identity <span className="text-yellow-500">Image</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            Security Protocol / Upload biometric identification
          </p>
        </div>

        {/* Current Picture Status */}
        <Card className="border-none shadow-sm mb-6 overflow-hidden bg-white rounded-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">Active Visual ID</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
              Current state of your digital identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              {selectedImage ? (
                <div className="relative group">
                  <img
                    src={selectedImage}
                    alt="Profile"
                    className="w-40 h-40 rounded-2xl object-cover shadow-2xl ring-4 ring-slate-100"
                  />
                  <button
                    onClick={handleRemove}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-red-700 transition-all scale-0 group-hover:scale-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-yellow-400 shadow-xl ring-4 ring-slate-100">
                  <span className="text-5xl font-black mb-1">
                    {user?.name?.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-yellow-600/50">System Initials</p>
                </div>
              )}
              <div className="mt-6 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">{user?.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-xs font-mono text-slate-400">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terminal Upload Section */}
        <Card className="border-none shadow-sm mb-8 overflow-hidden bg-white rounded-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-500"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">New Image Data</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
              Accepted formats: JPG, PNG, GIF / Max size: 5.0MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                isDragging
                  ? "border-yellow-500 bg-yellow-50/50"
                  : "border-slate-200 hover:border-yellow-400 hover:bg-slate-50/50"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">
                  {isDragging
                    ? "Release to Import Data"
                    : "Select File or Drag & Drop"}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Local Terminal Import
                </p>
              </label>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-widest h-12 rounded-xl"
                onClick={() => toast.info("Terminal camera access restricted for maintenance")}
              >
                <Camera className="w-4 h-4 mr-2" />
                Initiate Terminal Camera
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest h-14 rounded-xl"
            onClick={() => navigate("/profile")}
          >
            Abort Changes
          </Button>
          <Button
            className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-xl shadow-slate-200 disabled:opacity-50"
            onClick={handleSave}
            disabled={!selectedImage}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Commit Image to Database
          </Button>
        </div>

      </div>
    </div>
  );
}