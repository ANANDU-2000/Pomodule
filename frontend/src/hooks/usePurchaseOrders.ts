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

function paramsEqual(a: POListParams, b: Partial<POListParams>): boolean {
  return (Object.keys(b) as (keyof POListParams)[]).every((key) => a[key] === b[key]);
}

export function usePurchaseOrders() {
  const [params, setParams] = useState<POListParams>(DEFAULT_PARAMS);
  const [result, setResult] = useState<POListResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const data = await fetchPurchaseOrders(params, controller.signal);
        if (!controller.signal.aborted) {
          setResult(data);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        throw err;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [params]);

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

  const updateParams = useCallback((partial: Partial<POListParams>) => {
    setParams((p) => (paramsEqual(p, partial) ? p : { ...p, ...partial }));
  }, []);

  return {
    result,
    loading,
    params,
    setSearch,
    setFilter,
    setSort,
    setPage,
    setPageSize,
    updateParams,
  };
}
