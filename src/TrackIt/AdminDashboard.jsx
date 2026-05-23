// src/components/AdminDashboard.jsx

import { useState, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  BarChart3,
  DollarSign,
  Users,
  RefreshCw,
  MapPin,
  TrendingUp,
  TrendingDown,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Activity,
  Zap
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
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area
} from "recharts";

import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Layout } from "./Layout";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import adminApi from "../services/adminApi";
import AdvancedHeatmap from "./AdvancedHeatmap";

// ─── Color Constants ───────────────────────────────────────────
const CARRIER_COLORS = [
  "#0f172a", "#facc15", "#3b82f6", "#10b981",
  "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"
];

const STATUS_COLORS = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  average: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800"
};

// ─── Helper: performance label ─────────────────────────────────
function getPerformanceLabel(score) {
  if (score >= 90) return { label: "Excellent", color: STATUS_COLORS.excellent };
  if (score >= 75) return { label: "Good", color: STATUS_COLORS.good };
  if (score >= 60) return { label: "Average", color: STATUS_COLORS.average };
  return { label: "Poor", color: STATUS_COLORS.poor };
}

// ─── Helper: trend icon ────────────────────────────────────────
function TrendIndicator({ value, suffix = "%" }) {
  const isPositive = parseFloat(value) >= 0;
  return (
    <span className={`inline-flex items-center text-xs font-bold ${
      isPositive ? "text-green-600" : "text-red-600"
    }`}>
      {isPositive
        ? <ArrowUpRight className="w-3 h-3 mr-0.5" />
        : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
      {Math.abs(value)}{suffix}
    </span>
  );
}

// ─── Custom Tooltip for charts ─────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-slate-900 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-slate-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { loading, error, dashboardData, refetch } = useAdminDashboard();

  // Support agents
  const [supportAgents, setSupportAgents] = useState([]);
  const [loadingSupportAgents, setLoadingSupportAgents] = useState(false);

  // Heatmap
  const [heatmapData, setHeatmapData] = useState([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  // Carrier Analysis
  const [carrierData, setCarrierData] = useState(null);
  const [loadingCarriers, setLoadingCarriers] = useState(false);
  const [carrierSortField, setCarrierSortField] = useState("score");
  const [carrierSortDir, setCarrierSortDir] = useState("desc");
  const [carrierSearch, setCarrierSearch] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  // ── Lazy‑fetch per tab ──────────────────────────────────────
  useEffect(() => {
    if (activeTab === "carriers-agents" && supportAgents.length === 0) {
      fetchSupportAgents();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "regions" && heatmapData.length === 0) {
      fetchHeatmapData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "carrier-analysis" && !carrierData) {
      fetchCarrierAnalysis();
    }
  }, [activeTab]);

  // ── Fetchers ────────────────────────────────────────────────
  const fetchSupportAgents = async () => {
    try {
      setLoadingSupportAgents(true);
      const agents = await adminApi.getSupportAgents();
      setSupportAgents(agents);
    } catch (err) {
      console.error("Failed to fetch support agents:", err);
    } finally {
      setLoadingSupportAgents(false);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      setLoadingHeatmap(true);
      const data = await adminApi.getHeatmapData();
      setHeatmapData(data);
    } catch (err) {
      console.error("Failed to fetch heatmap data:", err);
    } finally {
      setLoadingHeatmap(false);
    }
  };

  const fetchCarrierAnalysis = async () => {
    try {
      setLoadingCarriers(true);
      // If your API has a dedicated endpoint, call it here:
      // const data = await adminApi.getCarrierAnalysis();

      // ── Fallback demo data (replace with real API) ────────
      const data = {
        summary: {
          totalCarriers: 8,
          avgOnTimeRate: 87.3,
          avgDeliveryDays: 3.2,
          totalShipmentsMonth: 14520,
          bestCarrier: "BlueDart Express",
          worstCarrier: "Regional Logistics"
        },
        carriers: [
          {
            id: 1,
            name: "BlueDart Express",
            logo: "🔵",
            onTimeRate: 96.2,
            onTimeChange: 1.8,
            avgDeliveryDays: 2.1,
            deliveryChange: -0.3,
            totalShipments: 4230,
            shipmentsChange: 12.5,
            exceptions: 42,
            exceptionsChange: -8,
            costPerShipment: 145,
            costChange: -2.1,
            customerRating: 4.8,
            score: 95,
            zones: ["North", "West", "South"],
            trend: [82, 85, 88, 90, 93, 95, 96]
          },
          {
            id: 2,
            name: "Delhivery",
            logo: "🟡",
            onTimeRate: 92.1,
            onTimeChange: 2.3,
            avgDeliveryDays: 2.8,
            deliveryChange: -0.1,
            totalShipments: 3870,
            shipmentsChange: 8.2,
            exceptions: 68,
            exceptionsChange: -5,
            costPerShipment: 132,
            costChange: -1.5,
            customerRating: 4.6,
            score: 90,
            zones: ["North", "East", "Central"],
            trend: [78, 80, 83, 86, 89, 91, 92]
          },
          {
            id: 3,
            name: "DTDC",
            logo: "🔴",
            onTimeRate: 88.5,
            onTimeChange: 0.5,
            avgDeliveryDays: 3.2,
            deliveryChange: 0.0,
            totalShipments: 2450,
            shipmentsChange: 5.1,
            exceptions: 95,
            exceptionsChange: 2,
            costPerShipment: 118,
            costChange: 0.8,
            customerRating: 4.3,
            score: 82,
            zones: ["South", "West"],
            trend: [75, 78, 80, 82, 85, 87, 88]
          },
          {
            id: 4,
            name: "Ecom Express",
            logo: "🟢",
            onTimeRate: 85.7,
            onTimeChange: -1.2,
            avgDeliveryDays: 3.5,
            deliveryChange: 0.2,
            totalShipments: 1820,
            shipmentsChange: 3.8,
            exceptions: 112,
            exceptionsChange: 6,
            costPerShipment: 105,
            costChange: 1.2,
            customerRating: 4.1,
            score: 76,
            zones: ["East", "Northeast"],
            trend: [80, 82, 84, 83, 85, 86, 86]
          },
          {
            id: 5,
            name: "XpressBees",
            logo: "🟠",
            onTimeRate: 83.4,
            onTimeChange: 3.1,
            avgDeliveryDays: 3.8,
            deliveryChange: -0.5,
            totalShipments: 1150,
            shipmentsChange: 15.3,
            exceptions: 88,
            exceptionsChange: -12,
            costPerShipment: 98,
            costChange: -3.2,
            customerRating: 4.0,
            score: 74,
            zones: ["West", "Central", "South"],
            trend: [68, 70, 73, 76, 79, 82, 83]
          },
          {
            id: 6,
            name: "India Post",
            logo: "📮",
            onTimeRate: 72.8,
            onTimeChange: -0.5,
            avgDeliveryDays: 5.2,
            deliveryChange: 0.3,
            totalShipments: 620,
            shipmentsChange: -2.1,
            exceptions: 145,
            exceptionsChange: 8,
            costPerShipment: 62,
            costChange: 0.5,
            customerRating: 3.5,
            score: 58,
            zones: ["All India"],
            trend: [70, 71, 72, 71, 73, 72, 73]
          },
          {
            id: 7,
            name: "Shadowfax",
            logo: "⚡",
            onTimeRate: 90.3,
            onTimeChange: 1.1,
            avgDeliveryDays: 2.5,
            deliveryChange: -0.2,
            totalShipments: 980,
            shipmentsChange: 22.5,
            exceptions: 35,
            exceptionsChange: -3,
            costPerShipment: 155,
            costChange: 0.2,
            customerRating: 4.5,
            score: 88,
            zones: ["Metro Cities"],
            trend: [82, 84, 86, 87, 88, 90, 90]
          },
          {
            id: 8,
            name: "Regional Logistics",
            logo: "📦",
            onTimeRate: 65.2,
            onTimeChange: -3.4,
            avgDeliveryDays: 6.1,
            deliveryChange: 0.8,
            totalShipments: 400,
            shipmentsChange: -5.2,
            exceptions: 180,
            exceptionsChange: 15,
            costPerShipment: 78,
            costChange: 4.1,
            customerRating: 3.1,
            score: 45,
            zones: ["Rural", "Tier-3"],
            trend: [72, 70, 68, 67, 66, 65, 65]
          }
        ],
        monthlyComparison: [
          { month: "Jan", BlueDart: 92, Delhivery: 85, DTDC: 80, Ecom: 78 },
          { month: "Feb", BlueDart: 93, Delhivery: 86, DTDC: 82, Ecom: 80 },
          { month: "Mar", BlueDart: 94, Delhivery: 88, DTDC: 83, Ecom: 82 },
          { month: "Apr", BlueDart: 93, Delhivery: 89, DTDC: 85, Ecom: 83 },
          { month: "May", BlueDart: 95, Delhivery: 90, DTDC: 87, Ecom: 85 },
          { month: "Jun", BlueDart: 96, Delhivery: 92, DTDC: 88, Ecom: 86 }
        ],
        costEfficiency: [
          { name: "BlueDart", cost: 145, onTime: 96, shipments: 4230 },
          { name: "Delhivery", cost: 132, onTime: 92, shipments: 3870 },
          { name: "DTDC", cost: 118, onTime: 88, shipments: 2450 },
          { name: "Ecom", cost: 105, onTime: 86, shipments: 1820 },
          { name: "XpressBees", cost: 98, onTime: 83, shipments: 1150 },
          { name: "Shadowfax", cost: 155, onTime: 90, shipments: 980 },
          { name: "India Post", cost: 62, onTime: 73, shipments: 620 },
          { name: "Regional", cost: 78, onTime: 65, shipments: 400 }
        ],
        radarMetrics: [
          { metric: "On-Time", BlueDart: 96, Delhivery: 92, DTDC: 88 },
          { metric: "Speed", BlueDart: 95, Delhivery: 85, DTDC: 78 },
          { metric: "Cost", BlueDart: 70, Delhivery: 78, DTDC: 85 },
          { metric: "Coverage", BlueDart: 88, Delhivery: 90, DTDC: 75 },
          { metric: "Rating", BlueDart: 96, Delhivery: 92, DTDC: 86 },
          { metric: "Reliability", BlueDart: 94, Delhivery: 88, DTDC: 82 }
        ]
      };

      setCarrierData(data);
    } catch (err) {
      console.error("Failed to fetch carrier analysis:", err);
    } finally {
      setLoadingCarriers(false);
    }
  };

  // ── Sorting / Filtering helpers ─────────────────────────────
  const sortedCarriers = () => {
    if (!carrierData) return [];
    let list = [...carrierData.carriers];

    if (carrierSearch) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(carrierSearch.toLowerCase())
      );
    }

    list.sort((a, b) => {
      const aVal = a[carrierSortField];
      const bVal = b[carrierSortField];
      return carrierSortDir === "desc" ? bVal - aVal : aVal - bVal;
    });

    return list;
  };

  const toggleSort = (field) => {
    if (carrierSortField === field) {
      setCarrierSortDir(d => (d === "desc" ? "asc" : "desc"));
    } else {
      setCarrierSortField(field);
      setCarrierSortDir("desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (carrierSortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return carrierSortDir === "desc"
      ? <ChevronDown className="w-3 h-3" />
      : <ChevronUp className="w-3 h-3" />;
  };

  // ── Loading & Error gates ───────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <Layout />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-slate-900 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <Layout />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Failed to Load Dashboard
              </h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={refetch} className="bg-slate-900 text-white hover:bg-slate-800">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kpi = dashboardData?.kpiMetrics || {};
  const orderStatusData = dashboardData?.orderStatusDistribution || [];
  const deliveryPerformanceData = dashboardData?.deliveryPerformance || [];

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
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
                    Admin Analytics <span className="text-yellow-500">Dashboard</span>
                  </h1>
                  <p className="text-slate-500 mt-2">
                    Real-time logistics performance network
                  </p>
                </div>
                <Button
                  onClick={refetch}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <KpiCard
                title="On-Time Delivery"
                value={`${kpi.onTimeRate || 0}%`}
                change={kpi.onTimeRateChange || "+0%"}
                icon={CheckCircle2}
                color="yellow"
                description="Success rate"
              />
              <KpiCard
                title="Avg Delivery Time"
                value={`${kpi.avgDeliveryTime || 0}d`}
                change={kpi.avgDeliveryTimeChange || "0d"}
                icon={Clock}
                color="slateLight"
                description="Transit duration"
              />
              <KpiCard
                title="Active Shipments"
                value={kpi.activeShipments || 0}
                change={kpi.activeShipmentsChange || "+0%"}
                icon={Truck}
                color="slateDark"
                description="In transit"
              />
              <KpiCard
                title="Exceptions"
                value={kpi.exceptions || 0}
                change={kpi.exceptionsChange || "+0"}
                icon={AlertTriangle}
                color="red"
                description="Issues this week"
              />
              <KpiCard
                title="30-Day Revenue"
                value={`₹${(kpi.last30DaysRevenue || 0).toLocaleString("en-IN")}`}
                change={kpi.revenueChange || "+0%"}
                icon={DollarSign}
                color="green"
                description="Total earnings"
              />
            </div>

            {/* ═══ Tabs ═══════════════════════════════════════ */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-slate-200/60 p-1 rounded-xl h-14 mb-6 flex-wrap">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>

                <TabsTrigger
                  value="carrier-analysis"
                  className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Carrier Analysis
                </TabsTrigger>

                <TabsTrigger
                  value="carriers-agents"
                  className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Support Agents
                </TabsTrigger>

                <TabsTrigger
                  value="regions"
                  className="rounded-lg px-6 text-base data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Heatmap
                </TabsTrigger>
              </TabsList>

              {/* ─── OVERVIEW ─────────────────────────────────── */}
              <TabsContent value="overview" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>Delivery Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {deliveryPerformanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={deliveryPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="onTime" fill="#0f172a" name="On Time %" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="delayed" fill="#facc15" name="Delayed %" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <EmptyState icon={BarChart3} text="No delivery performance data available" />
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>Order Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orderStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={orderStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {orderStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <EmptyState icon={Package} text="No order status data available" />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ─── CARRIER ANALYSIS ─────────────────────────── */}
              <TabsContent value="carrier-analysis" className="mt-0 space-y-6">
                {loadingCarriers ? (
                  <div className="text-center py-16">
                    <RefreshCw className="w-10 h-10 animate-spin text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      Loading carrier analysis…
                    </p>
                  </div>
                ) : carrierData ? (
                  <>
                    {/* ── Summary Row ──────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <SummaryMini
                        label="Total Carriers"
                        value={carrierData.summary.totalCarriers}
                        icon={Truck}
                        bg="bg-slate-100"
                      />
                      <SummaryMini
                        label="Avg On-Time"
                        value={`${carrierData.summary.avgOnTimeRate}%`}
                        icon={CheckCircle2}
                        bg="bg-green-50"
                      />
                      <SummaryMini
                        label="Avg Delivery"
                        value={`${carrierData.summary.avgDeliveryDays}d`}
                        icon={Clock}
                        bg="bg-blue-50"
                      />
                      <SummaryMini
                        label="Monthly Shipments"
                        value={carrierData.summary.totalShipmentsMonth.toLocaleString()}
                        icon={Package}
                        bg="bg-yellow-50"
                      />
                      <SummaryMini
                        label="Top Performer"
                        value={carrierData.summary.bestCarrier}
                        icon={Award}
                        bg="bg-green-50"
                        small
                      />
                      <SummaryMini
                        label="Needs Improvement"
                        value={carrierData.summary.worstCarrier}
                        icon={AlertTriangle}
                        bg="bg-red-50"
                        small
                      />
                    </div>

                    {/* ── Charts Row ───────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* On-Time Trend Line */}
                      <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <TrendingUp className="w-4 h-4" />
                            On-Time Delivery Trend (6 months)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={carrierData.monthlyComparison}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line type="monotone" dataKey="BlueDart" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
                              <Line type="monotone" dataKey="Delhivery" stroke="#facc15" strokeWidth={2} dot={{ r: 3 }} />
                              <Line type="monotone" dataKey="DTDC" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                              <Line type="monotone" dataKey="Ecom" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Radar Comparison */}
                      <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Activity className="w-4 h-4" />
                            Top 3 Carrier Comparison
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={280}>
                            <RadarChart data={carrierData.radarMetrics}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="metric" fontSize={11} stroke="#64748b" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} stroke="#94a3b8" />
                              <Radar name="BlueDart" dataKey="BlueDart" stroke="#0f172a" fill="#0f172a" fillOpacity={0.15} strokeWidth={2} />
                              <Radar name="Delhivery" dataKey="Delhivery" stroke="#facc15" fill="#facc15" fillOpacity={0.1} strokeWidth={2} />
                              <Radar name="DTDC" dataKey="DTDC" stroke="#ef4444" fill="#ef4444" fillOpacity={0.08} strokeWidth={2} />
                              <Legend />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Cost vs Performance */}
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <DollarSign className="w-4 h-4" />
                          Cost vs On-Time Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart data={carrierData.costEfficiency}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} label={{ value: "₹ / shipment", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94a3b8" } }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} label={{ value: "On-Time %", angle: 90, position: "insideRight", style: { fontSize: 11, fill: "#94a3b8" } }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="cost" fill="#0f172a" name="Cost (₹)" radius={[4, 4, 0, 0]} barSize={32} />
                            <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#facc15" strokeWidth={3} name="On-Time %" dot={{ r: 5, fill: "#facc15", stroke: "#fff", strokeWidth: 2 }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* ── Carrier Table ─────────────────────────── */}
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Truck className="w-5 h-5" />
                            All Carriers Performance
                          </CardTitle>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search carrier…"
                                value={carrierSearch}
                                onChange={(e) => setCarrierSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent w-56"
                              />
                            </div>
                            <Button
                              onClick={fetchCarrierAnalysis}
                              variant="outline"
                              size="sm"
                              disabled={loadingCarriers}
                            >
                              <RefreshCw className={`w-4 h-4 mr-2 ${loadingCarriers ? "animate-spin" : ""}`} />
                              Refresh
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-200 text-left">
                                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase">
                                  Rank
                                </th>
                                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase">
                                  Carrier
                                </th>
                                <SortableHeader label="Score" field="score" toggleSort={toggleSort} SortIcon={SortIcon} />
                                <SortableHeader label="On-Time %" field="onTimeRate" toggleSort={toggleSort} SortIcon={SortIcon} />
                                <SortableHeader label="Avg Days" field="avgDeliveryDays" toggleSort={toggleSort} SortIcon={SortIcon} />
                                <SortableHeader label="Shipments" field="totalShipments" toggleSort={toggleSort} SortIcon={SortIcon} />
                                <SortableHeader label="Exceptions" field="exceptions" toggleSort={toggleSort} SortIcon={SortIcon} />
                                <SortableHeader label="Cost/Ship" field="costPerShipment" toggleSort={toggleSort} SortIcon={SortIcon} />
                                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase">
                                  Rating
                                </th>
                                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase">
                                  Trend
                                </th>
                                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase text-right">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedCarriers().map((carrier, idx) => {
                                const perf = getPerformanceLabel(carrier.score);
                                return (
                                  <tr
                                    key={carrier.id}
                                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                                    onClick={() =>
                                      setSelectedCarrier(
                                        selectedCarrier?.id === carrier.id ? null : carrier
                                      )
                                    }
                                  >
                                    <td className="py-4 px-2">
                                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                        {idx + 1}
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{carrier.logo}</span>
                                        <span className="font-semibold text-slate-900 text-sm">
                                          {carrier.name}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                                          <div
                                            className="h-full rounded-full"
                                            style={{
                                              width: `${carrier.score}%`,
                                              backgroundColor:
                                                carrier.score >= 90
                                                  ? "#10b981"
                                                  : carrier.score >= 75
                                                  ? "#3b82f6"
                                                  : carrier.score >= 60
                                                  ? "#f59e0b"
                                                  : "#ef4444"
                                            }}
                                          />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">
                                          {carrier.score}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-slate-900">
                                          {carrier.onTimeRate}%
                                        </span>
                                        <TrendIndicator value={carrier.onTimeChange} />
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm text-slate-700">
                                          {carrier.avgDeliveryDays}d
                                        </span>
                                        <TrendIndicator
                                          value={carrier.deliveryChange}
                                          suffix="d"
                                        />
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm text-slate-700">
                                          {carrier.totalShipments.toLocaleString()}
                                        </span>
                                        <TrendIndicator value={carrier.shipmentsChange} />
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm text-slate-700">
                                          {carrier.exceptions}
                                        </span>
                                        <TrendIndicator value={carrier.exceptionsChange} />
                                      </div>
                                    </td>
                                    <td className="py-4 px-2 text-sm text-slate-700">
                                      ₹{carrier.costPerShipment}
                                    </td>
                                    <td className="py-4 px-2">
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-medium text-slate-700">
                                          {carrier.customerRating}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-2">
                                      <MiniSparkline data={carrier.trend} />
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                      <Badge className={`${perf.color} border-none text-xs`}>
                                        {perf.label}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {sortedCarriers().length === 0 && (
                          <EmptyState icon={Truck} text="No carriers match your search" />
                        )}
                      </CardContent>
                    </Card>

                    {/* ── Selected Carrier Detail ──────────────── */}
                    {selectedCarrier && (
                      <Card className="border-yellow-400 border-2 shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                              <span className="text-2xl">{selectedCarrier.logo}</span>
                              {selectedCarrier.name} — Detailed View
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCarrier(null)}
                            >
                              Close
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            <DetailMini label="On-Time" value={`${selectedCarrier.onTimeRate}%`} change={selectedCarrier.onTimeChange} />
                            <DetailMini label="Avg Delivery" value={`${selectedCarrier.avgDeliveryDays}d`} change={selectedCarrier.deliveryChange} suffix="d" />
                            <DetailMini label="Shipments" value={selectedCarrier.totalShipments.toLocaleString()} change={selectedCarrier.shipmentsChange} />
                            <DetailMini label="Exceptions" value={selectedCarrier.exceptions} change={selectedCarrier.exceptionsChange} invert />
                            <DetailMini label="Cost/Ship" value={`₹${selectedCarrier.costPerShipment}`} change={selectedCarrier.costChange} invert />
                            <DetailMini label="Rating" value={selectedCarrier.customerRating} icon={<Star className="w-4 h-4 text-yellow-400 fill-yellow-400 inline mr-1" />} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 7-point trend */}
                            <div>
                              <p className="text-sm font-semibold text-slate-700 mb-3">
                                Performance Trend (last 7 periods)
                              </p>
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart
                                  data={selectedCarrier.trend.map((v, i) => ({
                                    period: `P${i + 1}`,
                                    value: v
                                  }))}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                  <XAxis dataKey="period" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                  <YAxis domain={[50, 100]} fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Area type="monotone" dataKey="value" fill="#0f172a" fillOpacity={0.05} stroke="#0f172a" strokeWidth={2} name="Score" />
                                  <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={{ r: 4, fill: "#0f172a" }} name="Score" />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Zone coverage */}
                            <div>
                              <p className="text-sm font-semibold text-slate-700 mb-3">
                                Active Zones
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {selectedCarrier.zones.map((z) => (
                                  <Badge
                                    key={z}
                                    className="bg-slate-100 text-slate-700 border-none px-3 py-1"
                                  >
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {z}
                                  </Badge>
                                ))}
                              </div>

                              <div className="space-y-3">
                                <ProgressRow label="Score" value={selectedCarrier.score} max={100} color="#0f172a" />
                                <ProgressRow label="On-Time" value={selectedCarrier.onTimeRate} max={100} color="#10b981" />
                                <ProgressRow label="Customer Rating" value={selectedCarrier.customerRating * 20} max={100} color="#facc15" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <EmptyState icon={Truck} text="No carrier data available" />
                )}
              </TabsContent>

              {/* ─── SUPPORT AGENTS ───────────────────────────── */}
              <TabsContent value="carriers-agents" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Support Agents ({supportAgents.length})
                      </CardTitle>
                      <Button
                        onClick={fetchSupportAgents}
                        variant="outline"
                        size="sm"
                        disabled={loadingSupportAgents}
                      >
                        {loadingSupportAgents ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingSupportAgents ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500">Loading support agents...</p>
                      </div>
                    ) : supportAgents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-100 text-left">
                              <th className="py-4 px-2 text-sm font-semibold text-slate-900">ID</th>
                              <th className="py-4 px-2 text-sm font-semibold text-slate-900">Name</th>
                              <th className="py-4 px-2 text-sm font-semibold text-slate-900">Email</th>
                              <th className="py-4 px-2 text-sm font-semibold text-slate-900">Role</th>
                              <th className="text-right py-4 px-2 text-sm font-semibold text-slate-900">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {supportAgents.map((agent) => (
                              <tr key={agent.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                <td className="py-4 px-2 text-slate-600">{agent.id}</td>
                                <td className="py-4 px-2 font-medium text-slate-900">{agent.name}</td>
                                <td className="py-4 px-2 text-slate-600">{agent.email}</td>
                                <td className="py-4 px-2">
                                  <Badge className="bg-blue-100 text-blue-800 border-none">{agent.role}</Badge>
                                </td>
                                <td className="text-right py-4 px-2">
                                  <Badge className="bg-green-100 text-green-800 border-none">{agent.status}</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <EmptyState icon={Users} text="No support agents found" />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ─── HEATMAP ──────────────────────────────────── */}
              <TabsContent value="regions" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Geographic Heatmap ({heatmapData.length} locations)
                      </CardTitle>
                      <Button
                        onClick={fetchHeatmapData}
                        variant="outline"
                        size="sm"
                        disabled={loadingHeatmap}
                      >
                        {loadingHeatmap ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingHeatmap ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500">Loading heatmap data...</p>
                      </div>
                    ) : heatmapData.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-slate-900">{heatmapData.length}</p>
                            <p className="text-xs text-slate-500 uppercase">Total Locations</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-green-700">
                              {heatmapData.filter((d) => d.status === "DELIVERED").length}
                            </p>
                            <p className="text-xs text-green-600 uppercase">Delivered</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-700">
                              {heatmapData.filter((d) => d.status === "IN_TRANSIT").length}
                            </p>
                            <p className="text-xs text-yellow-600 uppercase">In Transit</p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-red-700">
                              {heatmapData.filter((d) => d.status === "EXCEPTION").length}
                            </p>
                            <p className="text-xs text-red-600 uppercase">Exceptions</p>
                          </div>
                        </div>
                        <AdvancedHeatmap data={heatmapData} height="500px" />
                      </>
                    ) : (
                      <EmptyState icon={MapPin} text="No heatmap data available" />
                    )}
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

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function KpiCard({ title, value, change, icon: Icon, color, description }) {
  const colorConfig = {
    yellow: { iconBg: "bg-yellow-400", iconCol: "text-slate-900" },
    slateLight: { iconBg: "bg-slate-200", iconCol: "text-slate-600" },
    slateDark: { iconBg: "bg-slate-900", iconCol: "text-yellow-400" },
    red: { iconBg: "bg-red-100", iconCol: "text-red-600" },
    green: { iconBg: "bg-green-100", iconCol: "text-green-600" }
  };
  const config = colorConfig[color] || colorConfig.slateDark;

  return (
    <Card className="border-slate-200 shadow-sm bg-white hover:border-yellow-400 transition-colors">
      <CardContent className="pt-6">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">{title}</p>
            <p className="text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.iconCol}`} />
          </div>
        </div>
        <div className="text-sm font-bold text-slate-900">
          {change}
          <span className="text-[10px] text-slate-400 uppercase ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryMini({ label, value, icon: Icon, bg, small }) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center`}>
      <Icon className="w-5 h-5 mx-auto mb-1.5 text-slate-600" />
      <p className={`font-bold text-slate-900 ${small ? "text-sm truncate" : "text-xl"}`}>
        {value}
      </p>
      <p className="text-[10px] text-slate-500 uppercase mt-0.5">{label}</p>
    </div>
  );
}

function DetailMini({ label, value, change, suffix = "%", invert, icon }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <p className="text-xs text-slate-500 uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900">
        {icon}{value}
      </p>
      {change !== undefined && (
        <TrendIndicator value={invert ? -change : change} suffix={suffix} />
      )}
    </div>
  );
}

function MiniSparkline({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 56;
  const step = w / (data.length - 1);
  const trending = data[data.length - 1] >= data[0];

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={trending ? "#10b981" : "#ef4444"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProgressRow({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>{label}</span>
        <span className="font-bold">{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function SortableHeader({ label, field, toggleSort, SortIcon }) {
  return (
    <th
      className="py-3 px-2 text-xs font-bold text-slate-500 uppercase cursor-pointer select-none hover:text-slate-900 transition-colors"
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon field={field} />
      </span>
    </th>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="text-center py-12 text-slate-500">
      <Icon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
      <p>{text}</p>
    </div>
  );
}