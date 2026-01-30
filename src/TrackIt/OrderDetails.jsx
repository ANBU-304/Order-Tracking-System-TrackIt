import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Flag,
  CreditCard,
  ChevronLeft,
  FileText, 
  Clock,  
  User 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Separator } from "./ui/Separator";

import { InvoicePreview } from "./InvoicePreview";
import { generateSampleInvoice } from "./invoiceUtils";
import { ShippingCalculator } from "./ShippingCalculator";
import { PaymentModal } from "./PaymentModal";

/* ---------------- MOCK DATA ---------------- */
const mockTrackingData = {
  orderId: "TRK123456789",
  carrier: "FedEx Express",
  currentStatus: "Out for Delivery",
  estimatedDelivery: "Today by 8:00 PM",
  progress: 75,
  recipientName: "John Smith",
  shippingAddress: "123 Main Street, San Francisco, CA 94102",
  trackingEvents: [
    { id: "1", status: "Out for Delivery", location: "San Francisco, CA", timestamp: "2026-01-03 08:30 AM", description: "Package is on the delivery vehicle" },
    { id: "2", status: "Arrived at Facility", location: "SF Distribution Center", timestamp: "2026-01-03 06:15 AM", description: "Package arrived at local facility" },
    { id: "3", status: "In Transit", location: "Oakland, CA", timestamp: "2026-01-02 11:45 PM", description: "Package in transit to destination" },
    { id: "4", status: "Departed Facility", location: "Los Angeles, CA", timestamp: "2026-01-02 03:20 PM", description: "Package departed from sorting facility" },
    { id: "5", status: "Picked Up", location: "Los Angeles, CA", timestamp: "2026-01-01 02:00 PM", description: "Package picked up by carrier" },
    { id: "6", status: "Order Placed", location: "Online", timestamp: "2026-01-01 10:30 AM", description: "Order confirmed and processing" }
  ]
};

const getStatusIcon = (status) => {
  if (status.includes("Delivered")) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  if (status.includes("Out for Delivery")) return <Truck className="w-5 h-5 text-blue-600" />;
  if (status.includes("Exception") || status.includes("Delayed")) return <AlertCircle className="w-5 h-5 text-red-600" />;
  return <Package className="w-5 h-5 text-gray-600" />;
};

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = mockTrackingData;

  const [isInvoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-2 -ml-2 text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Track Shipment</h1>
            <p className="text-slate-500 font-mono text-sm">ID: {id || data.orderId}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setInvoicePreviewOpen(true)} className="border-slate-200">
              <FileText className="w-4 h-4 mr-2" /> Invoice
            </Button>
      
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-yellow-400 w-full" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Live Progress</CardTitle>
                  <Badge className="bg-yellow-400 text-slate-900 border-none font-bold">
                    {data.currentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative flex justify-between items-center py-4">
                  {[
                    { label: "Ordered", icon: CheckCircle2, active: true },
                    { label: "Shipped", icon: Package, active: true },
                    { label: "On Way", icon: Truck, active: true, pulse: true },
                    { label: "Delivered", icon: Flag, active: false }
                  ].map((step, i, arr) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm 
                          ${step.active ? 'bg-slate-900 text-yellow-400' : 'bg-slate-100 text-slate-400'} 
                          ${step.pulse ? 'ring-4 ring-yellow-100 animate-pulse' : ''}`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter 
                          ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-[-10px] mb-6 
                          ${arr[i+1].active ? 'bg-slate-900' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Estimated Arrival</p>
                      <p className="font-bold text-slate-900">{data.estimatedDelivery}</p>
                    </div>
                  </div>
                  <Progress value={data.progress} className="w-24 h-2 bg-slate-200" />
                </div>
              </CardContent>
            </Card>

 {/* Map Placeholder */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Package Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gradient-to-br from-yelow-100 via-yellow-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,50 Q25,30 50,50 T100,50" stroke="#6366F1" strokeWidth="0.5" fill="none" />
                      <path d="M0,60 Q25,40 50,60 T100,60" stroke="#6366F1" strokeWidth="0.5" fill="none" />
                      <path d="M20,0 L20,100" stroke="#6366F1" strokeWidth="0.5" />
                      <path d="M40,0 L40,100" stroke="#6366F1" strokeWidth="0.5" />
                      <path d="M60,0 L60,100" stroke="#6366F1" strokeWidth="0.5" />
                      <path d="M80,0 L80,100" stroke="#6366F1" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-indigo-600 font-semibold text-lg">San Francisco, CA</p>
                    <p className="text-sm text-gray-600">Last updated: 8:30 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Shipment Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {data.trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${index === 0 ? 'bg-slate-900 text-yellow-400' : 'bg-slate-100 text-slate-400'}`}>
                          {getStatusIcon(event.status)}
                        </div>
                        {index < data.trackingEvents.length - 1 && (
                          <div className="w-px h-16 bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-slate-900">{event.status}</h4>
                          <span className="text-[11px] font-bold text-slate-400">{event.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{event.description}</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Delivery Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Recipient</p>
                    <p className="text-sm font-bold text-slate-900">{data.recipientName}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Address</p>
                    <p className="text-sm text-slate-600">{data.shippingAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ShippingCalculator initialWeight={2.5} />

            <Card className="border-slate-200 shadow-md bg-white overflow-hidden">
               <div className="h-1 bg-slate-900" />
              <CardHeader>
                <CardTitle className="text-base">Shipping Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                   <span className="text-sm font-medium text-slate-600">Total</span>
                   <span className="text-xl font-black text-slate-900">₹90.00</span>
                </div>
                <Button 
                  className="w-full bg-slate-900 text-yellow-400 hover:bg-slate-800 font-bold"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isInvoicePreviewOpen && (
        <InvoicePreview
          invoiceData={generateSampleInvoice(id || data.orderId)}
          onClose={() => setInvoicePreviewOpen(false)}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          amount={90.00}
          orderId={id || data.orderId}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={() => alert('Payment Successful!')}
        />
      )}
    </div>
  );
}