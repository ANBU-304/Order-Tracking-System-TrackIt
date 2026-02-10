import { useState } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Shield,
} from "lucide-react";

import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Separator } from "./ui/Separator";
import { useAuth } from "./useAuth"; 

export function PaymentModal({ amount, orderId, onClose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "Pay using UPI apps",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "card",
      name: "Card",
      icon: CreditCard,
      description: "Debit/Credit Card",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building,
      description: "Pay via bank",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const popularBanks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
  ];
  
  // Check authentication
  const { isAuthenticated } = useAuth(); // Assuming isAuth is a hook that returns auth status

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsProcessing(false);
    setShowSuccess(true);

    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Card className="bg-white max-w-lg w-full shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              ₹{amount.toFixed(2)} paid successfully
            </p>
            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Card className="bg-white max-w-md w-full shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to complete this payment.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-slate-900 text-yellow-400 hover:bg-slate-800"
                onClick={() => {   
                  // You might want to redirect to login page
                  // or trigger a login modal
                  onClose(); // Close payment modal first
                  // Then navigate to login or show login modal
                  window.location.href = "/login";
                  window.location.reload();
                }}
              >
                Login to Continue
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, show payment form
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Complete Payment</h2>
            <p className="text-sm text-gray-600">Order ID: {orderId}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CardContent className="p-6">
          {/* Amount */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <p className="text-3xl font-bold bg-linear-to-r from-yellow-600 to-yellow-600 bg-clip-text text-transparent">
              ₹{amount.toFixed(2)}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-4 rounded-xl border-2 ${
                  selectedMethod === m.id
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                } transition-colors`}
              >
                <m.icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedMethod === m.id ? "text-yellow-600" : "text-gray-600"
                }`} />
                <p className={`text-sm font-medium ${
                  selectedMethod === m.id ? "text-yellow-700" : "text-gray-700"
                }`}>
                  {m.name}
                </p>
              </button>
            ))}
          </div>

          <Separator className="my-6" />

          {/* UPI */}
          {selectedMethod === "upi" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                />
              </div>
              <div className="text-xs text-gray-500">
                Enter your UPI ID or scan a QR code
              </div>
            </div>
          )}

          {/* CARD */}
          {selectedMethod === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card-expiry">Expiry Date</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    type="password"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* NET BANKING */}
          {selectedMethod === "netbanking" && (
            <div className="space-y-2">
              <Label>Select Your Bank</Label>
              {popularBanks.map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`block w-full p-3 border rounded-lg text-left transition-colors ${
                    selectedBank === bank
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          )}

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              Your payment is secured with 256-bit SSL encryption. We do not store your card details.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : `Pay ₹${amount.toFixed(2)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}