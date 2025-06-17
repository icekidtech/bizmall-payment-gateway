import { useState } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useUserStore } from '../store/userStore';

// Use relative URLs since we have a proxy
const API_BASE_URL = '';

interface ApiOptions extends Omit<AxiosRequestConfig, 'url'> {}

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const token = useUserStore((state) => state.token);
  
  const callApi = async (endpoint: string, options: ApiOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      // Add auth token if available
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios({
        url,
        headers,
        ...options,
      });
      
      return response.data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('API call failed');
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, error, callApi };
};