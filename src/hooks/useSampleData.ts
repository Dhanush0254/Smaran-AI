import { useState, useEffect, useCallback } from 'react';
import { fetchSampleData, getAccessToken } from '../services/supabaseService';
import type { SampleDataRecord } from '../services/supabaseService';

interface SampleDataState {
  data: SampleDataRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch sample data from the protected Edge Function.
 * Automatically fetches when the user is authenticated.
 */
export function useSampleData(isAuthenticated: boolean): SampleDataState {
  const [data, setData] = useState<SampleDataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();

      if (!token) {
        setError('Unauthorized: No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetchSampleData(token);

      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
