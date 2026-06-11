import type { POListItem } from '../types/purchaseOrder.types';

export function searchPurchaseOrders(data: POListItem[], query: string): POListItem[] {
  if (!query.trim()) return data;
  const q = query.toLowerCase().trim();
  return data.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(q)),
  );
}
