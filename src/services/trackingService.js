import axios from "axios";

// ✅ Update this port to match your tracking service
const API_BASE_URL = "http://localhost:8083/api/tracking-events"; // or whatever port you use

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const trackingService = {
  // ✅ Get tracking events by Order ID (with pagination)
  getEventsByOrderId: async (orderId, page = 0, size = 20) => {
    try {
      const response = await api.get(`/${orderId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tracking events by orderId:", error);
      throw error;
    }
  },

  // ✅ Get tracking events by Email (with pagination)
  getEventsByEmail: async (email, page = 0, size = 20) => {
    try {
      const response = await api.get("/email", {
        params: { email, page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tracking events by email:", error);
      throw error;
    }
  },

  // ✅ Delete tracking event
  deleteEvent: async (id) => {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error("Error deleting tracking event:", error);
      throw error;
    }
  },
};

export default trackingService;