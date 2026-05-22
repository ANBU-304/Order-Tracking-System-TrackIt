import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Search, Eye, AlertCircle, Clock,
  CheckCircle2, ChevronRight, RefreshCw, Loader2, Truck, Box
} from 'lucide-react';

import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Progress } from './ui/Progress';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Layout } from './Layout';

// ✅ Import auth and order service
import { useAuth } from './useAuth';
import orderService from '../services/orderService';
import trackingService from '../services/trackingService';
import { toast } from 'sonner';

// ✅ Updated status configuration to match backend statuses
const getStatusConfig = (status) => {
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_') || 'processing';

  switch (normalizedStatus) {
    case 'delivered':
    case 'completed':
      return {
        label: 'Delivered',
        className: 'bg-slate-900 text-yellow-400',
        icon: CheckCircle2,
        progress: 100
      };
    case 'out_for_delivery':
      return {
        label: 'Out for Delivery',
        className: 'bg-yellow-400 text-slate-900',
        icon: Truck,
        progress: 85
      };
    case 'in_transit':
    case 'on_the_way':
      return {
        label: 'In Transit',
        className: 'bg-blue-100 text-blue-700',
        icon: Truck,
        progress: 60
      };
    case 'shipped':
    case 'dispatched':
      return {
        label: 'Shipped',
        className: 'bg-indigo-100 text-indigo-700',
        icon: Package,
        progress: 40
      };
    case 'processing':
    case 'order_placed':
    case 'pending':
      return {
        label: 'Processing',
        className: 'bg-slate-100 text-slate-600',
        icon: Box,
        progress: 20
      };
    case 'exception':
    case 'delayed':
    case 'failed_delivery':
      return {
        label: 'Exception',
        className: 'bg-red-500 text-white',
        icon: AlertCircle,
        progress: 0
      };
    case 'returned':
    case 'cancelled':
      return {
        label: 'Returned',
        className: 'bg-orange-100 text-orange-700',
        icon: AlertCircle,
        progress: 0
      };
    default:
      return {
        label: status || 'Unknown',
        className: 'bg-gray-100 text-gray-700',
        icon: Package,
        progress: 0
      };
  }
};

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ State for orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // ✅ New Search Bar States
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackMethod, setTrackMethod] = useState('orderid');
  const [isSearching, setIsSearching] = useState(false);

  // ✅ Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [user]);

  // ✅ Fetch orders by customer email
  const fetchOrders = async () => {
    if (!user?.email) {
      toast.error("Please login to view your orders");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const customerOrders = await orderService.getOrdersByEmail(user.email);

      // Handle both array and object response
      const ordersArray = Array.isArray(customerOrders)
        ? customerOrders
        : customerOrders?.content || [];

      setOrders(ordersArray);

      if (ordersArray.length === 0) {
        toast.info("No orders found for your account");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 404) {
        setOrders([]);
      } else {
        toast.error("Failed to fetch orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Track Search (similar to home page)
  const handleTrackSearch = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number or email");
      return;
    }

    setIsSearching(true);

    try {
      let result;

      if (trackMethod === 'orderid') {
        // Search by Order ID
        result = await trackingService.getEventsByOrderId(trackingNumber);
      } else {
        // Search by Email
        if (!trackingNumber.includes('@')) {
          toast.error("Please enter a valid email address");
          setIsSearching(false);
          return;
        }
        result = await trackingService.getEventsByEmail(trackingNumber);
      }

      // Check if results exist
      if (result && result.content && result.content.length > 0) {
        toast.success("Tracking information found!");

        // Navigate to tracking details page with the orderId
        const orderId = trackMethod === 'orderid'
          ? trackingNumber
          : result.content[0].orderId;

        navigate(`/order/${orderId}`);
      } else {
        toast.error("No tracking information found for this " +
          (trackMethod === 'orderid' ? "Order ID" : "Email"));
      }
    } catch (error) {
      console.error("Tracking error:", error);

      if (error.response?.status === 404) {
        toast.error("Order not found. Please check your tracking number.");
      } else {
        toast.error("Failed to fetch tracking information. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // ✅ Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrackSearch();
    }
  };

  // ✅ Refresh orders
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const customerOrders = await orderService.getOrdersByEmail(user.email);
      const ordersArray = Array.isArray(customerOrders)
        ? customerOrders
        : customerOrders?.content || [];
      setOrders(ordersArray);
      toast.success("Orders refreshed");
    } catch (error) {
      toast.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today by ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow`;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ✅ Filter orders based on search and tab
  const filteredOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase().replace(/\s+/g, '_') || '';

    // Tab filter
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'active' && !['delivered', 'completed', 'returned', 'cancelled'].includes(status)) ||
      (selectedTab === 'delivered' && ['delivered', 'completed'].includes(status)) ||
      (selectedTab === 'exception' && ['exception', 'delayed', 'failed_delivery'].includes(status));

    // Search filter
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phonenumber?.includes(searchTerm);

    return matchesTab && matchesSearch;
  });

  // ✅ Calculate stats
  const stats = {
    active: orders.filter(o => {
      const status = o.status?.toLowerCase().replace(/\s+/g, '_') || '';
      return !['delivered', 'completed', 'returned', 'cancelled'].includes(status);
    }).length,
    delivered: orders.filter(o =>
      ['delivered', 'completed'].includes(o.status?.toLowerCase())
    ).length,
    exceptions: orders.filter(o =>
      ['exception', 'delayed', 'failed_delivery'].includes(o.status?.toLowerCase().replace(/\s+/g, '_'))
    ).length
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Layout />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your orders...</p>
            <p className="text-slate-400 text-sm mt-2">{user?.email}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                Customer <span className="text-yellow-500">Dashboard</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                Welcome, {user?.name || user?.email} / {new Date().getFullYear()}
              </p>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Orders'}
            </Button>
          </div>

          {/* ✅ NEW: Order Search Card */}
          <Card className="mb-10 shadow-lg border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50 ring-1 ring-yellow-100">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Left: Title */}
                <div className="lg:w-1/4">
                  <h2 className="text-xl font-black text-slate-900 mb-1">
                    Track Any Order
                  </h2>
                  <p className="text-sm text-slate-500">
                    Enter Order ID or Email to track
                  </p>
                </div>

                {/* Right: Search Form */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Track Method Selection */}
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-600 uppercase">Track By:</span>
                      <div className="flex gap-4">
                        {['orderid', 'email'].map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
                            <input
                              type="radio"
                              name="trackType"
                              checked={trackMethod === type}
                              onChange={() => setTrackMethod(type)}
                              className="w-4 h-4 accent-yellow-500"
                            />
                            {type === 'orderid' ? 'Order ID' : 'Email'}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 flex gap-3">
                      <Input
                        placeholder={trackMethod === 'email' ? "Enter Email Address" : "Enter Order ID"}
                        className="bg-white border-slate-200 h-12 rounded-xl focus:ring-yellow-500 focus:border-yellow-500"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        type={trackMethod === 'email' ? 'email' : 'text'}
                      />
                      <Button
                        onClick={handleTrackSearch}
                        disabled={isSearching}
                        className="h-12 px-8 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-yellow-200 transition-all duration-200"
                      >
                        {isSearching ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" />
                            Track
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Active Shipments"
              value={stats.active}
              icon={Package}
              color="slateDark"
            />
            <StatCard
              title="Delivered"
              value={stats.delivered}
              icon={CheckCircle2}
              color="yellow"
            />
            <StatCard
              title="Exceptions"
              value={stats.exceptions}
              icon={AlertCircle}
              color="red"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Filter orders by ID, Location, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-white border-slate-200 rounded-xl focus:ring-yellow-400"
              />
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
              <TabsList className="bg-slate-200/50 p-1 rounded-xl h-12">
                <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-[10px] uppercase">
                  All ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="rounded-lg px-6 font-bold text-[10px] uppercase">
                  Active ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="delivered" className="rounded-lg px-6 font-bold text-[10px] uppercase">
                  Delivered ({stats.delivered})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Orders Feed */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card className="border-none shadow-sm bg-white rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Orders Found</h3>
                  <p className="text-slate-500">
                    {searchTerm || selectedTab !== 'all'
                      ? "Try adjusting your search or filter"
                      : "You don't have any orders yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={order.orderId}
                    className="border-none shadow-sm hover:shadow-md transition-all group bg-white rounded-2xl overflow-hidden"
                  >
                    {/* Status Color Bar */}
                    <div className={`h-1 w-full ${statusConfig.className.split(' ')[0]}`} />

                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-8">

                        {/* Identity */}
                        <div className="lg:w-1/4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                              {order.orderId}
                            </h4>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">
                            {order.location || 'Processing'}
                          </p>
                          <Badge className={`mt-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${statusConfig.className}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Logistics Info */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">
                              Email
                            </p>
                            <p className="text-xs font-bold text-slate-700 truncate">
                              {order.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">
                              Phone
                            </p>
                            <p className="text-xs font-mono font-medium text-slate-500">
                              {order.phonenumber || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">
                              Est. Delivery
                            </p>
                            <p className="text-xs font-black text-slate-900">
                              {formatDate(order.estimatedDeliveryDate)}
                            </p>
                          </div>
                        </div>

                        {/* Transit Progress */}
                        {!['delivered', 'completed'].includes(order.status?.toLowerCase()) && (
                          <div className="lg:w-1/5">
                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-1.5">
                              <span>Progress</span>
                              <span className="text-slate-900">{statusConfig.progress}%</span>
                            </div>
                            <Progress value={statusConfig.progress} className="h-1.5 bg-slate-100" />
                          </div>
                        )}

                        {/* Delivered Badge */}
                        {['delivered', 'completed'].includes(order.status?.toLowerCase()) && (
                          <div className="lg:w-1/5 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-bold text-xs uppercase">Delivered</span>
                            </div>
                          </div>
                        )}

                        {/* Actions - Only Track Button Now */}
                        <div className="flex gap-2 min-w-[120px]">
                          <Button
                            onClick={() => navigate(`/order/${order.orderId}`)}
                            className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-bold text-xs rounded-xl h-10"
                          >
                            <Eye className="w-3.5 h-3.5 mr-2" /> Track Order
                          </Button>
                        </div>
                      </div>

                      {/* Additional Info Row */}
                      {(order.latitude || order.scanTime) && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          {order.location && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              Last: {order.location}
                            </span>
                          )}
                          {order.latitude && order.longitude && (
                            <span className="font-mono text-slate-400">
                              ({order.latitude.toFixed(4)}, {order.longitude.toFixed(4)})
                            </span>
                          )}
                          {order.scanTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated: {formatDate(order.scanTime)}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Total Count */}
          {filteredOrders.length > 0 && (
            <div className="mt-6 text-center text-sm text-slate-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ✅ Stat Card Component
function StatCard({ title, value, icon: Icon, color }) {
  const configs = {
    slateDark: "bg-slate-900 text-yellow-400",
    yellow: "bg-yellow-400 text-slate-900",
    red: "bg-red-500 text-white"
  };

  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${configs[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}