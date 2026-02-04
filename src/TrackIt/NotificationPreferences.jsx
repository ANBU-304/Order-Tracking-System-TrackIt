import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Package,
  CheckCircle2,
  Settings2,
  Zap
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
import { Layout } from "./Layout";

export default function NotificationPreferences() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "order-updates",
      title: "Logistic Status",
      description: "Real-time updates on shipment tracking and status changes",
      icon: Package,
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "delivery-updates",
      title: "Terminal Arrival",
      description: "Automated alerts when assets reach destination hubs",
      icon: CheckCircle2,
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "promotions",
      title: "System Bulletins",
      description: "Receive updates on new features and service upgrades",
      icon: Zap,
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "messages",
      title: "Command Support",
      description: "Direct notifications from technical support and dispatch",
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
    toast.success("Terminal communication protocols updated");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header & Navigation */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Profile</span>
          </button>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Alert <span className="text-yellow-500">Channels</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Configure communication nodes for real-time telemetry
            </p>
          </div>

          {/* Notification List */}
          <div className="space-y-6 mb-8">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className="border-none shadow-sm bg-white rounded-2xl overflow-hidden relative"
              >
                <div className="h-1.5 w-full bg-slate-900" />
                <CardHeader className="px-8 pt-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <notification.icon className="w-7 h-7 text-slate-900" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">
                        {notification.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                        {notification.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Toggle Buttons */}
                    {[
                      { key: 'email', label: 'Email Node', icon: Mail },
                      { key: 'push', label: 'Push Alert', icon: Bell },
                      { key: 'sms', label: 'SMS Link', icon: MessageSquare }
                    ].map((type) => (
                      <button
                        key={type.key}
                        onClick={() => toggleNotification(notification.id, type.key)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          notification[type.key] 
                            ? 'border-yellow-500 bg-yellow-50/30' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <type.icon className={`w-4 h-4 ${notification[type.key] ? 'text-slate-900' : 'text-slate-300'}`} />
                          <div className={`w-3 h-3 rounded-full ${notification[type.key] ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bg-slate-200'}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${notification[type.key] ? 'text-slate-900' : 'text-slate-400'}`}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest h-14 rounded-xl"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-xl shadow-slate-200"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Synchronizing...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}