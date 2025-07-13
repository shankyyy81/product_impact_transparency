import axios from 'axios';
import { Product, ProductAlternatives } from '../types/Product';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product alternatives
  getProductAlternatives: async (id: string): Promise<ProductAlternatives> => {
    const response = await api.get(`/products/${id}/alternatives`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 