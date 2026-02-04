import React from 'react';
import { X, Download, Printer, FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";

// NAMED EXPORT: This fixes the "Uncaught SyntaxError"
export function InvoicePreview({ invoiceData, onClose }) {
  if (!invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6">
      <Card className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border-none flex flex-col max-h-[95vh]">
        {/* Modal Header - Action Bar */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">Invoice Preview</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Document #{invoiceData.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={handlePrint}
              className="text-white hover:bg-slate-800 hidden sm:flex"
            >
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button 
              className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            <Separator orientation="vertical" className="h-8 bg-slate-700 mx-2" />
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Invoice Content */}
        <CardContent className="overflow-y-auto p-8 sm:p-12 bg-slate-50">
          <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-8 sm:p-12 min-h-[800px] mx-auto max-w-[800px]">
            {/* Invoice Branding */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">TRACKIT<span className="text-yellow-500">.</span></h1>
                <p className="text-slate-500 text-sm">Global Logistics Solutions</p>
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-slate-900 uppercase">Invoice</h3>
                <p className="text-slate-500 font-mono text-sm">{invoiceData.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sender</p>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">TrackIt Logistics HQ</p>
                  <p>450 Logistics Blvd,</p>
                  <p>Supply Chain City, 10001</p>
                  <p>United States</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Ship To</p>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">{invoiceData.customerName}</p>
                  <p>{invoiceData.address}</p>
                  <p>Order ID: {invoiceData.orderId}</p>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-900 text-white p-3 rounded-t-lg text-[10px] font-bold uppercase tracking-widest">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {/* Table Body */}
            <div className="border-x border-slate-100">
              {invoiceData.items?.map((item, index) => (
                <div key={index} className="grid grid-cols-12 p-4 border-b border-slate-50 text-sm text-slate-700 items-center">
                  <div className="col-span-6">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <div className="col-span-2 text-center">{item.qty}</div>
                  <div className="col-span-2 text-right">₹{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold">₹{item.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mt-8">
              <div className="w-full max-w-[240px] space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Tax (5%)</span>
                  <span>₹{invoiceData.tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex justify-between text-lg font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-yellow-600">₹{invoiceData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-20 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Terms & Conditions</p>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                This is a computer-generated document. No signature is required. All shipping services are subject to the TrackIt Standard Terms of Carriage. Payments are non-refundable once the shipment has reached the "In Transit" status.
              </p>
            </div>
          </div>
        </CardContent>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          Securely generated via TrackIt Financial Gateway • © 2026 TrackIt Logistics Inc.
        </div>
      </Card>
    </div>
  );
}