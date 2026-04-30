// InvoicePreview.jsx - Email button removed
import { useState, useEffect } from 'react';
import { X, Download, Loader2, FileText, Printer, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { downloadInvoicePDF } from './invoiceUtils';
import paymentService from '../services/paymentService';
import { toast } from 'sonner';

export function InvoicePreview({ order, invoiceData: propInvoiceData, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  const isDirectInvoice = !!propInvoiceData;
  const isOrderMode = !!order && !propInvoiceData;

  useEffect(() => {
    if (isDirectInvoice) {
      setInvoiceData(propInvoiceData);
      setLoading(false);
    } else if (isOrderMode) {
      fetchPaymentAndBuildInvoice();
    }
  }, [propInvoiceData, order]);

  const fetchPaymentAndBuildInvoice = async () => {
    if (!order?.orderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const payment = await paymentService.getPaymentByOrderId(order.orderId);
      setPaymentData(payment);
      const builtInvoice = buildInvoiceFromOrderAndPayment(order, payment);
      setInvoiceData(builtInvoice);
    } catch (error) {
      const builtInvoice = buildInvoiceFromOrderAndPayment(order, null);
      setInvoiceData(builtInvoice);
    } finally {
      setLoading(false);
    }
  };

  const buildInvoiceFromOrderAndPayment = (orderData, payment) => {
    const amount = payment?.amount || orderData?.totalAmount || orderData?.totalPrice || 0;
    const subtotal = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const today = new Date();

    return {
      invoiceNumber: `INV-${payment?.paymentId || orderData?.orderId || Date.now()}`,
      date: today.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      customerName: (payment?.email || orderData?.email || "Customer").split('@')[0],
      customerEmail: payment?.email || orderData?.email || "N/A",
      customerPhone: payment?.phonenumber || orderData?.phonenumber || "N/A",
      address: payment?.orderLocation || orderData?.location || "N/A",
      orderId: payment?.orderId || orderData?.orderId || "N/A",
      paymentId: payment?.paymentId || payment?.id || "N/A",
      razorpayPaymentId: payment?.razorpayPaymentId || "N/A",
      razorpayOrderId: payment?.razorpayOrderId || "N/A",
      paymentMethod: payment?.paymentMethod || "RAZORPAY",
      paymentStatus: payment?.paymentStatus || "PENDING",
      paymentTime: payment?.paymentTime || null,
      items: [
        { name: "Shipping Service", description: `Order ${orderData?.orderId}`, qty: 1, rate: subtotal * 0.6, amount: subtotal * 0.6 },
        { name: "Handling Fee", description: "Package processing", qty: 1, rate: subtotal * 0.25, amount: subtotal * 0.25 },
        { name: "Insurance", description: "Shipment protection", qty: 1, rate: subtotal * 0.15, amount: subtotal * 0.15 },
      ],
      subtotal,
      tax,
      total,
      company: {
        name: 'TrackIt Logistics',
        address: '123 Shipping Street',
        city: 'Mumbai, MH 400001',
        email: 'billing@trackit.com',
        phone: '+91 98765 43210',
        gstin: 'GSTIN123456789',
      }
    };
  };

  const handleRetry = () => {
    if (isOrderMode) {
      fetchPaymentAndBuildInvoice();
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoicePDF(invoiceData);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // No data
  if (!order && !propInvoiceData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Data Available</h3>
          <p className="text-slate-500 mb-6">Invoice data not found.</p>
          <Button onClick={onClose} className="bg-slate-900 text-white">Close</Button>
        </Card>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Loading Invoice</h3>
          <p className="text-slate-500">Fetching payment details...</p>
        </Card>
      </div>
    );
  }

  // No invoice
  if (!invoiceData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Invoice Not Ready</h3>
          <p className="text-slate-500 mb-6">Could not generate invoice.</p>
          <div className="flex gap-3">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
            <Button onClick={onClose} className="flex-1 bg-slate-900 text-white">Close</Button>
          </div>
        </Card>
      </div>
    );
  }

  const isPaymentCompleted = invoiceData.paymentStatus === 'COMPLETED' || 
                             invoiceData.paymentStatus === 'SUCCESS' || 
                             invoiceData.paymentStatus === 'PAID';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Invoice</h2>
              <p className="text-xs text-slate-400">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`px-6 py-3 flex items-center justify-between border-b ${
          isPaymentCompleted ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'
        }`}>
          <div className="flex items-center gap-2">
            {isPaymentCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            )}
            <p className={`text-sm font-medium ${isPaymentCompleted ? 'text-green-700' : 'text-yellow-700'}`}>
              {isPaymentCompleted ? `Paid via ${invoiceData.paymentMethod}` : 'Payment pending'}
            </p>
          </div>
          <span className="text-sm font-bold text-slate-900">₹{(invoiceData.total - invoiceData.tax|| 0).toFixed(2)}</span>
        </div>

        {/* Invoice Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[55vh]">
          {/* Header Info */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900">TRACKIT</h1>
              <p className="text-sm text-slate-500 mt-1">{invoiceData.company?.address}</p>
              <p className="text-sm text-slate-500">{invoiceData.company?.city}</p>
              <p className="text-xs text-slate-400 mt-1">GSTIN: {invoiceData.company?.gstin}</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-yellow-400 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold mb-2">
                INVOICE
              </div>
              <p className="text-sm font-mono text-slate-600">#{invoiceData.invoiceNumber}</p>
              <p className="text-xs text-slate-400 mt-1">Date: {invoiceData.date}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">From</p>
              <p className="text-sm font-bold text-slate-900">{invoiceData.company?.name}</p>
              <p className="text-sm text-slate-600">{invoiceData.company?.email}</p>
              <p className="text-sm text-slate-600">{invoiceData.company?.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="text-sm font-bold text-slate-900">{invoiceData.customerName}</p>
              <p className="text-sm text-slate-600">{invoiceData.customerEmail}</p>
              <p className="text-sm text-slate-600">{invoiceData.customerPhone}</p>
            </div>
          </div>

          {/* Payment Details */}
          {isPaymentCompleted && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-3">
                Payment Details
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs mb-1">Payment ID</span>
                  <p className="font-mono text-xs text-slate-700">{invoiceData.razorpayPaymentId}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs mb-1">Method</span>
                  <p className="text-slate-700 font-medium">{invoiceData.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs mb-1">Order ID</span>
                  <p className="font-mono text-xs text-slate-700">{invoiceData.orderId}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs mb-1">Status</span>
                  <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                    {invoiceData.paymentStatus}
                  </span>
                </div>
                {invoiceData.paymentTime && (
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-xs mb-1">Payment Time</span>
                    <p className="text-xs text-slate-700">{new Date(invoiceData.paymentTime).toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-6">
            <div className="bg-slate-900 text-white rounded-t-xl px-4 py-3 grid grid-cols-12 gap-4 text-xs font-bold uppercase">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <div className="border border-slate-200 border-t-0 rounded-b-xl overflow-hidden">
              {(invoiceData.items || []).map((item, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-3 grid grid-cols-12 gap-4 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                  <div className="col-span-6">
                    <p className="text-slate-700 font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <div className="col-span-2 text-center text-slate-600">{item.qty}</div>
                  <div className="col-span-2 text-right text-slate-600">₹{(item.rate- invoiceData.tax || 0).toFixed(2)}</div>
                  <div className="col-span-2 text-right font-medium text-slate-900">₹{(item.amount- invoiceData.tax || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-700">₹{(invoiceData.subtotal - invoiceData.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST (18%)</span>
                <span className="text-slate-700">₹{(invoiceData.tax || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg text-slate-900">₹{(invoiceData.total- invoiceData.tax || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          {invoiceData.address && invoiceData.address !== 'N/A' && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Address</p>
              <p className="text-sm text-slate-700">{invoiceData.address}</p>
            </div>
          )}
        </CardContent>

        {/* ✅ Footer Actions - EMAIL BUTTON REMOVED */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrint} 
            className="flex-1 h-12 rounded-xl border-slate-200"
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 h-12 rounded-xl bg-slate-900 text-yellow-400 hover:bg-slate-800"
          >
            {downloading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Download PDF</>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}