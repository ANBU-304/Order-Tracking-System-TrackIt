// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

const getRedirectPath = (role) => {
  const normalizedRole = (role || "customer").toLowerCase().trim();
  switch (normalizedRole) {
    case "admin":
      return "/admin/dashboard";
    case "support":
      return "/support/dashboard";
    case "customer":
      return "/customer/dashboard";
    default:
      console.warn(`Unknown role: "${role}", defaulting to customer`);
      return "/customer/dashboard";
  }
};

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const result = await login(email, password);

        if (result.success) {
          const role = result.user?.role;
          const redirectPath = getRedirectPath(role);
          toast.success(`Welcome back, ${result.user?.name || "User"}!`);
          setTimeout(() => navigate(redirectPath, { replace: true }), 500);
        } else {
          toast.error(result.message || "Invalid credentials");
        }
      } else if (mode === "signup") {
        if (!name.trim()) {
          toast.error("Please enter your full name");
          setIsLoading(false);
          return;
        }
        const result = await register(name, email, password, "customer");
        if (result.success) {
          toast.success("Account created successfully! Logging you in...");
          const redirectPath = getRedirectPath(result.user?.role || "customer");
          setTimeout(() => navigate(redirectPath, { replace: true }), 1500);
        } else {
          toast.error(result.message || "Registration failed");
        }
      } else if (mode === "forgot") {
        if (!email.trim()) {
          toast.error("Please enter your email address");
          setIsLoading(false);
          return;
        }
        const result = await forgotPassword(email);
        if (result.success) {
          toast.success(
            "If this email exists, a new password has been sent. Please check your inbox."
          );
          setTimeout(() => {
            setMode("login");
            setEmail("");
          }, 2000);
        } else {
          toast.error(result.message || "Request failed, please try later.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    if (mode === "forgot") {
      return (
        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-slate-500">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="email"
              placeholder="name@email.com"
              className="pl-10 h-11 border-slate-200 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
      );
    }

    return (
      <>
        {mode === "signup" && (
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-slate-500">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="John Doe"
                className="pl-10 h-11 border-slate-200 focus:ring-yellow-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-slate-500">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="email"
              placeholder="name@email.com"
              className="pl-10 h-11 border-slate-200 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-slate-500">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 h-11 border-slate-200 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {mode === "login" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setPassword("");
              }}
              className="text-[10px] font-black uppercase text-slate-400 hover:text-yellow-600 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6994138/pexels-photo-6994138.jpeg"
          alt="Logistics"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left branding */}
        <div className="hidden lg:block space-y-6 text-white">
          <div className="flex items-center gap-4 mb-6">
            <Package className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Track<span className="text-yellow-400">It</span>
            </h1>
          </div>
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter">
            THE GLOBAL <br /> <span className="text-yellow-400">STANDARD.</span>
          </h2>
          <p className="text-slate-200 text-lg font-medium opacity-80 max-w-sm">
            Professional logistics tracking for enterprise and individual
            shipments.
          </p>
        </div>

        {/* Right – Auth Card */}
        <div className="animate-in fade-in zoom-in duration-500">
          <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
            <div className="bg-slate-900 px-8 py-8 text-white relative">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">
                {mode === "login"
                  ? "Secure Login"
                  : mode === "signup"
                  ? "Create Account"
                  : "Reset Password"}
              </CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                {mode === "login"
                  ? "Personnel & Customer Portal"
                  : mode === "signup"
                  ? "New Customer Registration"
                  : "Password Recovery"}
              </CardDescription>
              <div className="absolute top-0 right-0 w-1.5 h-full bg-yellow-400"></div>
            </div>

            <CardContent className="p-8">
              <form onSubmit={handleAuth} className="space-y-4">
                {renderFormFields()}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In"
                    : mode === "signup"
                    ? "Create Account"
                    : "Send Reset Link"}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
                {mode === "login" ? (
                  <p className="text-xs font-bold text-slate-500">
                    New to TrackIt?
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setEmail("");
                        setPassword("");
                        setName("");
                      }}
                      className="ml-2 text-slate-950 underline decoration-yellow-400 underline-offset-4"
                    >
                      Create Customer Account
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setEmail("");
                      setPassword("");
                      setName("");
                    }}
                    className="text-xs font-bold text-slate-950 flex items-center justify-center mx-auto gap-2 hover:text-yellow-600 transition-colors"
                  >
                    <KeyRound className="w-3 h-3" /> Back to Login
                  </button>
                )}

                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {mode === "login"
                    ? "Authorized Access Only"
                    : mode === "signup"
                    ? "Customer Registration Only"
                    : "Password Recovery"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}