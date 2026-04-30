// src/services/adminApi.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

class AdminApiService {
  
  // Get auth token from localStorage
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Handle API errors
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'API request failed');
    }
    return response.json();
  }

  // Get complete dashboard data
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get KPI metrics
  async getKPIMetrics() {
    const response = await fetch(`${API_BASE_URL}/api/admin/kpi`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get support agents
  async getSupportAgents() {
    const response = await fetch(`${API_BASE_URL}/api/admin/support-agents`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get order status distribution
  async getOrderStatusDistribution() {
    const response = await fetch(`${API_BASE_URL}/api/admin/order-status`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get heatmap data
  async getHeatmapData() {
    const response = await fetch(`${API_BASE_URL}/api/admin/heatmap`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get delivery performance
  async getDeliveryPerformance() {
    const response = await fetch(`${API_BASE_URL}/api/admin/delivery-performance`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get revenue data
  async getRevenueData(days = 30) {
    const response = await fetch(`${API_BASE_URL}/api/admin/revenue?days=${days}`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Get total revenue (30 days)
  async getTotalRevenue() {
    const response = await fetch(`${API_BASE_URL}/api/admin/revenue/total`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }
}

export default new AdminApiService();