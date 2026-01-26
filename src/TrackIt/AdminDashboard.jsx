import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Download,
  Filter,
  RefreshCw,
  Shield,
  Bell,
  Users,
  Database,
  FileText,
  MapPin,
  ChevronRight,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  Search
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/Card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "./ui/tabs";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Input } from "./ui/Input";

// Mock Data - All in one file
const deliveryPerformanceData = [
  { month: 'Jan', onTime: 92, delayed: 8 },
  { month: 'Feb', onTime: 94, delayed: 6 },
  { month: 'Mar', onTime: 93, delayed: 7 },
  { month: 'Apr', onTime: 95, delayed: 5 },
  { month: 'May', onTime: 96, delayed: 4 },
  { month: 'Jun', onTime: 94, delayed: 6 },
];

const carrierPerformanceData = [
  { carrier: 'FedEx Express', onTime: 97, deliveries: 1250, avgTime: 1.8, avgCost: 15.50, type: 'Express' },
  { carrier: 'DHL Express', onTime: 96, deliveries: 980, avgTime: 2.1, avgCost: 18.75, type: 'Express' },
  { carrier: 'UPS Ground', onTime: 94, deliveries: 1560, avgTime: 3.2, avgCost: 12.25, type: 'Ground' },
  { carrier: 'Amazon Shipping', onTime: 92, deliveries: 2100, avgTime: 2.8, avgCost: 10.50, type: 'Standard' },
  { carrier: 'BlueDart', onTime: 90, deliveries: 870, avgTime: 2.5, avgCost: 14.30, type: 'Express' },
];

const orderStatusData = [
  { name: 'In Transit', value: 1560, color: '#F59E0B' },
  { name: 'Out for Delivery', value: 890, color: '#3B82F6' },
  { name: 'Delivered', value: 4230, color: '#10B981' },
  { name: 'Exception', value: 120, color: '#EF4444' },
];

const regionData = [
  { region: 'North America', orders: 3250, percentage: 35, countries: 3 },
  { region: 'Europe', orders: 2450, percentage: 27, countries: 28 },
  { region: 'Asia Pacific', orders: 2980, percentage: 32, countries: 15 },
  { region: 'Middle East', orders: 520, percentage: 6, countries: 12 },
];



