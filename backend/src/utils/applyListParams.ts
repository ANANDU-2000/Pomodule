import type { POListQueryParams, PurchaseOrderListItem, POListResponse } from '../types/purchaseOrder.types';
import { filterByDatePeriod } from './dateFilter';
import { searchPurchaseOrders } from './search';
import { calcTotalPages } from './pagination';

export function applyListParams(
  orders: PurchaseOrderListItem[],
  params: POListQueryParams,
): POListResponse {
  let result = [...orders];

  result = filterByDatePeriod(result, params.filter);
  result = searchPurchaseOrders(result, params.search);

  if (params.sortBy) {
    const sortKey = params.sortBy as keyof PurchaseOrderListItem;
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return params.sortOrder === 'asc' ? cmp : -cmp;
    });
  }

  const total = result.length;
  const totalPages = calcTotalPages(total, params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const data = result.slice(start, start + params.pageSize);

  return { data, total, page: params.page, pageSize: params.pageSize, totalPages };
}
