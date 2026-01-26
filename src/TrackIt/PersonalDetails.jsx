import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
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
    toast.success("Profile updated successfully!");
  };

  // ✅ JSX-safe version (NO types)
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-2xl font-bold">
            Personal Details
          </h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Basic Information */}
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Your name and contact details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange("firstName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                <Input
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
                <Input
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                />
              </div>

              <Input
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
