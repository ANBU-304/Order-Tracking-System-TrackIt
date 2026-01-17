import { X, Download, Package } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";

export function InvoicePreview({ invoiceData, onClose }) {
  const subtotal = invoiceData.productPrice * invoiceData.quantity;
  const total = subtotal + invoiceData.shippingCost + invoiceData.tax;

  const handleDownload = () => {
    const element = document.getElementById("invoice-content");
    if (element) {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between">
          <h2 className="text-xl font-bold">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <button onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        <CardContent className="p-8" id="invoice-content">
          {/* Company Header */}
          <div className="flex justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-indigo-600">TrackIt</h1>
                  <p className="text-sm text-gray-600">Logistics & Delivery</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">123 Business Street</p>
              <p className="text-sm text-gray-600">San Francisco, CA 94102</p>
              <p className="text-sm text-gray-600">support@trackit.com</p>
              <p className="text-sm text-gray-600">+1-800-TRACKIT</p>
            </div>

            <div className="text-right">
              <div className="px-4 py-2 bg-indigo-100 rounded-lg mb-3">
                <p className="text-xs text-gray-600">Invoice Number</p>
                <p className="text-xl font-bold text-indigo-600">
                  {invoiceData.invoiceNumber}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                <b>Date:</b> {invoiceData.invoiceDate}
              </p>
              <p className="text-sm text-gray-600">
                <b>Order ID:</b> {invoiceData.orderId}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Customer */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To</h3>
              <p className="font-medium">{invoiceData.customerName}</p>
              <p className="text-sm text-gray-600">{invoiceData.customerEmail}</p>
              <p className="text-sm text-gray-600">{invoiceData.customerPhone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ship To</h3>
              <p className="text-sm text-gray-600">
                {invoiceData.shippingAddress}
              </p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Description</th>
                <th className="text-center py-3">Weight</th>
                <th className="text-center py-3">Qty</th>
                <th className="text-right py-3">Price</th>
                <th className="text-right py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4">{invoiceData.productName}</td>
                <td className="py-4 text-center">{invoiceData.productWeight}</td>
                <td className="py-4 text-center">{invoiceData.quantity}</td>
                <td className="py-4 text-right">
                  ₹{invoiceData.productPrice.toFixed(2)}
                </td>
                <td className="py-4 text-right font-medium">
                  ₹{subtotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{invoiceData.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{invoiceData.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-indigo-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Payment Status</p>
            <p
              className={`text-lg font-semibold ${
                invoiceData.paymentStatus === "Paid"
                  ? "text-green-600"
                  : invoiceData.paymentStatus === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {invoiceData.paymentStatus}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
            Thank you for choosing TrackIt!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}