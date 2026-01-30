import { useState } from "react";
import { Bell, Package, AlertCircle } from "lucide-react";

export function NotificationFeed() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Package #8829 Delivered", icon: <Package size={14} /> },
    { id: 2, text: "System Update Complete", icon: <AlertCircle size={14} /> },
  ];

  return (
    <div className="relative">
      {/* The Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-200 rounded-full transition-colors relative"
      >
        <Bell size={20} className="text-slate-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>

      {/* The Pop-up Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-lg z-50">
          <div className="p-3 border-b font-bold text-xs uppercase tracking-wider text-slate-500">
            Notifications
          </div>
          <div className="py-2">
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-slate-50 flex items-center gap-3 cursor-pointer border-b border-slate-50 last:border-0">
                <div className="text-blue-500">{n.icon}</div>
                <span className="text-xs text-slate-700">{n.text}</span>
              </div>
            ))}
          </div>
          <button className="w-full p-2 text-[10px] text-center text-slate-400 hover:text-slate-600 uppercase font-bold bg-slate-50">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}