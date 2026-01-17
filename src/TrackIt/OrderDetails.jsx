import { useParams } from "react-router-dom";
import {
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Flag,
  CreditCard
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
import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";    


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
    {
      id: "1",
      status: "Out for Delivery",
      location: "San Francisco, CA",
      timestamp: "2026-01-03 08:30 AM",
      description: "Package is on the delivery vehicle"
    },
    {
      id: "2",
      status: "Arrived at Facility",
      location: "San Francisco Distribution Center",
      timestamp: "2026-01-03 06:15 AM",
      description: "Package arrived at local facility"
    },
    {
      id: "3",
      status: "In Transit",
      location: "Oakland, CA",
      timestamp: "2026-01-02 11:45 PM",
      description: "Package in transit to destination"
    },
    {
      id: "4",
      status: "Departed Facility",
      location: "Los Angeles, CA",
      timestamp: "2026-01-02 03:20 PM",
      description: "Package departed from sorting facility"
    },
    {
      id: "5",
      status: "Picked Up",
      location: "Los Angeles, CA",
      timestamp: "2026-01-01 02:00 PM",
      description: "Package picked up by carrier"
    },
    {
      id: "6",
      status: "Order Placed",
      location: "Online",
      timestamp: "2026-01-01 10:30 AM",
      description: "Order confirmed and processing"
    }
  ]
};

/* ---------------- HELPERS ---------------- */

const getStatusIcon = (status) => {
  if (status.includes("Delivered")) {
    return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  }
  if (status.includes("Out for Delivery")) {
    return <Truck className="w-5 h-5 text-blue-600" />;
  }
  if (status.includes("Exception") || status.includes("Delayed")) {
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  }
  return <Package className="w-5 h-5 text-gray-600" />;
};

/* ---------------- COMPONENT ---------------- */

export function OrderDetails() {
  const { id } = useParams();
  const data = mockTrackingData;

  const [isInvoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 animate-slide-in">
          <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tracking Details</h1>
          <p className="text-gray-600">Order ID: {id || data.orderId}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="shadow-xl border-0 overflow-hidden animate-scale-in">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Current Status</CardTitle>
                    <CardDescription>{data.carrier}</CardDescription>
                  </div>
                  <Badge
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md"
                  >
                    {data.currentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Delivery Progress</span>
                      <span className="text-sm font-medium">{data.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={data.progress} className="h-3" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span>Estimated Delivery</span>
                    </div>
                    <span className="font-semibold text-indigo-600">{data.estimatedDelivery}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Steps */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Shipment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-2 shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-center font-medium">Ordered</span>
                  </div>
                  <div className="flex-1 h-1.5 bg-gradient-to-r from-green-400 to-green-500 -mx-2 rounded-full"></div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-2 shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-center font-medium">Shipped</span>
                  </div>
                  <div className="flex-1 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 -mx-2 rounded-full"></div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-2 ring-4 ring-blue-200 shadow-lg animate-pulse">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-center font-medium">Out for Delivery</span>
                  </div>
                  <div className="flex-1 h-1.5 bg-gray-200 -mx-2 rounded-full"></div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow">
                      <Flag className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-500">Delivered</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Package Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-xl flex items-center justify-center relative overflow-hidden">
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

            {/* Tracking Timeline */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
                <CardDescription>Complete journey of your package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-100 ring-4 ring-blue-200' : 'bg-gray-100'
                        }`}>
                          {getStatusIcon(event.status)}
                        </div>
                        {index < data.trackingEvents.length - 1 && (
                          <div className="w-0.5 h-full min-h-[40px] bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <h4>{event.status}</h4>
                          <span className="text-sm text-gray-500">{event.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recipient</p>
                  <p className="font-medium">{data.recipientName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                  <p className="text-sm">{data.shippingAddress}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="font-medium text-[#1E3A8A]">{data.estimatedDelivery}</p>
                </div>
              </CardContent>
            </Card>

            {/* Carrier Contact */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>Carrier Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Carrier</p>
                  <p className="font-medium">{data.carrier}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <a href="tel:1-800-463-3339" className="flex items-center gap-2 text-sm text-[#1E3A8A] hover:text-[#14B8A6] transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>1-800-463-3339</span>
                  </a>
                  <a href="mailto:support@fedex.com" className="flex items-center gap-2 text-sm text-[#1E3A8A] hover:text-[#14B8A6] transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>support@fedex.com</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Cost Calculator */}
            <ShippingCalculator initialWeight={2.5} />

            {/* Shipping Payment */}
            <Card className="shadow-md border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardHeader>
                <CardTitle>Shipping Payment</CardTitle>
                <CardDescription>Complete your shipping payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Shipping Amount</span>
                  <span className="text-xl font-bold text-indigo-600">₹90.00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                    Pending
                  </Badge>
                </div>
                <Separator />
                <Button 
                  className="w-full gradient-success hover:opacity-90 shadow-md"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {isInvoicePreviewOpen && (
        <InvoicePreview
          invoiceData={generateSampleInvoice(id || data.orderId)}
          onClose={() => setInvoicePreviewOpen(false)}
        />
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          amount={90.00}
          orderId={id || data.orderId}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
