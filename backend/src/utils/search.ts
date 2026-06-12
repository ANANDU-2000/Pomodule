import type { PurchaseOrderListItem } from '../types/purchaseOrder.types';

export function searchPurchaseOrders(data: PurchaseOrderListItem[], query: string): PurchaseOrderListItem[] {
  if (!query.trim()) return data;
  const q = query.toLowerCase().trim();
  return data.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(q)),
  );
}
