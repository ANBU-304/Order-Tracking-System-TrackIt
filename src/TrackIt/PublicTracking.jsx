import { useState } from 'react';
import { Search, Package, Award, Truck, MapPin, CheckCircle2, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackMethod, setTrackMethod] = useState('orderid'); // orderid, mobilenumber
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // Define testimonials array here
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Store Owner',
      content: 'TrackIt has reduced my customer service queries by 70%. The real-time tracking is incredibly accurate.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Logistics Manager',
      content: 'Managing multiple carriers was a nightmare. TrackIt unified everything into one simple dashboard.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Small Business Owner',
      content: 'The mobile app notifications keep me updated without constantly checking. Game changer!',
      rating: 4,
      avatar: 'ER'
    },
  ];

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        navigate(`/order/${trackingNumber}`);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      {/* HERO SECTION */}
      
      <main className="grow">
        <div className="bg-gradient-to-br from-yellow-100 via-white to-amber-50">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left Column: Text & Illustration */}
            <div className="flex-1 space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Track your <br />
                <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">orders easily</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg border-l-4 border-yellow-400 pl-4">
                Just enter your Mobile Number or Order ID & it's done.
              </p>
              
              {/* Illustration Placeholder */}
              <div className="pt-8 relative">
                <div className="flex items-end gap-4 opacity-90">
                  <div className="w-16 h-12 bg-yellow-200 rounded-md shadow-sm"></div>
                  <div className="w-24 h-16 bg-yellow-400 rounded-md shadow-md"></div>
                  <div className="relative">
                    <MapPin className="w-16 h-16 text-slate-800 mb-2" />
                    <div className="w-32 h-6 bg-yellow-400/30 rounded-full blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tracking Card */}
            <div className="flex-1 w-full max-w-md">
              <Card className="shadow-[0_20px_50px_rgba(234,179,8,0.15)] border-0 rounded-3xl overflow-hidden bg-white ring-1 ring-yellow-100">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-slate-800">Track By:</span>
                    <div className="flex gap-4">
                      {['orderid', 'mobilenumber'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
                          <input 
                            type="radio" 
                            name="trackType" 
                            checked={trackMethod === type}
                            onChange={() => setTrackMethod(type)}
                            className="w-4 h-4 accent-yellow-500"
                          />
                          {type === 'orderid' ? 'Order ID' : 'Mobile Number'}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      placeholder={trackMethod === 'mobilenumber' ? "Enter Mobile Number" : "Enter Order ID"} 
                      className="bg-gray-50 border-gray-100 h-14 rounded-xl focus:ring-yellow-500 focus:border-yellow-500"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    {trackMethod === 'orderid' && (
                      <Input 
                        placeholder="Phone No." 
                        className="bg-gray-50 border-gray-100 h-14 rounded-xl focus:ring-yellow-500 focus:border-yellow-500"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    )}
                    <Button 
                      onClick={handleTrack}
                      disabled={isSearching}
                      className={`w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-lg font-bold rounded-xl shadow-lg shadow-yellow-200 transition-all duration-200 ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSearching ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Tracking...
                        </div>
                      ) : 'Track Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Why Choose Our Tracking System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Real-Time Tracking Card */}
              <Card className="hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden hover:-translate-y-1 relative h-full ring-1 ring-gray-100">
                <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400 z-20"></div>
                {/* Image Header */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/9594428/pexels-photo-9594428.jpeg" 
                    alt="Real-time Tracking" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-yellow-900/10 group-hover:bg-transparent transition-colors"></div>
                  
                </div>
                
                <CardHeader className="pb-6 relative z-10 bg-white">
                  <CardTitle className="text-xl">Real-Time Tracking</CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Get instant updates on your package location and delivery status with live GPS tracking
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Multiple Carriers Card */}
              <Card className="hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden hover:-translate-y-1 relative h-full ring-1 ring-gray-100">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 z-20"></div>
                {/* Image Header */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/9754798/pexels-photo-9754798.jpeg" 
                    alt="Multiple Carriers" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-amber-900/10 group-hover:bg-transparent transition-colors"></div>
                 
                </div>

                <CardHeader className="pb-6 relative z-10 bg-white">
                  <CardTitle className="text-xl">Multiple Carriers</CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Track packages from FedEx, UPS, USPS, DHL, and more all in one unified dashboard
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Location History Card */}
              <Card className="hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden hover:-translate-y-1 relative h-full ring-1 ring-gray-100">
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 z-20"></div>
                {/* Image Header */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/5137965/pexels-photo-5137965.jpeg" 
                    alt="Location History" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                  
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
          
          {/* How It Works Section */}
          <Card className="border-0 shadow-xl mb-20 overflow-hidden ring-1 ring-gray-100">
            <div className="bg-yellow-50 py-6">
              <CardTitle className="text-center text-3xl text-black-400">How It Works</CardTitle>
            </div>
            <CardContent className="pt-12 pb-12 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors shadow-sm">
                      <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 text-2xl font-bold shadow-md">
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
                    <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors shadow-sm">
                      <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 text-2xl font-bold shadow-md">
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
                    <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors shadow-sm">
                      <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 text-2xl font-bold shadow-md">
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
                    <div className="w-20 h-20  bg-yellow-50  rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors shadow-sm">
                      <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-400 shadow-md">
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

          {/* Testimonials */}
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Loved by Businesses Worldwide
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                See what our users say about their tracking experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ring-1 ring-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold shadow-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${
                          i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'
                        }`} />
                      ))}
                    </div>
                    <p className="text-slate-700 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-yellow-400 rounded-2xl p-10 mb-20 shadow-xl shadow-yellow-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900 mb-2">50K+</div>
                <div className="text-slate-800 font-medium">Packages Tracked Daily</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900 mb-2">99.8%</div>
                <div className="text-slate-800 font-medium">Tracking Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900 mb-2">24/7</div>
                <div className="text-slate-800 font-medium">Real-Time Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900 mb-2">15+</div>
                <div className="text-slate-800 font-medium">Carrier Integrations</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="bg-slate-900 rounded-3xl p-12 text-center text-white ring-1 ring-slate-800 shadow-2xl">
              <Award className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Tracking Like a Pro
              </h2>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Join 50,000+ businesses that trust TrackIt for their shipping needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-14 rounded-xl focus:ring-yellow-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  onClick={handleSubscribe}
                  className="h-14 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black rounded-xl px-8 transition-transform active:scale-95"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                   <div className="w-4 h-4 bg-slate-950 rounded-sm"></div>
                </div>
                TRACK<span className="text-yellow-400">IT</span>
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Your reliable partner for real-time package tracking across multiple carriers worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/anbumani-p-5a1311299/" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/anbumani-p-5a1311299/" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Track Package</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Carriers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 group-hover:text-white">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 group-hover:text-white">support@trackit.com</span>
                </div>
                <div className="pt-2 border-l-2 border-yellow-400/30 pl-4 mt-4">
                  <p className="text-slate-500 text-sm leading-relaxed">
                    123 Shipping Street<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} TrackIt. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs italic">
              Real-time tracking data provided by carrier APIs. Accuracy may vary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}