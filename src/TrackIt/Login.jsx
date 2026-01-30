import { useState,} from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle, ShieldCheck, User, KeyRound
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export default function Login() {
  const [mode, setMode] = useState("login"); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const success = await auth.login(email, password);
        if (success) {
          toast.success("Welcome back!");
          navigate("/dashboard");
        } else {
          toast.error("Invalid credentials");
        }
      } else if (mode === "signup") {
        // Logic for New Customer
        toast.success("Account created! Please login.");
        setMode("login");
      } else {
        // Forgot password / OTP Logic
        toast.success("OTP sent to " + email);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950">
      {/* Background with LIGHTER Overlay to show image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/6994138/pexels-photo-6994138.jpeg"
          alt="Logistics"
          className="w-full h-full object-cover opacity-50" // Increased opacity of image
        />
        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6 text-white">
          <div className="flex items-center gap-4 mb-6">
           
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Track<span className="text-yellow-400">It</span>
            </h1>
          </div>
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter">
            THE GLOBAL <br /> <span className="text-yellow-400">STANDARD.</span>
          </h2>
          <p className="text-slate-200 text-lg font-medium opacity-80 max-w-sm">
            Professional logistics tracking for enterprise and individual shipments.
          </p>
        </div>

        {/* Right Side - Auth Card */}
        <div className="animate-in fade-in zoom-in duration-500">
          <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
            <div className="bg-slate-900 px-8 py-8 text-white relative">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">
                {mode === 'login' ? 'Secure Login' : mode === 'signup' ? 'Create Account' : 'Reset Access'}
              </CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                {mode === 'login' ? 'Personnel & Customer Portal' : 'New Customer Registration'}
              </CardDescription>
              <div className="absolute top-0 right-0 w-1.5 h-full bg-yellow-400"></div>
            </div>
            
            <CardContent className="p-8">
              <form onSubmit={handleAuth} className="space-y-4">
                
                {/* Name field only for Sign Up */}
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-500">Full Name</Label>
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
                  <Label className="text-[10px] font-black uppercase text-slate-500">Email Address</Label>
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

                {/* Password field hidden for Forgot Password mode */}
                {mode !== 'forgot' && (
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-500">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 h-11 border-slate-200 focus:ring-yellow-400" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password Link (Only in login mode) */}
                {mode === 'login' && (
                  <div className="text-right">
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-black uppercase text-slate-400 hover:text-yellow-600 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg group">
                  {isLoading ? "Processing..." : mode === 'login' ? "Sign In" : mode === 'signup' ? "Create Account" : "Get OTP"}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              {/* Toggle Between Login and Sign Up (Customers) */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
                {mode === 'login' ? (
                  <p className="text-xs font-bold text-slate-500">
                    New to TrackIt? 
                    <button onClick={() => setMode('signup')} className="ml-2 text-slate-950 underline decoration-yellow-400 underline-offset-4">
                      Create Customer Account
                    </button>
                  </p>
                ) : (
                  <button onClick={() => setMode('login')} className="text-xs font-bold text-slate-950 flex items-center justify-center mx-auto gap-2">
                    <KeyRound className="w-3 h-3" /> Back to Login
                  </button>
                )}
                
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {mode === 'login' ? 'Authorized Access Only' : 'Customer Registration Only'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}