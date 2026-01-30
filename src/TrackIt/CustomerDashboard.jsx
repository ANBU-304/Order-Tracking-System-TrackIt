import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Search, Eye, FileText, AlertCircle, Clock, CheckCircle2, ChevronRight, Download
} from 'lucide-react';

import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Progress } from './ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Layout } from './Layout';


import { InvoicePreview } from "./InvoicePreview";
import { generateSampleInvoice } from "./invoiceUtils";

const mockOrders = [
  { id: 'ORD-2025-001', status: 'out_for_delivery', carrier: 'FedEx Express', estimatedDelivery: 'Today by 8:00 PM', progress: 75, items: 'Electronics Package', trackingNumber: 'TRK123456789' },
  { id: 'ORD-2024-002', status: 'in_transit', carrier: 'UPS Ground', estimatedDelivery: 'Jan 5, 2026', progress: 45, items: 'Books (3 items)', trackingNumber: 'TRK987654321' },
  { id: 'ORD-2023-158', status: 'delivered', carrier: 'USPS Priority', estimatedDelivery: 'Delivered Dec 28', progress: 100, items: 'Clothing', trackingNumber: 'TRK456789123' },
  { id: 'ORD-2026-003', status: 'exception', carrier: 'FedEx Ground', estimatedDelivery: 'Delayed - Jan 6', progress: 30, items: 'Furniture', trackingNumber: 'TRK321654987' }
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'delivered':
      return { label: 'Delivered', className: 'bg-slate-900 text-yellow-400', icon: CheckCircle2 };
    case 'out_for_delivery':
      return { label: 'Out for Delivery', className: 'bg-yellow-400 text-slate-900', icon: Clock };
    case 'in_transit':
      return { label: 'In Transit', className: 'bg-slate-100 text-slate-600', icon: Package };
    case 'exception':
      return { label: 'Exception', className: 'bg-red-500 text-white', icon: AlertCircle };
    default:
      return { label: 'Unknown', className: 'bg-gray-100 text-gray-700', icon: Package };
  }
};

export function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null); // Proper State Placement
  const navigate = useNavigate();

  const filteredOrders = mockOrders.filter((o) => {
    const matchesTab = 
      selectedTab === 'all' || 
      (selectedTab === 'active' && o.status !== 'delivered') ||
      (selectedTab === 'delivered' && o.status === 'delivered') ||
      (selectedTab === 'exception' && o.status === 'exception');

    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Customer <span className="text-yellow-500">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              Logistics Control / {new Date().getFullYear()} Global Systems
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Active Shipments" value={mockOrders.filter(o => o.status !== 'delivered').length} icon={Package} color="slateDark" />
            <StatCard title="Delivered" value={mockOrders.filter(o => o.status === 'delivered').length} icon={CheckCircle2} color="yellow" />
            <StatCard title="Exceptions" value={mockOrders.filter(o => o.status === 'exception').length} icon={AlertCircle} color="red" />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search ID, Tracking, or Items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-white border-slate-200 rounded-xl focus:ring-yellow-400"
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
              <TabsList className="bg-slate-200/50 p-1 rounded-xl h-12">
                <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-[10px] uppercase">All</TabsTrigger>
                <TabsTrigger value="active" className="rounded-lg px-6 font-bold text-[10px] uppercase">Active</TabsTrigger>
                <TabsTrigger value="delivered" className="rounded-lg px-6 font-bold text-[10px] uppercase">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Orders Feed */}
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = getStatusConfig(order.status);
              return (
                <Card key={order.id} className="border-none shadow-sm hover:shadow-md transition-all group bg-white rounded-2xl overflow-hidden">
                   <div className={`h-1 w-full ${status.className.split(' ')[0]}`} />
                   <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      {/* Identity */}
                      <div className="lg:w-1/4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">{order.id}</h4>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">{order.items}</p>
                        <Badge className={`mt-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${status.className}`}>
                          <status.icon className="w-3 h-3 mr-1" /> {status.label}
                        </Badge>
                      </div>

                      {/* Logistics Info */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Carrier</p>
                          <p className="text-xs font-bold text-slate-700">{order.carrier}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Tracking</p>
                          <p className="text-xs font-mono font-medium text-slate-500">{order.trackingNumber}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Est. Delivery</p>
                          <p className="text-xs font-black text-slate-900">{order.estimatedDelivery}</p>
                        </div>
                      </div>

                      {/* Transit Progress */}
                      {order.status !== 'delivered' && (
                        <div className="lg:w-1/5">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-1.5">
                            <span>In Transit</span>
                            <span className="text-slate-900">{order.progress}%</span>
                          </div>
                          <Progress value={order.progress} className="h-1.5 bg-slate-100" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 min-w-[200px]">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="flex-1 border-slate-200 text-slate-600 font-bold text-xs rounded-xl h-10 hover:bg-slate-50"
                        >
                          <FileText className="w-3.5 h-3.5 mr-2" /> Invoice
                        </Button>
                        <Button 
                          onClick={() => navigate(`/order/${order.trackingNumber}`)}
                          className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-bold text-xs rounded-xl h-10"
                        >
                          <Eye className="w-3.5 h-3.5 mr-2" /> Track
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Invoice Modal Integration */}
      {selectedInvoiceOrder && (
        <InvoicePreview
          invoiceData={generateSampleInvoice(selectedInvoiceOrder.id)}
          onClose={() => setSelectedInvoiceOrder(false)}
        />
      )}
    </div>
  );
}

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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
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