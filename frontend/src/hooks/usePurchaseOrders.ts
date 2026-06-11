import { useState, useEffect, useCallback } from 'react';
import type { POListParams, FilterPeriod, PurchaseOrder } from '../types/PurchaseOrder';
import { fetchPurchaseOrders, type POListResult } from '../services/purchaseOrderService';
import { DEFAULT_PAGE_SIZE } from '../constants/pageSizeOptions';

const DEFAULT_PARAMS: POListParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: '',
  filter: 'all',
  sortBy: '',
  sortDirection: 'asc',
};

export function usePurchaseOrders() {
  const [params, setParams] = useState<POListParams>(DEFAULT_PARAMS);
  const [result, setResult] = useState<POListResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPurchaseOrders(params, controller.signal);
        if (!controller.signal.aborted) {
          setResult(data);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [params, fetchKey]);

  const setSearch = useCallback((search: string) => {
    setParams((p) => {
      if (p.search === search && p.page === 1) return p;
      return { ...p, search, page: 1 };
    });
  }, []);

  const setFilter = useCallback((filter: FilterPeriod) => {
    setParams((p) => {
      if (p.filter === filter && p.page === 1) return p;
      return { ...p, filter, page: 1 };
    });
  }, []);

  const setSort = useCallback((sortBy: keyof PurchaseOrder | '', sortDirection: 'asc' | 'desc') => {
    setParams((p) => {
      if (p.sortBy === sortBy && p.sortDirection === sortDirection && p.page === 1) return p;
      return { ...p, sortBy, sortDirection, page: 1 };
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((p) => (p.page === page ? p : { ...p, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setParams((p) => {
      if (p.pageSize === pageSize && p.page === 1) return p;
      return { ...p, pageSize, page: 1 };
    });
  }, []);

  const retry = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  return {
    result,
    loading,
    error,
    retry,
    params,
    setSearch,
    setFilter,
    setSort,
    setPage,
    setPageSize,
  };
}
