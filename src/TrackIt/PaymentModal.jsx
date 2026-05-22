"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, CreditCard, CheckCircle2, Shield, Loader2, Lock } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { useAuth } from "./useAuth";
import paymentService from "../services/paymentService";
import { toast } from "sonner";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function PaymentModal({ amount, orderId, onClose, onSuccess }) {
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  // Ensure amount is a valid number
  const safeAmount = typeof amount === "number" ? amount : parseFloat(amount || 0);

  // Load Razorpay Script
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadScript = async () => {
      if (window.Razorpay) return;
      
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onerror = () => { 
        if (isMountedRef.current) {
          setError("Gateway Load Failed");
          toast.error("Failed to load payment gateway");
        }
      };
      document.body.appendChild(script);
    };
    
    loadScript();
    
    return () => { 
      isMountedRef.current = false; 
    };
  }, []);

  // Handle Payment
  const handlePayment = async () => {
    if (!isAuthenticated) {
      return toast.error("Please login to continue");
    }
    
    if (!safeAmount || safeAmount <= 0) {
      return toast.error("Invalid payment amount detected.");
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create payment order on backend
      console.log("💳 Creating payment order:", { orderId, amount: safeAmount });
      
      const orderResponse = await paymentService.createPaymentOrder({ 
        orderId, 
        amount: safeAmount 
      });
      
      console.log("✅ Order created:", orderResponse);
      
      // 2. Open Razorpay checkout
      const options = {
        key: orderResponse.razorpayKeyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency || "INR",
        name: "TrackIt Logistics",
        description: `Shipment Fee for Order: ${orderId}`,
        order_id: orderResponse.razorpayOrderId,
        handler: async (response) => {
          console.log("💰 Razorpay payment response:", response);
          
          try {
            // 3. Verify payment on backend
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            
            console.log("🔍 Verifying payment:", verifyPayload);
            
            const verifyResponse = await paymentService.verifyPayment(verifyPayload);
            
            console.log("✅ Verification response:", verifyResponse);

            if (isMountedRef.current) {
              // Backend returns Payment entity after verification
              if (verifyResponse && verifyResponse.paymentStatus === "COMPLETED") {
                setPaymentSuccess(true);
                toast.success("Payment Verified Successfully! 🎉");
                
                setTimeout(() => {
                  if (onSuccess) onSuccess(verifyResponse);
                  onClose();
                }, 1500);
              } else {
                throw new Error("Payment verification failed");
              }
            }
          } catch (verifyErr) {
            console.error("❌ Verification error:", verifyErr);
            
            if (isMountedRef.current) {
              setError("Payment verification failed. Please contact support.");
              toast.error("Verification failed");
              setIsProcessing(false);
            }
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@trackit.com",
        },
        notes: {
          orderId: orderId,
        },
        theme: { 
          color: "#0f172a" 
        },
        modal: { 
          ondismiss: () => {
            if (isMountedRef.current) {
              setIsProcessing(false);
              toast.info("Payment cancelled");
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (err) {
      console.error("❌ Payment error:", err);
      
      // Extract error message
      const errorMessage = typeof err === 'string' 
        ? err 
        : err.response?.data?.message || err.response?.data || err.message || "";
      
      console.log("Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: errorMessage
      });
      
      // Handle "already completed" case
      if (err.response?.status === 400 && 
          (errorMessage.toLowerCase().includes("already completed") || 
           errorMessage.toLowerCase().includes("already paid"))) {
        
        toast.info("Payment already verified!");
        
        // Fetch the existing payment from backend
        try {
          console.log("📥 Fetching existing payment for orderId:", orderId);
          
          const existingPayment = await paymentService.getPaymentByOrderId(orderId);
          
          console.log("✅ Existing payment found:", existingPayment);
          
          if (existingPayment && 
              existingPayment.paymentStatus === "COMPLETED" && 
              isMountedRef.current) {
            
            setPaymentSuccess(true);
            
            // Send complete Payment entity to parent
            if (onSuccess) {
              onSuccess(existingPayment);
            }
            
            setTimeout(() => {
              onClose();
            }, 1000);
          } else {
            throw new Error("Invalid payment data");
          }
        } catch (fetchErr) {
          console.error("❌ Failed to fetch existing payment:", fetchErr);
          toast.error("Could not verify payment. Refreshing page...");
          
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1500);
        }
      } else {
        // Other errors
        setError(errorMessage || "Failed to initialize payment");
        toast.error("Payment initialization failed");
      }
      
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl overflow-hidden bg-white rounded-3xl">
        <div className="h-1.5 bg-yellow-400 w-full" />
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-bold text-slate-900">Secure Checkout</h2>
            </div>
            <button 
              onClick={onClose} 
              disabled={isProcessing}
              className="text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Display */}
          <div className="p-8 text-center bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total Amount Due
            </span>
            <div className="text-4xl font-black text-slate-900 mt-1">
              ₹{safeAmount.toFixed(2)}
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase">
              Order ID: {orderId}
            </div>
          </div>

          {/* Info & Action */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700 leading-tight">
                Protected by 256-bit SSL encryption. Your payment info is handled securely by Razorpay.
              </p>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing || paymentSuccess || !safeAmount}
              className={`w-full h-14 text-base font-black transition-all shadow-lg rounded-xl ${
                paymentSuccess 
                ?"bg-slate-900 hover:bg-slate-800 text-yellow-400" 
                : "bg-slate-900 hover:bg-slate-800 text-yellow-400"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </span>
              ) : paymentSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Pay Now
                </span>
              )}
            </Button>
            
            {error && (
              <p className="text-center text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            <p className="text-center text-[10px] text-slate-400 uppercase tracking-wide">
              Powered by Razorpay
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}