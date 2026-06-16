import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { POListParams, FilterPeriod, PurchaseOrder } from '../types/PurchaseOrder';
import { fetchPurchaseOrders } from '../services/purchaseOrderService';
import { DEFAULT_PAGE_SIZE } from '../constants/pageSizeOptions';
import { queryKeys } from '../constants/queryKeys';

const DEFAULT_PARAMS: POListParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: '',
  filter: 'all',
  sortBy: '',
  sortDirection: 'desc',
};

export function usePurchaseOrders() {
  const [params, setParams] = useState<POListParams>(DEFAULT_PARAMS);

  const query = useQuery({
    queryKey: queryKeys.purchaseOrders.list(params),
    queryFn: ({ signal }) => fetchPurchaseOrders(params, signal),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });

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
    void query.refetch();
  }, [query]);

  return {
    result: query.data ?? null,
    loading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Failed to load' : null,
    retry,
    params,
    setSearch,
    setFilter,
    setSort,
    setPage,
    setPageSize,
  };
}
