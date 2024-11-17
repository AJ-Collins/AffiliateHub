import axios from 'axios';
import { Product, LoginCredentials, AuthResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found, please log in again.');
  }
  return config;
});

// Handle token expiration (optional)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page or show a message
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productsApi = {
  getAll: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (typeof data.price === 'string') {
      data.price = parseFloat(data.price);
    }
    const response = await api.post<Product>('/products', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Product>) => {
    console.log("Updating product with ID:", id);
    console.log("Data:", data);
    if (typeof data.price === 'string') {
      data.price = parseFloat(data.price);
    }
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};
