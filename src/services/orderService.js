import axios from "axios";

const BASE_URL = 'http://localhost:9092/api/orders';

// ✅ Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

const orderService = {
  // ✅ Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  },

  // ✅ Get orders by user email
  getOrdersByEmail: async (email) => {
    try {
      const response = await api.get(`/user/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by email:", error);
      throw error;
    }
  },

  // ✅ Update order
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await api.put(`/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // ✅ Delete order
  deleteOrder: async (orderId) => {
    try {
      await api.delete(`/${orderId}`);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // ✅ Search orders by multiple criteria
  searchOrders: async (query) => {
    // Try to fetch by order ID first
    try {
      const order = await orderService.getOrderById(query);
      return [order];
    } catch (error) {
      console.log("Not found by ID, trying email...");
    }

    // Try to fetch by email
    if (query.includes("@")) {
      try {
        const orders = await orderService.getOrdersByEmail(query);
        return Array.isArray(orders) ? orders : [orders];
      } catch (error) {
        console.log("Not found by email");
      }
    }

    // If nothing found
    throw new Error("No orders found matching your search");
  },
};

export default orderService;