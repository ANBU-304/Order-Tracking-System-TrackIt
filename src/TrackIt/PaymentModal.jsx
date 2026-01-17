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
import { toast } from "sonner";

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

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setShowSuccess(true);

    setTimeout(() => {
      toast.success("Payment successful!");
      onSuccess();
      onClose();
    }, 2000);
  };

  /* SUCCESS SCREEN */
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              ₹{amount.toFixed(2)} paid successfully
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* MAIN MODAL */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">Complete Payment</h2>
            <p className="text-sm text-gray-600">Order ID: {orderId}</p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <CardContent className="p-6">
          {/* Amount */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <p className="text-3xl font-bold text-indigo-600">
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
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <m.icon className="mx-auto mb-2" />
                <p className="text-sm font-medium">{m.name}</p>
              </button>
            ))}
          </div>

          <Separator className="my-6" />

          {/* UPI */}
          {selectedMethod === "upi" && (
            <div>
              <Label>UPI ID</Label>
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
              />
            </div>
          )}

          {/* CARD */}
          {selectedMethod === "card" && (
            <div className="space-y-4">
              <Input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
                <Input
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </div>
              <Input
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
          )}

          {/* NET BANKING */}
          {selectedMethod === "netbanking" && (
            <div className="space-y-2">
              {popularBanks.map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`block w-full p-3 border rounded-lg ${
                    selectedBank === bank
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          )}

          {/* Security */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <Shield className="text-green-600 w-4 h-4" />
            Secured by 256-bit SSL
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
