import { useState, useEffect, useCallback } from 'react';
import { getJets } from '../services/jets';

/**
 * Custom hook to manage fetching jets with server-side filters, sorting, and pagination.
 */
export function useJets(filterParams) {
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFleet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getJets(filterParams);
      if (result.error) {
        setError(result.error);
      } else {
        setJets(result.data || []);
        setTotalCount(result.count || 0);
        setTotalPages(result.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch fleet:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [
    filterParams.search,
    filterParams.category,
    filterParams.minSeats,
    filterParams.maxPrice,
    filterParams.available,
    filterParams.sortBy,
    filterParams.sortOrder,
    filterParams.page,
    filterParams.pageSize,
  ]);

  useEffect(() => {
    fetchFleet();
  }, [fetchFleet]);

  return {
    jets,
    loading,
    error,
    totalCount,
    totalPages,
    refetch: fetchFleet,
  };
}
