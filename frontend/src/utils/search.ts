import type { PurchaseOrder } from '../types/PurchaseOrder';

export function searchPurchaseOrders(
  data: PurchaseOrder[],
  query: string,
): PurchaseOrder[] {
  if (!query.trim()) return data;
  const q = query.toLowerCase().trim();
  return data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(q),
    ),
  );
}