const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const onTimeRate = 94;
  const avgDeliveryTime = 2.4;


  const activeShipments = orderStatusData.find((d) => d.name === "In Transit")?.value || 0;
  const exceptions = orderStatusData.find((d) => d.name === "Exception")?.value || 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="hidden lg:block w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200/80 sticky top-0 h-screen">
          <div className="p-8">
            {/* Admin Profile */}
            <div className="flex items-center gap-3 mb-10 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div>
                <p className="font-bold text-slate-900">Admin User</p>
                <p className="text-sm text-slate-600">System Administrator</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-10">
              <NavItem icon={BarChart3} label="Dashboard" active onClick={() => navigate('/admin')} />
              
              <NavItem icon={Settings} label="Settings" onClick={() => navigate('/admin/settings')} />
            </nav>

            {/* Logout */}
            <div className="mt-10">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-xl"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Analytics Dashboard
                  </h1>
                  <p className="text-slate-600 mt-2">Real-time insights and performance metrics across your logistics network</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Button variant="outline" className="pl-10 rounded-xl border-slate-200">
                      Notification
                      <Badge className="ml-2 bg-red-500 text-white">5</Badge>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard
                title="On-Time Delivery"
                value={`${onTimeRate}%`}
                change="+2.3%"
                icon={CheckCircle2}
                color="green"
                description="Delivery success rate"
              />
              <KpiCard
                title="Avg Delivery Time"
                value={`${avgDeliveryTime}d`}
                change="-0.3d"
                icon={Clock}
                color="blue"
                description="Average transit duration"
              />
              <KpiCard
                title="Active Shipments"
                value={activeShipments}
                change="+12%"
                icon={Truck}
                color="indigo"
                description="Currently in transit"
              />
              <KpiCard
                title="Exceptions"
                value={exceptions}
                change="+8"
                icon={AlertTriangle}
                color="red"
                description="Issues this week"
              />
            </div>

            {/* Analytics Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-slate-100 p-1 rounded-xl h-14 mb-6">
                <TabsTrigger value="overview" className="rounded-lg px-6 text-base">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="carriers" className="rounded-lg px-6 text-base">
                  Carriers
                </TabsTrigger>
                <TabsTrigger value="regions" className="rounded-lg px-6 text-base">
                  Regions
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab - Shows everything */}
              <TabsContent value="overview" className="mt-0 space-y-8">
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Delivery Performance</CardTitle>
                      <CardDescription>On-time vs delayed deliveries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={deliveryPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="onTime" fill="#10B981" name="On Time %" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="delayed" fill="#EF4444" name="Delayed %" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Order Status Distribution</CardTitle>
                      <CardDescription>Current orders by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {orderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Orders']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Carrier Performance Table */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Carrier Performance</CardTitle>
                    <CardDescription>Detailed metrics by carrier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 text-sm text-slate-600">Carrier</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">Deliveries</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">On-Time %</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">Avg Time</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">Avg Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {carrierPerformanceData
                            .sort((a, b) => b.onTime - a.onTime)
                            .map((carrier) => (
                              <tr key={carrier.carrier} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                                      <Truck className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                      <span className="font-medium">{carrier.carrier}</span>
                                      <p className="text-xs text-slate-500">{carrier.type || 'Standard'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <span className="font-medium">{carrier.deliveries?.toLocaleString() || '0'}</span>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <Badge className={
                                    carrier.onTime >= 95 ? 'bg-green-100 text-green-700' :
                                    carrier.onTime >= 90 ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }>
                                    {carrier.onTime || 0}%
                                  </Badge>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <span className="font-medium">{carrier.avgTime || 0}d</span>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <span className="font-medium">${(carrier.avgCost || 0).toFixed(2)}</span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Regional Distribution */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Regional Distribution</CardTitle>
                    <CardDescription>Orders by geographic region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {regionData.map((region, index) => (
                        <div key={region.region}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium">{region.region}</span>
                                <p className="text-xs text-slate-500">{region.countries || 1} countries</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-slate-600">{(region.orders || 0).toLocaleString()} orders</span>
                              <span className="font-bold text-indigo-600">{region.percentage || 0}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${region.percentage || 0}%`,
                                backgroundColor: COLORS[index % COLORS.length] || '#3B82F6'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Map Visualization Placeholder */}
                    <div className="mt-6 w-full h-48 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <circle cx="20" cy="30" r="3" fill="#1E3A8A" />
                          <circle cx="75" cy="25" r="4" fill="#1E3A8A" />
                          <circle cx="50" cy="50" r="5" fill="#14B8A6" />
                          <circle cx="30" cy="70" r="3" fill="#1E3A8A" />
                          <circle cx="85" cy="60" r="2" fill="#1E3A8A" />
                        </svg>
                      </div>
                      <div className="relative z-10 text-center">
                        <BarChart3 className="w-12 h-12 text-[#1E3A8A] mx-auto mb-2" />
                        <p className="text-[#1E3A8A] font-medium">Geographic Heat Map</p>
                        <p className="text-sm text-gray-600">Delivery destinations visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Carriers Tab - Shows only carrier section */}
              <TabsContent value="carriers" className="mt-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Carrier Performance</CardTitle>
                    <CardDescription>Detailed metrics by carrier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 text-sm text-slate-600">Carrier</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">Deliveries</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">On-Time %</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">Avg Time</th>
                            <th className="text-right py-3 px-2 text-sm text-slate-600">Avg Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {carrierPerformanceData
                            .sort((a, b) => b.onTime - a.onTime)
                            .map((carrier) => (
                              <tr key={carrier.carrier} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                                      <Truck className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                      <span className="font-medium">{carrier.carrier}</span>
                                      <p className="text-xs text-slate-500">{carrier.type || 'Standard'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <span className="font-medium">{carrier.deliveries?.toLocaleString() || '0'}</span>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <Badge className={
                                    carrier.onTime >= 95 ? 'bg-green-100 text-green-700' :
                                    carrier.onTime >= 90 ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }>
                                    {carrier.onTime || 0}%
                                  </Badge>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <span className="font-medium">{carrier.avgTime || 0}d</span>
                                </td>
                                <td className="text-right py-3 px-2">
                                  <span className="font-medium">${(carrier.avgCost || 0).toFixed(2)}</span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Regions Tab - Shows only region section */}
              <TabsContent value="regions" className="mt-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Regional Distribution</CardTitle>
                    <CardDescription>Orders by geographic region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {regionData.map((region, index) => (
                        <div key={region.region}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium">{region.region}</span>
                                <p className="text-xs text-slate-500">{region.countries || 1} countries</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-slate-600">{(region.orders || 0).toLocaleString()} orders</span>
                              <span className="font-bold text-indigo-600">{region.percentage || 0}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${region.percentage || 0}%`,
                                backgroundColor: COLORS[index % COLORS.length] || '#3B82F6'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Map Visualization Placeholder */}
                    <div className="mt-6 w-full h-48 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <circle cx="20" cy="30" r="3" fill="#1E3A8A" />
                          <circle cx="75" cy="25" r="4" fill="#1E3A8A" />
                          <circle cx="50" cy="50" r="5" fill="#14B8A6" />
                          <circle cx="30" cy="70" r="3" fill="#1E3A8A" />
                          <circle cx="85" cy="60" r="2" fill="#1E3A8A" />
                        </svg>
                      </div>
                      <div className="relative z-10 text-center">
                        <BarChart3 className="w-12 h-12 text-[#1E3A8A] mx-auto mb-2" />
                        <p className="text-[#1E3A8A] font-medium">Geographic Heat Map</p>
                        <p className="text-sm text-gray-600">Delivery destinations visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`w-full justify-start h-12 rounded-xl font-medium transition-all ${
        active 
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 shadow-sm" 
          : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50"
      }`}
    >
      {Icon && <Icon className={`w-5 h-5 mr-3 ${active ? "text-indigo-600" : ""}`} />}
      {label}
    </Button>
  );
}

function KpiCard({ title, value, change, icon: Icon, color, description }) {
  const IconComponent = Icon;
  const colorConfig = {
    green: { gradient: "from-green-500 to-emerald-500", text: "text-green-600", bg: "bg-green-100" },
    blue: { gradient: "from-blue-500 to-cyan-500", text: "text-blue-600", bg: "bg-blue-100" },
    indigo: { gradient: "from-indigo-500 to-purple-500", text: "text-indigo-600", bg: "bg-indigo-100" },
    red: { gradient: "from-red-500 to-rose-500", text: "text-red-600", bg: "bg-red-100" },
  };

  const config = colorConfig[color] || colorConfig.indigo;

  return (
    <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${config.text} mt-3`}>
          {change.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}