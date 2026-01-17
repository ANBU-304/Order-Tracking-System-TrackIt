import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export default function ContactSupport() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeMethod, setActiveMethod] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    category: "",
    message: "",
    orderNumber: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      toast.success("Support ticket created successfully!");
      navigate("/help");
    }, 2000);
  };

  const contactMethods = [
    {
      id: "email",
      icon: Mail,
      title: "Email Support",
      description: "Response within 24 hours",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "chat",
      icon: MessageCircle,
      title: "Live Chat",
      description: "Average wait time: 2 min",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "phone",
      icon: Phone,
      title: "Phone Support",
      description: "1-800-TRACKIT",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  if (showSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-6">
              Your support request has been received.
            </p>

            <Button
              onClick={() => navigate("/help")}
              className="w-full bg-indigo-600 text-white"
            >
              Back to Help Center
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        <button
          onClick={() => navigate("/help")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Help Center
        </button>

        <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
        <p className="text-gray-600 mb-6">Choose how you'd like to reach us</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {contactMethods.map((method) => (
              <Card
                key={method.id}
                onClick={() => setActiveMethod(method.id)}
                className={`cursor-pointer border ${
                  activeMethod === method.id ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <method.icon className="w-6 h-6 mb-2" />
                  <h3 className="font-semibold">{method.title}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            {activeMethod === "email" && (
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'll respond within 24 hours</CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />

                    <Input
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />

                    <Textarea
                      placeholder="Message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />

                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
