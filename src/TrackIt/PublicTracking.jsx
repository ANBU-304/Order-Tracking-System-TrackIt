import { useState } from 'react';
import { Search, Package, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { useNavigate } from 'react-router-dom';

export function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        setIsSearching(false);
        navigate(`/order/${trackingNumber}`);
      }, 800);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Real-time tracking available</span>
          </div>
          <h1 className="text-4xl sm:text-5xl mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your order ID or tracking number to get real-time updates
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-xl border-0 mb-12 animate-scale-in overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter Order ID or Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <Button
                onClick={handleTrack}
                disabled={isSearching || !trackingNumber.trim()}
                className="h-12 px-8 gradient-primary hover:opacity-90 transition-opacity shadow-md"
              >
                {isSearching ? 'Tracking...' : 'Track Order'}
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Example: TRK123456789 or ORD-2024-001
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Real-Time Tracking</CardTitle>
              <CardDescription>
                Get instant updates on your package location and delivery status
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader>
              <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Multiple Carriers</CardTitle>
              <CardDescription>
                Track packages from FedEx, UPS, USPS, DHL, and more in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 cursor-pointer group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader>
              <div className="w-12 h-12 gradient-info rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Location History</CardTitle>
              <CardDescription>
                View complete journey of your package with timestamps
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg text-xl font-bold">
                  1
                </div>
                <h4 className="mb-2">Enter Tracking Number</h4>
                <p className="text-sm text-gray-600">
                  Enter your order or tracking ID
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 gradient-success rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg text-xl font-bold">
                  2
                </div>
                <h4 className="mb-2">Get Real-Time Status</h4>
                <p className="text-sm text-gray-600">
                  See current location and status
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 gradient-info rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg text-xl font-bold">
                  3
                </div>
                <h4 className="mb-2">View Timeline</h4>
                <p className="text-sm text-gray-600">
                  Check complete tracking history
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="mb-2">Receive Updates</h4>
                <p className="text-sm text-gray-600">
                  Get notified on delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}