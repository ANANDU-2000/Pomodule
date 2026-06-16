import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import { fetchPODetail, PONotFoundError } from '../services/purchaseOrderService';
import { queryKeys } from '../constants/queryKeys';

interface UsePODetailMessages {
  notFound: string;
  loadError: string;
}

export function usePODetail(orderNo: string | undefined, messages: UsePODetailMessages) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.purchaseOrders.detail(orderNo ?? ''),
    queryFn: ({ signal }) => {
      if (!orderNo) throw new Error('Missing order number');
      return fetchPODetail(orderNo, signal);
    },
    enabled: Boolean(orderNo),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: (failureCount, error) => {
      if (error instanceof PONotFoundError) return false;
      return failureCount < 1;
    },
  });

  const setOrder = (order: PurchaseOrder | null) => {
    if (!orderNo) return;
    if (order) {
      queryClient.setQueryData(queryKeys.purchaseOrders.detail(orderNo), order);
    } else {
      queryClient.removeQueries({ queryKey: queryKeys.purchaseOrders.detail(orderNo) });
    }
  };

  let error: string | null = null;
  if (query.error instanceof PONotFoundError) {
    error = messages.notFound;
  } else if (query.error instanceof Error && query.error.name !== 'AbortError') {
    error = messages.loadError;
  }

  return {
    order: query.data ?? null,
    setOrder,
    loading: query.isFetching,
    error,
    setError: () => undefined,
  };
}

export function useInvalidatePurchaseOrders() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all });
  };
}
