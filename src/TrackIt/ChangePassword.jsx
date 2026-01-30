import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/Button";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const rules = [
    { label: "At least 8 characters", ok: newPassword.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(newPassword) },
    { label: "Lowercase letter", ok: /[a-z]/.test(newPassword) },
    { label: "Number", ok: /[0-9]/.test(newPassword) },
    { label: "Special character", ok: /[!@#$%^&*]/.test(newPassword) },
  ];

  const validPassword = rules.every((r) => r.ok);
  const match = newPassword === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert("Security credentials updated successfully.");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate("/profile")} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          {/* Top Branding Bar */}
          <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Security Protocol</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Update Access Credentials</p>
            </div>
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <Lock className="w-5 h-5 text-slate-900" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
              <div className="relative group">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none text-sm font-medium"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none text-sm font-medium"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none text-sm font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {confirmPassword && (
                <div className={`flex items-center gap-2 mt-2 ml-1 transition-all ${match ? 'text-green-600' : 'text-red-500'}`}>
                  {match ? <CheckCircle2 size={12} /> : <X size={12} />}
                  <p className="text-[10px] font-black uppercase tracking-wider">
                    {match ? "Passwords Match" : "Passwords do not match"}
                  </p>
                </div>
              )}
            </div>

            {/* Validation Rules Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Security Requirements</p>
              {rules.map((r, i) => (
                <div key={i} className="flex items-center gap-3 transition-all duration-300">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${r.ok ? 'bg-green-100' : 'bg-slate-200'}`}>
                    {r.ok ? (
                      <CheckCircle2 size={12} className="text-green-600" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </div>
                  <span className={`text-[11px] font-bold tracking-tight transition-colors ${r.ok ? 'text-slate-900' : 'text-slate-400'}`}>
                    {r.label}
                  </span>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={loading || !validPassword || !match || !currentPassword}
              className="w-full h-14 bg-slate-900 text-yellow-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              {loading ? "Processing..." : "Commit Changes"}
            </Button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
          Encrypted Session ID: <span className="text-slate-600">TRK-SEC-77291</span><br/>
          Last changed: 4 months ago
        </p>
      </div>
    </div>
  );
}