// src/TrackIt/data/dashboardData.js

export const deliveryPerformanceData = [
  { month: "Aug", onTime: 92, delayed: 8 },
  { month: "Sep", onTime: 89, delayed: 11 },
  { month: "Oct", onTime: 94, delayed: 6 },
  { month: "Nov", onTime: 91, delayed: 9 },
  { month: "Dec", onTime: 88, delayed: 12 },
  { month: "Jan", onTime: 95, delayed: 5 },
];

export const carrierPerformanceData = [
  { carrier: "FedEx", deliveries: 1250, onTime: 94, avgTime: 2.3 },
  { carrier: "UPS", deliveries: 980, onTime: 91, avgTime: 2.8 },
  { carrier: "USPS", deliveries: 1100, onTime: 87, avgTime: 3.5 },
  { carrier: "DHL", deliveries: 650, onTime: 93, avgTime: 2.5 },
  { carrier: "Amazon", deliveries: 890, onTime: 96, avgTime: 1.8 },
];

export const orderStatusData = [
  { name: "Delivered", value: 3245, color: "#10B981" },
  { name: "In Transit", value: 892, color: "#3B82F6" },
  { name: "Processing", value: 234, color: "#F59E0B" },
  { name: "Exception", value: 67, color: "#EF4444" },
];

export const dailyShipmentsData = [
  { date: "Dec 28", shipments: 145 },
  { date: "Dec 29", shipments: 158 },
  { date: "Dec 30", shipments: 132 },
  { date: "Dec 31", shipments: 98 },
  { date: "Jan 1", shipments: 87 },
  { date: "Jan 2", shipments: 156 },
  { date: "Jan 3", shipments: 178 },
];

export const regionData = [
  { region: "West Coast", orders: 1234, percentage: 28 },
  { region: "East Coast", orders: 1098, percentage: 25 },
  { region: "Midwest", orders: 876, percentage: 20 },
  { region: "South", orders: 789, percentage: 18 },
  { region: "International", orders: 341, percentage: 8 },
];

export const COLORS = [
  "#1E3A8A",
  "#14B8A6",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
];
