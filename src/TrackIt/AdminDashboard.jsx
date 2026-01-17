import {
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  BarChart3
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
  ResponsiveContainer
} from "recharts";

import {
  deliveryPerformanceData,
  carrierPerformanceData,
  orderStatusData,
  dailyShipmentsData,
  regionData,
  COLORS,
} from "./data/dashboardData.js";





export default function AdminDashboard() {
  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.value, 0);
  const onTimeRate = 94;
  const avgDeliveryTime = 2.4;

  const activeShipments =
    orderStatusData.find((d) => d.name === "In Transit")?.value || 0;

  const exceptions =
    orderStatusData.find((d) => d.name === "Exception")?.value || 0;

  return (
    
    
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="mb-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time insights and performance metrics
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="p-10 bg-green-500 text-white">
  Tailwind is working 🎉
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-0 shadow-lg">
  <CardContent className="pt-6">
    <div className="flex items-center justify-between mb-2">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
        <Package className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">
      {totalOrders.toLocaleString()}
    </p>
    <p className="text-sm text-gray-600 mt-1">
      Total Orders
    </p>
  </CardContent>
</Card>

          <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-success"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2.3%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{onTimeRate}%</p>
              <p className="text-sm text-gray-600 mt-1">On-Time Delivery Rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 left-0 right-0 h-1 gradient-info"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 gradient-info rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  <span>-0.3d</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgDeliveryTime}d</p>
              <p className="text-sm text-gray-600 mt-1">Avg Delivery Time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{activeShipments}</p>
              <p className="text-sm text-gray-600 mt-1">Active Shipments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden animate-scale-in hover:shadow-xl transition-shadow" style={{ animationDelay: '0.3s' }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{exceptions}</p>
              <p className="text-sm text-gray-600 mt-1">Exceptions This Week</p>
            </CardContent>
          </Card>
        </div>
        {/* (Your KPI cards remain unchanged – JSX safe) */}
        

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">{/* Delivery Performance Trend */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Delivery Performance Trend</CardTitle>
              <CardDescription>On-time vs delayed deliveries over time</CardDescription>
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

          {/* Order Status Distribution */}
          <Card className="border-0 shadow-md">
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Shipments */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Daily Shipment Volume</CardTitle>
              <CardDescription>Number of shipments per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyShipmentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="shipments" 
                    stroke="#1E3A8A" 
                    strokeWidth={2}
                    name="Shipments"
                    dot={{ fill: '#1E3A8A', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Carrier Performance */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Carrier Performance Comparison</CardTitle>
              <CardDescription>On-time delivery rate by carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carrierPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis type="category" dataKey="carrier" stroke="#6B7280" width={80} />
                  <Tooltip />
                  <Bar dataKey="onTime" fill="#14B8A6" name="On-Time Rate %" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carrier Performance Table */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Detailed Carrier Metrics</CardTitle>
              <CardDescription>Complete performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm text-gray-600">Carrier</th>
                      <th className="text-right py-3 px-2 text-sm text-gray-600">Deliveries</th>
                      <th className="text-right py-3 px-2 text-sm text-gray-600">On-Time %</th>
                      <th className="text-right py-3 px-2 text-sm text-gray-600">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierPerformanceData
                      .sort((a, b) => b.onTime - a.onTime)
                      .map((carrier, index) => (
                        <tr key={carrier.carrier} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-${COLORS[index]}`} style={{ backgroundColor: COLORS[index] }}></div>
                              <span className="font-medium">{carrier.carrier}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2 text-sm">{carrier.deliveries.toLocaleString()}</td>
                          <td className="text-right py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              carrier.onTime >= 95 ? 'bg-green-100 text-green-700' :
                              carrier.onTime >= 90 ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {carrier.onTime}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-2 text-sm">{carrier.avgTime}d</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Regional Distribution */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Orders by geographic region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={region.region}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{region.orders.toLocaleString()} orders</span>
                        <span className="font-medium text-[#1E3A8A]">{region.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${region.percentage}%`,
                          backgroundColor: COLORS[index]
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
        </div>
      </div>
        {/* (All Recharts usage is already JSX compatible) */}

      </div>
  );
}
