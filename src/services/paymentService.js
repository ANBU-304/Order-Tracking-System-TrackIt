// src/services/paymentService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9094";
const PAYMENT_API = `${API_BASE_URL}/api/payments`;

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const apiClient = axios.create({
  baseURL: PAYMENT_API,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

const paymentService = {
  createPaymentOrder: async ({ orderId, amount }) => {
    try {
      console.log("📝 Creating payment order:", { orderId, amount });

      if (!orderId || typeof orderId !== "string") {
        throw new Error("Invalid order ID");
      }
      if (!amount || typeof amount !== "number" || amount <= 0) {
        throw new Error("Invalid amount");
      }

      const response = await apiClient.post("/create-order", {
        orderId: orderId.trim(),
        amount: Number(amount),
      });

      console.log("✅ Payment order created:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Create payment order error:", error.response?.data || error.message);
      throw error;
    }
  },

  verifyPayment: async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    try {
      console.log("🔍 Verifying payment:", { razorpayOrderId });

      const response = await apiClient.post("/verify", {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      console.log("✅ Payment verified:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Verify payment error:", error.response?.data || error.message);
      throw error;
    }
  },

  getRazorpayKey: async () => {
    try {
      const response = await apiClient.get("/razorpay-key");
      const keyId = response.data?.keyId || response.data;
      console.log("🔑 Razorpay key fetched");
      return keyId;
    } catch (error) {
      console.error("❌ Get Razorpay key error:", error);
      throw new Error("Failed to get payment gateway configuration");
    }
  },

  // ✅ FIXED: Returns clean payment data
  getPaymentByOrderId: async (orderId) => {
    try {
      console.log("📥 Fetching payment for order:", orderId);
      
      const token = getAuthToken();
      
      const response = await apiClient.get(`/order/${orderId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      console.log("✅ Payment fetched:", response.data);
      
      // ✅ Return the data directly - it's already in the correct format
      return response.data;
    } catch (error) {
      console.error("❌ Get payment error:", error);
      // Don't throw error, return null to allow fallback
      return null;
    }
  },

  getAllPayments: async () => {
    try {
      const response = await apiClient.get("/");
      return response.data;
    } catch (error) {
      console.error("Get all payments error:", error);
      throw error;
    }
  },
};

export default paymentService;