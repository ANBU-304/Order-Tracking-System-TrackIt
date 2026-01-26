import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  CheckCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser notifications are supported
    setIsNotificationSupported("Notification" in window);
  }, []);

  const requestNotificationPermission = async () => {
    if (!isNotificationSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const showBrowserNotification = (title, message) => {
    if (!isNotificationSupported || Notification.permission !== "granted") {
      return;
    }

    const notification = new Notification(title, {
      body: message,
      icon: "/favicon.ico", // Add your app icon path
      badge: "/favicon.ico",
      tag: "login-success", // Prevents duplicate notifications
      requireInteraction: true, // Stays until user interacts
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const success = await auth.login(email, password);

      if (success) {
        // Request notification permission if not already granted
        if (isNotificationSupported && Notification.permission === "default") {
          await requestNotificationPermission();
        }

        // Show browser notification
        showBrowserNotification(
          "Login Successful!",
          `Welcome back to TrackIt! You have successfully logged in.`
        );

        // Show toast for immediate feedback
        toast.success("Login successful! Redirecting...", {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        });

        // Add a slight delay before redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Invalid email or password", {
          description: "Please check your credentials and try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword("demo123");
    
    // Auto submit after a brief delay
    setTimeout(() => {
      handleLogin(new Event('submit'));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-10">
            <div className="relative">
              <div className="gradient-primary p-4 rounded-2xl shadow-lg">
                <Package className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TrackIt Pro
              </h1>
              <p className="text-gray-600 mt-1">Enterprise Order Tracking System</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Secure Access to Your<br />Shipping Dashboard
            </h2>
            <p className="text-gray-600 text-lg">
              Sign in to monitor shipments, track deliveries, and manage logistics operations with enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">256-bit</div>
              </div>
              <div className="text-sm text-gray-600">End-to-end encryption</div>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">24/7</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
              </div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-10 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-green-200">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">Secure Login</div>
                <div className="text-xs text-green-600">
                  Your credentials are protected with industry-standard security protocols
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-scale-in">
          <Card className="border-0 shadow-2xl overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
              <CardDescription className="text-indigo-100">
                Sign in to your TrackIt account
              </CardDescription>
            </div>
            
            <CardContent className="pt-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <a 
                      href="#" 
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Keep me signed in for 30 days
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Demo Section */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm font-medium text-gray-500">
                      Quick Demo Access
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    onClick={() => demoLogin("demo@trackit.com")}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Try Demo Account
                    </div>
                  </Button>
                  
                  <p className="mt-3 text-xs text-center text-gray-500">
                    Demo credentials will be automatically filled
                  </p>
                </div>
              </div>

             

              
            </CardContent>
          </Card>

          {/* Security Footer */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL Secured</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}