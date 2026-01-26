import { useState } from 'react';
import { Search, Package, Truck, MapPin, CheckCircle2, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackMethod, setTrackMethod] = useState('orderId'); // orderId, mobile
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        navigate(`/order/${trackingNumber}`);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      {/* HERO SECTION */}
      <main className="grow">
       <div className="bg-linear-to-br from-indigo-200/80 via-white/50 to-violet-200/80">
       
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left Column: Text & Illustration */}
            <div className="flex-1 space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Track your <br />
               <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">orders easily</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg">
                Just enter your Mobile Number or Order ID & it's done.
              </p>
              
              {/* Illustration Placeholder */}
              <div className="pt-8 relative">
                 <div className="flex items-end gap-4 opacity-80">
                    <div className="w-16 h-12 bg-orange-200 rounded-md"></div>
                    <div className="w-24 h-16 bg-orange-300 rounded-md"></div>
                    <div className="relative">
                       <MapPin className="w-16 h-16 text-pink-500 mb-2" />
                       <div className="w-32 h-6 bg-indigo-200 rounded-full blur-sm"></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Tracking Card */}
            <div className="flex-1 w-full max-w-md">
              <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-slate-800">Track By:</span>
                    <div className="flex gap-4">
                      {[ 'Order Id', 'Mobile Number'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
                          <input 
                            type="radio" 
                            name="trackType" 
                            checked={trackMethod === type.replace(' ', '').toLowerCase()}
                            onChange={() => setTrackMethod(type.replace(' ', '').toLowerCase())}
                            className="accent-indigo-600"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      placeholder={trackMethod === 'mobile' ? "Enter Mobile Number" : "Enter Order ID"} 
                      className="bg-gray-50 border-gray-100 h-14 rounded-xl focus:ring-indigo-500"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                    {trackMethod === 'orderid' && (
                      <Input 
                        placeholder="Phone No." 
                        className="bg-gray-50 border-gray-100 h-14 rounded-xl focus:ring-indigo-500"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    )}
                    <Button 
  onClick={handleTrack}
  className="w-full h-14 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200"
>
  {isSearching ? 'Tracking...' : 'Track Now'}
</Button>
                  </div>

                  
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        {/* Keeping your existing Features Grid below the Hero */}
        <div className="max-w-7xl mx-auto px-4 py-20">
             {/* ... (Rest of your existing features code) ... */}
              <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Why Choose Our Tracking System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Real-Time Tracking Card */}
  <Card className="hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden hover:-translate-y-1 relative h-full">
    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 to-purple-500 z-20"></div>
    {/* Image Header */}
    <div className="h-48 overflow-hidden relative">
      <img 
        src="https://images.pexels.com/photos/9594428/pexels-photo-9594428.jpeg" 
        alt="Real-time Tracking" 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      <div className="absolute bottom-4 left-6 w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg z-10">
        <Package className="w-6 h-6 text-white" />
      </div>
    </div>
    
    <CardHeader className="pb-6 relative z-10 bg-white">
      <CardTitle className="text-xl">Real-Time Tracking</CardTitle>
      <CardDescription className="text-base text-gray-600">
        Get instant updates on your package location and delivery status with live GPS tracking
      </CardDescription>
    </CardHeader>
  </Card>

  {/* Multiple Carriers Card */}
  <Card className="hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden hover:-translate-y-1 relative h-full">
    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-teal-500 z-20"></div>
    {/* Image Header */}
    <div className="h-48 overflow-hidden relative">
      <img 
        src="https://images.pexels.com/photos/9754798/pexels-photo-9754798.jpeg" 
        alt="Multiple Carriers" 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      <div className="absolute bottom-4 left-6 w-12 h-12 bg-linear-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg z-10">
        <Truck className="w-6 h-6 text-white" />
      </div>
    </div>

    <CardHeader className="pb-6 relative z-10 bg-white">
      <CardTitle className="text-xl">Multiple Carriers</CardTitle>
      <CardDescription className="text-base text-gray-600">
        Track packages from FedEx, UPS, USPS, DHL, and more all in one unified dashboard
      </CardDescription>
    </CardHeader>
  </Card>

  {/* Location History Card */}
  <Card className="hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden hover:-translate-y-1 relative h-full">
    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-cyan-500 z-20"></div>
    {/* Image Header */}
    <div className="h-48 overflow-hidden relative">
      <img 
        src="https://images.pexels.com/photos/5137965/pexels-photo-5137965.jpeg" 
        alt="Location History" 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      <div className="absolute bottom-4 left-6 w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg z-10">
        <MapPin className="w-6 h-6 text-white" />
      </div>
    </div>

    <CardHeader className="pb-6 relative z-10 bg-white">
      <CardTitle className="text-xl">Location History</CardTitle>
      <CardDescription className="text-base text-gray-600">
        View complete journey of your package with detailed timestamps and location data
      </CardDescription>
    </CardHeader>
  </Card>
</div>
          </div>
           <Card className="border-0 shadow-xl mb-20">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-t-lg py-4">
              <CardTitle className="text-center text-3xl text-white">How It Works</CardTitle>
            </div>
            <CardContent className="pt-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors shadow-lg">
                      <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                        1
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">Enter Tracking Number</h4>
                  <p className="text-gray-600">
                    Enter your unique order ID or tracking number in the search box above
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-linear-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:from-green-200 group-hover:to-teal-200 transition-colors shadow-lg">
                      <div className="w-14 h-14 bg-linear-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                        2
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">Get Real-Time Status</h4>
                  <p className="text-gray-600">
                    View current location, delivery status, and estimated arrival time
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors shadow-lg">
                      <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                        3
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">View Timeline</h4>
                  <p className="text-gray-600">
                    Check complete tracking history with detailed location updates
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-green-200 transition-colors shadow-lg">
                      <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">Receive Updates</h4>
                  <p className="text-gray-600">
                    Get instant notifications when your package is delivered
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-20 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-indigo-100">Packages Tracked Daily</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">99.8%</div>
                <div className="text-indigo-100">Tracking Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-indigo-100">Real-Time Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-indigo-100">Carrier Integrations</div>
              </div>
            </div>
          </div>
        
      
        </div>
      </main>
      
      
      {/* Existing Footer code... */}
       {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                TrackIt
              </h3>
              <p className="text-gray-400 mb-6">
                Your reliable partner for real-time package tracking across multiple carriers worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/anbumani-p-5a1311299/" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/anbumani-p-5a1311299/" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Package</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carriers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="http://localhost:5173/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">support@trackmaster.com</span>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400 text-sm">
                    123 Shipping Street<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} TrackIt. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Real-time tracking data provided by carrier APIs. Accuracy may vary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}