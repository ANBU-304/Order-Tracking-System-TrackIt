import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Eye,
  User,
  SettingsIcon,
  LogOut,
  HelpCircle,
  Download,
  FileText
} from 'lucide-react';

import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Progress } from './ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    status: 'out_for_delivery',
    carrier: 'FedEx Express',
    estimatedDelivery: 'Today by 8:00 PM',
    progress: 75,
    items: 'Electronics Package',
    trackingNumber: 'TRK123456789',
    orderDate: '2026-01-01'
  },
  {
    id: 'ORD-2024-002',
    status: 'in_transit',
    carrier: 'UPS Ground',
    estimatedDelivery: 'Jan 5, 2026',
    progress: 45,
    items: 'Books (3 items)',
    trackingNumber: 'TRK987654321',
    orderDate: '2025-12-30'
  },
  {
    id: 'ORD-2023-158',
    status: 'delivered',
    carrier: 'USPS Priority',
    estimatedDelivery: 'Delivered Dec 28',
    progress: 100,
    items: 'Clothing',
    trackingNumber: 'TRK456789123',
    orderDate: '2025-12-26'
  },
  {
    id: 'ORD-2024-003',
    status: 'exception',
    carrier: 'FedEx Ground',
    estimatedDelivery: 'Delayed - Jan 6',
    progress: 30,
    items: 'Furniture',
    trackingNumber: 'TRK321654987',
    orderDate: '2025-12-28'
  }
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'delivered':
      return { label: 'Delivered', className: 'bg-green-100 text-green-700' };
    case 'out_for_delivery':
      return { label: 'Out for Delivery', className: 'bg-blue-100 text-blue-700' };
    case 'in_transit':
      return { label: 'In Transit', className: 'bg-yellow-100 text-yellow-700' };
    case 'exception':
      return { label: 'Exception', className: 'bg-red-100 text-red-700' };
    default:
      return { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
  }
};

export function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const navigate = useNavigate();

  const filterOrders = () => {
    let orders = [...mockOrders];

    if (selectedTab !== 'all') {
      orders = orders.filter((o) => {
        if (selectedTab === 'active') return o.status !== 'delivered';
        if (selectedTab === 'delivered') return o.status === 'delivered';
        if (selectedTab === 'exception') return o.status === 'exception';
        return true;
      });
    }

    if (searchTerm) {
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.items.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return orders;
  };

  const filteredOrders = filterOrders();
  const activeOrders = mockOrders.filter(o => o.status !== 'delivered').length;
  const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length;
  const exceptionOrders = mockOrders.filter(o => o.status === 'exception').length;

  return (
     <div >
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen sticky top-0">
          <div className="p-6">
            {/* User Profile */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <span className="text-lg font-bold">JS</span>
              </div>
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 mb-8">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="w-full justify-start bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              >
                <Package className="w-5 h-5 mr-3" />
                <span>My Orders</span>
              </Button>
              
              <Button
                onClick={() => navigate('/profile')}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-gray-700"
              >
                <User className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Button>
              
              <Button
                onClick={() => navigate('/settings')}
                 variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-gray-700"
              >
                <SettingsIcon className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Button>
              
              <Button
                onClick={() => navigate('/help')}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-gray-700"
              >
                <HelpCircle className="w-5 h-5 mr-3" />
                <span>Help & Support</span>
              </Button>
            </nav>

            {/* Logout */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 animate-slide-in">
              <h1 className="mb-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My Orders</h1>
              <p className="text-gray-600">Track and manage your shipments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active Shipments</p>
                      <p className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{activeOrders}</p>
                    </div>
                    <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow" style={{ animationDelay: '0.1s' }}>
                <div className="absolute top-0 left-0 right-0 h-1 gradient-success"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivered</p>
                      <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
                    </div>
                    <div className="w-14 h-14 gradient-success rounded-2xl flex items-center justify-center shadow-lg">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow" style={{ animationDelay: '0.2s' }}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-pink-500"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Issues</p>
                      <p className="text-3xl font-bold text-red-600">{exceptionOrders}</p>
                    </div>
                    <div className="w-14 h-14 bg-linear-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="border-0 shadow-lg mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-gray-400 to-gray-600"></div>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search orders by ID, tracking number, or items"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Orders ({mockOrders.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeOrders})</TabsTrigger>
                <TabsTrigger value="delivered">Delivered ({deliveredOrders})</TabsTrigger>
                <TabsTrigger value="exception">Issues ({exceptionOrders})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab}>
                <div className="grid grid-cols-1 gap-4">
                  {filteredOrders.length === 0 ? (
                    <Card className="border-0 shadow-md">
                      <CardContent className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No orders found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      return (
                        <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                              {/* Order Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="mb-1">{order.id}</h4>
                                    <p className="text-sm text-gray-600">{order.items}</p>
                                  </div>
                                  <Badge className={statusConfig.className}>
                                    {statusConfig.label}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Carrier:</span>
                                    <span className="font-medium">{order.carrier}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tracking:</span>
                                    <span className="font-mono text-xs">{order.trackingNumber}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Estimated Delivery:</span>
                                    <span className="font-medium text-[#1E3A8A]">{order.estimatedDelivery}</span>
                                  </div>
                                  
                                  {order.status !== 'delivered' && (
                                    <div className="pt-2">
                                      <div className="flex items-center justify-between mb-1 text-sm">
                                        <span className="text-gray-600">Progress</span>
                                        <span>{order.progress}%</span>
                                      </div>
                                      <Progress value={order.progress} className="h-2" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex lg:flex-col gap-2">
                                <Button
                                  onClick={() => navigate(`/order/${order.trackingNumber}`)}
                                  className="flex-1 lg:w-full bg-[#1E3A8A] hover:bg-[#14B8A6]"
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                                <Button variant="outline" className="flex-1 lg:w-full" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Invoice
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button variant="outline" className="flex-1 lg:w-full" size="sm">
                                    <FileText className="w-4 h-4 mr-2" />
                                    POD
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
