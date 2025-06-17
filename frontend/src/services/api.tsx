import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token for API calls
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const api = {
  // Payment endpoints
  payments: {
    createOrder: async (orderData: any) => {
      return apiClient.post('/payments/create-order', orderData);
    },
    getOrder: async (orderId: string) => {
      return apiClient.get(`/payments/orders/${orderId}`);
    },
    confirmPayment: async (orderId: string, txHash: string) => {
      return apiClient.post(`/payments/confirm`, { orderId, txHash });
    }
  },
  
  // Merchant endpoints
  merchant: {
    getDashboard: async () => {
      return apiClient.get('/merchant/dashboard');
    },
    getTransactions: async (params: any) => {
      return apiClient.get('/merchant/transactions', { params });
    }
  },
  
  // Auth endpoints
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      return apiClient.post('/auth/login', credentials);
    },
    signup: async (userData: any) => {
      return apiClient.post('/auth/signup', userData);
    }
  }
};