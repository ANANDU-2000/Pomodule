import { useEffect, useState } from 'react';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import { fetchPODetail, PONotFoundError } from '../services/purchaseOrderService';

interface UsePODetailMessages {
  notFound: string;
  loadError: string;
}

export function usePODetail(orderNo: string | undefined, messages: UsePODetailMessages) {
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(orderNo));
  const [error, setError] = useState<string | null>(null);
  const [trackedOrderNo, setTrackedOrderNo] = useState(orderNo);

  if (orderNo !== trackedOrderNo) {
    setTrackedOrderNo(orderNo);
    setOrder(null);
    setLoading(Boolean(orderNo));
    setError(null);
  }

  useEffect(() => {
    if (!orderNo) return;
    const controller = new AbortController();

    fetchPODetail(orderNo, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setOrder(data);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof PONotFoundError) {
          setError(messages.notFound);
        } else if (err instanceof Error && err.name !== 'AbortError') {
          setError(messages.loadError);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [orderNo, messages.notFound, messages.loadError]);

  return { order, setOrder, loading, error, setError };
}
