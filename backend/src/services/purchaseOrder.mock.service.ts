import rawData from '../data/purchaseOrders.mock.json';
import type {
  POListQueryParams,
  POListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import { filterByDatePeriod } from '../utils/dateFilter';
import { searchPurchaseOrders } from '../utils/search';
import { calcTotalPages } from '../utils/pagination';

let orders: POListItem[] = [...(rawData as POListItem[])];

export function getPOList(params: POListQueryParams): POListResponse {
  let result = [...orders];

  result = filterByDatePeriod(result, params.filter);
  result = searchPurchaseOrders(result, params.search);

  if (params.sortBy) {
    const sortKey = params.sortBy as keyof POListItem;
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

export function getPODetail(id: string): PODetailResponse | null {
  const item = orders.find((o) => o.orderNo === id);
  return item ?? null;
}

export function updatePO(id: string, payload: Partial<POListItem>): POListItem | null {
  const index = orders.findIndex((o) => o.orderNo === id);
  if (index < 0) return null;
  orders[index] = { ...orders[index], ...payload, orderNo: id };
  return orders[index];
}

const APPROVABLE_STATUSES = new Set(['Pending', 'Draft']);

export function approvePO(id: string): POListItem | null {
  const index = orders.findIndex((o) => o.orderNo === id);
  if (index < 0) return null;
  const current = orders[index];
  if (!APPROVABLE_STATUSES.has(current.status)) {
    return null;
  }
  orders[index] = { ...current, status: 'Approved' };
  return orders[index];
}

export function isApprovableStatus(status: string): boolean {
  return APPROVABLE_STATUSES.has(status);
}
