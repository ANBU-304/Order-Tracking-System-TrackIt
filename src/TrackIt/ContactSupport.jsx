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
       <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/help')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Help Center</span>
        </button>

        {/* Header */}
        <div className="mb-6 animate-slide-in">
          <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Contact Support</h1>
          <p className="text-gray-600">Choose how you'd like to reach us</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-4">
            {contactMethods.map((method, index) => (
              <Card
                key={method.id}
                className={`border-0 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden animate-scale-in ${
                  activeMethod === method.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveMethod(method.id)}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${method.color}`}></div>
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{method.title}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            ))}

            {/* Business Hours */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Mon - Fri: 9am - 6pm EST</p>
                  <p>Sat - Sun: 10am - 4pm EST</p>
                  <p className="text-green-600 font-medium mt-2">• Currently Online</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {activeMethod === 'email' && (
              <Card className="border-0 shadow-xl overflow-hidden animate-fade-in">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'll respond within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tracking">Tracking Issue</SelectItem>
                          <SelectItem value="delivery">Delivery Problem</SelectItem>
                          <SelectItem value="account">Account Support</SelectItem>
                          <SelectItem value="returns">Returns & Refunds</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                      <Input
                        id="orderNumber"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                        placeholder="TRK123456789"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Provide details about your issue..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeMethod === 'chat' && (
              <Card className="border-0 shadow-xl overflow-hidden animate-fade-in h-[600px] flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
                <CardHeader>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Connect with a support agent</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Start a conversation</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Average wait time: 2 minutes
                      </p>
                      <Button className="gradient-primary hover:opacity-90">
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeMethod === 'phone' && (
              <Card className="border-0 shadow-xl overflow-hidden animate-fade-in">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-info"></div>
                <CardHeader>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Speak directly with our team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-20 h-20 gradient-info rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Phone className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">1-800-TRACKIT</h3>
                    <p className="text-gray-600 mb-6">
                      Our support team is available to assist you
                    </p>
                    <div className="space-y-3 max-w-sm mx-auto">
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">US & Canada</p>
                        <p className="font-semibold">1-800-872-2548</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">International</p>
                        <p className="font-semibold">+1-415-555-0123</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-6">
                      Monday - Friday: 9am - 6pm EST<br />
                      Saturday - Sunday: 10am - 4pm EST
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
}
