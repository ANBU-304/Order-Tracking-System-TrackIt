"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  MapPin, Package, Truck, CreditCard, ChevronLeft, 
  Clock, Loader2, User, Box, ShieldCheck, Phone,
  Download, CheckCircle
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Separator } from "./ui/Separator";
import { PaymentModal } from "./PaymentModal";
import { InvoicePreview } from "./InvoicePreview";
import { toast } from "sonner";

import trackingService from "../services/trackingService";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const createInvoiceData = (order, payment) => {
  if (!order && !payment) return null;
  const amount = payment?.amount || order?.totalAmount || order?.totalPrice || 0;
  const subtotal = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return {
    invoiceNumber: `INV-${(payment?.paymentId || payment?.id || order?.orderId || Date.now()).toString().substring(0, 12)}`,
    date: payment?.paymentTime 
      ? new Date(payment.paymentTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    customerName: (payment?.email || order?.email || "Customer").split('@')[0].toUpperCase(),
    customerEmail: payment?.email || order?.email || "N/A",
    customerPhone: payment?.phonenumber || order?.phonenumber || "N/A",
    address: payment?.orderLocation || order?.location || "N/A",
    orderId: payment?.orderId || order?.orderId || "N/A",
    paymentId: payment?.paymentId || payment?.id || "N/A",
    razorpayOrderId: payment?.razorpayOrderId || "N/A",
    razorpayPaymentId: payment?.razorpayPaymentId || "N/A",
    paymentMethod: payment?.paymentMethod || "RAZORPAY",
    paymentStatus: payment?.paymentStatus || "COMPLETED",
    items: [{ name: "Shipping Fee", description: "Express delivery", qty: 1, rate: subtotal, amount: subtotal }],
    subtotal, tax, total,
    weight: order?.weight || "N/A"
  };
};

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("CHECKING");
  const [paymentData, setPaymentData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const initPage = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const order = await orderService.getOrderById(id);
        setOrderData(order);
        try {
          const payment = await paymentService.getPaymentByOrderId(order?.orderId || id);
          if (payment && payment.paymentStatus?.toUpperCase() === "COMPLETED") {
            setPaymentStatus("COMPLETED");
            setPaymentData(payment);
            setInvoiceData(createInvoiceData(order, payment));
          } else {
            setPaymentStatus("PENDING");
          }
        } catch (e) {
          setPaymentStatus("PENDING");
        }
      } catch (error) {
        toast.error("Failed to load details");
        setPaymentStatus("PENDING");
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [id]);

  const handlePaymentSuccess = useCallback((paymentResponse) => {
    setPaymentStatus("COMPLETED");
    setPaymentData(paymentResponse);
    setInvoiceData(createInvoiceData(orderData, paymentResponse));
    setPaymentModalOpen(false);
    toast.success("Payment Verified!");
    setTimeout(() => setShowInvoice(true), 1000);
  }, [orderData]);

  const displayPrice = useMemo(() => {
    const price = paymentData?.amount || orderData?.totalAmount || orderData?.totalPrice || 0;
    return typeof price === "number" ? price : parseFloat(price) || 0;
  }, [orderData, paymentData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
      </div>
    );
  }

  const currentStatus = orderData?.status || "In Transit";
  const progressValue = currentStatus.toLowerCase() === "delivered" ? 100 : 75;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2 text-slate-500 hover:bg-slate-200">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">TRACK SHIPMENT</h1>
            <p className="font-mono text-sm text-slate-400 uppercase">ORDER: {orderData?.orderId || id}</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-yellow-400 text-slate-900 font-bold px-4 py-1 uppercase border-none">
              {currentStatus}
            </Badge>
            {paymentStatus === "COMPLETED" && (
              <Badge className="bg-slate-900 text-yellow-400 font-bold px-4 py-1 uppercase">
                <CheckCircle className="w-3 h-3 mr-1" /> PAID
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-slate-900 w-full" />
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-2xl">
                      <Clock className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Delivery</p>
                      <p className="text-xl font-black text-slate-900">
                        {formatDate(paymentData?.estimatedDelivery || orderData?.estimatedDeliveryDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{progressValue}% Complete</span>
                    <Progress value={progressValue} className="w-32 h-3 bg-slate-100 mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 relative">
                  <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
                  {['Ordered', 'Shipped', 'Transit', 'Arrived'].map((step, idx) => (
                    <div key={step} className="flex flex-col items-center gap-3 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm 
                        ${progressValue >= (idx + 1) * 25 ? 'bg-slate-900 text-yellow-400' : 'bg-slate-100 text-slate-300'}`}>
                        {idx === 0 ? <Box className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-500">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg h-[400px] overflow-hidden rounded-3xl">
              <MapContainer center={[orderData?.latitude || 11.0168, orderData?.longitude || 76.9558]} zoom={13} className="h-full w-full z-0">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[orderData?.latitude || 11.0168, orderData?.longitude || 76.9558]} icon={customIcon}>
                  <Popup>📍 {orderData?.location}</Popup>
                </Marker>
              </MapContainer>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-slate-900 text-white rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <User className="text-yellow-400" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold truncate uppercase">{paymentData?.email?.split('@')[0] || "Customer"}</h3>
                    <p className="text-xs text-slate-400">Verified Consignee</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <p className="text-slate-300">{paymentData?.phonenumber || orderData?.phonenumber || "N/A"}</p>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <p className="text-slate-300 leading-snug">{paymentData?.orderLocation || orderData?.location || "N/A"}</p>
                  </div>
                  <div className="flex gap-3">
                    <Package className="w-4 h-4 text-slate-500 shrink-0" />
                    <p className="text-slate-300">Weight: <span className="text-yellow-400 font-bold">{orderData?.weight || "N/A"} kg</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 shadow-xl bg-white rounded-2xl overflow-hidden transition-all ${
              paymentStatus === "COMPLETED" ? 'border-slate-900' : 'border-yellow-400'
            }`}>
              <CardHeader className={`py-3 ${paymentStatus === "COMPLETED" ? 'bg-slate-900' : 'bg-yellow-400'}`}>
                <CardTitle className={`text-sm font-black uppercase text-center flex items-center justify-center gap-2 ${
                  paymentStatus === "COMPLETED" ? 'text-yellow-400' : 'text-slate-900'
                }`}>
                  {paymentStatus === "COMPLETED" ? "Payment Complete" : "Billing Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400 text-xs font-bold uppercase">Amount</span>
                  <span className="text-3xl font-black text-slate-900">₹{displayPrice.toFixed(2)}</span>
                </div>

                <Separator />

                {paymentStatus === "COMPLETED" ? (
                  <Button onClick={() => setShowInvoice(true)} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-black rounded-xl shadow-lg">
                    <Download className="w-5 h-5 mr-2" /> DOWNLOAD INVOICE
                  </Button>
                ) : (
                  <Button onClick={() => setPaymentModalOpen(true)} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-black rounded-xl shadow-lg">
                    <CreditCard className="w-5 h-5 mr-2" /> PAY SECURELY
                  </Button>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <ShieldCheck className="w-3 h-3 text-slate-900" /> Secure Encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <PaymentModal amount={displayPrice} orderId={orderData?.orderId || id} onClose={() => setPaymentModalOpen(false)} onSuccess={handlePaymentSuccess} />
      )}
      {showInvoice && invoiceData && (
        <InvoicePreview invoiceData={invoiceData} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}