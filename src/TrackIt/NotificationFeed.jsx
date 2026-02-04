import { useState, useRef, useEffect } from "react";
import { Bell, Package, AlertCircle, Radio, Check } from "lucide-react";

export function NotificationFeed() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { 
      id: 1, 
      text: "Asset #8829-B: Final Delivery Confirmed", 
      time: "2m ago",
      type: "success",
      icon: <Check size={12} className="text-slate-900" /> 
    },
    { 
      id: 2, 
      text: "System: Protocol Update 2.4 Active", 
      time: "14m ago",
      type: "info",
      icon: <Radio size={12} className="text-slate-900" /> 
    },
    { 
      id: 3, 
      text: "Security: Route Exception Detected", 
      time: "1h ago",
      type: "alert",
      icon: <AlertCircle size={12} className="text-white" /> 
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. The Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl transition-all relative group ${
          isOpen ? 'bg-slate-900 text-yellow-400' : ' hover:bg-slate-100 text-slate-500 border border-slate-100'
        }`}
      >
        <Bell size={20} className={`${isOpen ? 'animate-none' : 'group-hover:rotate-12'} transition-transform`} />
        
        {/* Animated Notification Ping */}
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500 border border-white"></span>
        </span>
      </button>

      {/* 2. The Pop-up Terminal Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 px-4 py-3 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              System <span className="text-yellow-400">Notifications</span>
            </h3>
            <span className="text-[9px] font-bold bg-yellow-400 text-slate-900 px-1.5 py-0.5 rounded">
              {notifications.length} NEW
            </span>
          </div>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className="p-4 hover:bg-slate-50 flex items-start gap-4 cursor-pointer border-b border-slate-50 transition-colors last:border-0"
              >
                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'alert' ? 'bg-red-500' : 'bg-yellow-400'
                }`}>
                  {n.icon}
                </div>
                
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-900 leading-tight uppercase tracking-tight">
                    {n.text}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-2 bg-slate-50 border-t border-slate-100 flex gap-2">
            <button className="flex-1 py-2 text-[9px] text-center text-slate-500 hover:text-slate-900 uppercase font-black tracking-widest transition-colors">
              Settings
            </button>
            <div className="w-px h-4 bg-slate-200 self-center"></div>
            <button 
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 text-[9px] text-center text-slate-900 hover:text-yellow-600 uppercase font-black tracking-widest transition-colors"
            >
              Clear Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}