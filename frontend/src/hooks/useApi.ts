import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(endpoint: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

export function useApiCall() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = async (endpoint: string, method: 'GET' | 'POST' = 'GET', payload?: any) => {
    try {
      setLoading(true);
      let response;
      
      if (method === 'GET') {
        response = await axios.get(`${API_BASE_URL}${endpoint}`);
      } else {
        response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      }
      
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
}