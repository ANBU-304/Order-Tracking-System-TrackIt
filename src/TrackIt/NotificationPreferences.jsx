import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Package,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { toast } from "sonner";

export default function NotificationPreferences() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "order-updates",
      title: "Order Updates",
      description: "Get notified about order status changes",
      icon: Package,
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "delivery-updates",
      title: "Delivery Updates",
      description: "Real-time updates when your package is out for delivery",
      icon: CheckCircle2,
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "promotions",
      title: "Promotions & Offers",
      description: "Receive exclusive deals and promotional offers",
      icon: Mail,
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "messages",
      title: "Messages & Support",
      description: "Notifications about support tickets and messages",
      icon: MessageSquare,
      email: true,
      push: true,
      sms: false,
    },
  ]);

  const toggleNotification = (id, type) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, [type]: !n[type] } : n
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Notification preferences updated!");
  };

  return (
     <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="mb-6 animate-slide-in">
          <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Notification Preferences</h1>
          <p className="text-gray-600">Choose how you want to receive notifications</p>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4 mb-6">
          {notifications.map((notification, index) => (
            <Card 
              key={notification.id} 
              className="border-0 shadow-xl overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <notification.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="mb-1">{notification.title}</CardTitle>
                    <CardDescription>{notification.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Email Toggle */}
                  <button
                    onClick={() => toggleNotification(notification.id, 'email')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notification.email 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Mail className={`w-5 h-5 ${notification.email ? 'text-indigo-600' : 'text-gray-400'}`} />
                      {notification.email && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <p className={`font-medium text-sm ${notification.email ? 'text-indigo-600' : 'text-gray-600'}`}>
                      Email
                    </p>
                  </button>

                  {/* Push Toggle */}
                  <button
                    onClick={() => toggleNotification(notification.id, 'push')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notification.push 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Bell className={`w-5 h-5 ${notification.push ? 'text-green-600' : 'text-gray-400'}`} />
                      {notification.push && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className={`font-medium text-sm ${notification.push ? 'text-green-600' : 'text-gray-600'}`}>
                      Push
                    </p>
                  </button>

                  {/* SMS Toggle */}
                  <button
                    onClick={() => toggleNotification(notification.id, 'sms')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notification.sms 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MessageSquare className={`w-5 h-5 ${notification.sms ? 'text-purple-600' : 'text-gray-400'}`} />
                      {notification.sms && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <p className={`font-medium text-sm ${notification.sms ? 'text-purple-600' : 'text-gray-600'}`}>
                      SMS
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl mb-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-info"></div>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage all notifications at once</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, email: true, push: true, sms: true })));
                toast.success('All notifications enabled');
              }}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, email: false, push: false, sms: false })));
                toast.info('All notifications disabled');
              }}
            >
              Disable All
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, email: true, push: false, sms: false })));
                toast.success('Email only mode activated');
              }}
            >
              Email Only
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gradient-primary hover:opacity-90"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
