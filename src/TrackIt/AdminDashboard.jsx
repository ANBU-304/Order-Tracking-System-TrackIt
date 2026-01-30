import { useState } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  BarChart3,
 
} from "lucide-react";

import {
  Card,
  CardContent,
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

import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Layout } from "./Layout";

// Data Constants
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
  { name: 'In Transit', value: 1560, color: '#facc15' }, 
  { name: 'Out for Delivery', value: 890, color: '#64748b' }, 
  { name: 'Delivered', value: 4230, color: '#0f172a' }, 
  { name: 'Exception', value: 120, color: '#ef4444' }, 
];

const regionData = [
  { region: 'North America', orders: 3250, percentage: 35, countries: 3 },
  { region: 'Europe', orders: 2450, percentage: 27, countries: 28 },
  { region: 'Asia Pacific', orders: 2980, percentage: 32, countries: 15 },
  { region: 'Middle East', orders: 520, percentage: 6, countries: 12 },
];

const COLORS = ['#0f172a', '#facc15', '#475569', '#94a3b8', '#e2e8f0'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const onTimeRate = 94;
  const avgDeliveryTime = 2.4;
  const activeShipments = orderStatusData.find((d) => d.name === "In Transit")?.value || 0;
  const exceptions = orderStatusData.find((d) => d.name === "Exception")?.value || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Layout />

        <div className="flex-1 overflow-auto px-5">
          <div className="w-full py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    Admin Analytics Dashboard
                  </h1>
                  <p className="text-slate-500 mt-2">Real-time logistics performance network</p>
                </div>
               
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard title="On-Time Delivery" value={`${onTimeRate}%`} change="+2.3%" icon={CheckCircle2} color="yellow" description="Success rate" />
              <KpiCard title="Avg Delivery Time" value={`${avgDeliveryTime}d`} change="-0.3d" icon={Clock} color="slateLight" description="Transit duration" />
              <KpiCard title="Active Shipments" value={activeShipments} change="+12%" icon={Truck} color="slateDark" description="In transit" />
              <KpiCard title="Exceptions" value={exceptions} change="+8" icon={AlertTriangle} color="red" description="Issues this week" />
            </div>

            {/* Analytics Tabs System */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-slate-200/60 p-1 rounded-xl h-14 mb-6">
                <TabsTrigger value="overview" className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="carriers" className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                  Carriers
                </TabsTrigger>
                <TabsTrigger value="regions" className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                  Regions
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW CONTENT */}
              <TabsContent value="overview" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader><CardTitle>Delivery Performance</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={deliveryPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: '#f8fafc'}} />
                          <Bar dataKey="onTime" fill="#0f172a" name="On Time %" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="delayed" fill="#facc15" name="Delayed %" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader><CardTitle>Order Status Distribution</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                            {orderStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* CARRIERS CONTENT */}
              <TabsContent value="carriers" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader><CardTitle>Carrier Performance</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 text-left">
                            <th className="py-4 px-2 text-sm font-semibold text-slate-900">Carrier</th>
                            <th className="text-right py-4 px-2 text-sm font-semibold text-slate-900">On-Time %</th>
                            <th className="text-right py-4 px-2 text-sm font-semibold text-slate-900">Avg Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {carrierPerformanceData.map((carrier) => (
                            <tr key={carrier.carrier} className="border-b border-slate-50 last:border-0">
                              <td className="py-4 px-2 font-medium">{carrier.carrier}</td>
                              <td className="text-right py-4 px-2">
                                <Badge className="bg-slate-900 text-yellow-400 border-none">{carrier.onTime}%</Badge>
                              </td>
                              <td className="text-right py-4 px-2 font-bold">${carrier.avgCost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* REGIONS CONTENT */}
              <TabsContent value="regions" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader><CardTitle>Regional Distribution</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {regionData.map((region, index) => (
                        <div key={region.region}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-slate-900">{region.region}</span>
                            <span className="font-bold text-slate-900">{region.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${region.percentage}%`, backgroundColor: COLORS[index % COLORS.length] }} />
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

function KpiCard({ title, value, change, icon: Icon, color, description }) {
  const colorConfig = {
    yellow: { iconBg: "bg-yellow-400", iconCol: "text-slate-900" },
    slateLight: { iconBg: "bg-slate-200", iconCol: "text-slate-600" },
    slateDark: { iconBg: "bg-slate-900", iconCol: "text-yellow-400" },
    red: { iconBg: "bg-red-100", iconCol: "text-red-600" },
  };
  const config = colorConfig[color] || colorConfig.slateDark;

  return (
    <Card className="border-slate-200 shadow-sm bg-white hover:border-yellow-400 transition-colors">
      <CardContent className="pt-6">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.iconCol}`} />
          </div>
        </div>
        <div className="text-sm font-bold text-slate-900">{change} <span className="text-[10px] text-slate-400 uppercase ml-2">{description}</span></div>
      </CardContent>
    </Card>
  );
}