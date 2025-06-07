import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useUserStore } from '../store/userStore';

const API_BASE_URL = 'http://localhost:3000';

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
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios({
        url,
        ...options,
        headers
      });
      
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, error, callApi };
};