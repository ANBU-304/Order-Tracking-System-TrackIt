
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, Trash2 } from "lucide-react";
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
    toast.success("Profile picture updated successfully!");
    setTimeout(() => navigate("/profile"), 500);
  };

  const handleRemove = () => {
    setSelectedImage(null);
    toast.success("Profile picture removed");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="mb-6 animate-slide-in">
          <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Profile Picture
          </h1>
          <p className="text-gray-600">Upload or change your profile picture</p>
        </div>

        {/* Current Picture */}
        <Card className="border-0 shadow-xl mb-6 overflow-hidden animate-scale-in">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
          <CardHeader>
            <CardTitle className="">Current Picture</CardTitle>
            <CardDescription className="">
              This is how others will see you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              {selectedImage ? (
                <div className="relative group">
                  <img
                    src={selectedImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                  <button
                    onClick={handleRemove}
                    className="absolute top-0 right-0 w-10 h-10 bg-red-500 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg text-4xl font-bold">
                  {user?.name?.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <p className="mt-4 font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="border-0 shadow-xl mb-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-success"></div>
          <CardHeader>
            <CardTitle className="">Upload New Picture</CardTitle>
            <CardDescription className="">
              JPG, PNG or GIF. Max size 5MB
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
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
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
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">
                  {isDragging
                    ? "Drop your image here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-600">
                  Supported formats: JPG, PNG, GIF
                </p>
              </label>
            </div>

            {/* Camera Option */}
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Camera feature coming soon!")}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take a Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gradient-primary hover:opacity-90"
            onClick={handleSave}
            disabled={!selectedImage}
          >
            <Upload className="w-4 h-4 mr-2" />
            Save Picture
          </Button>
        </div>

      </div>
    </div>
  );
}
