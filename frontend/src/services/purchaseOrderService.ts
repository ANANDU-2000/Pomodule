import type { PurchaseOrder, POListParams } from '../types/PurchaseOrder';
import rawData from '../data/purchaseOrders.mock.json';
import { filterByDatePeriod } from '../utils/dateFilter';
import { searchPurchaseOrders } from '../utils/search';
import { API_BASE, USE_MOCK } from '../config/api.config';

const allOrders: PurchaseOrder[] = rawData as PurchaseOrder[];

export function resetOrderCache(): void {
  allOrders.splice(0, allOrders.length, ...(rawData as PurchaseOrder[]));
}

export interface POListResult {
  data: PurchaseOrder[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PODetailResponse = PurchaseOrder;

export class PONotFoundError extends Error {
  constructor(id: string) {
    super(`Purchase order not found: ${id}`);
    this.name = 'PONotFoundError';
  }
}

export function toApiParams(params: POListParams): Record<string, string> {
  return {
    page: String(params.page),
    pageSize: String(params.pageSize),
    search: params.search,
    filter: params.filter,
    sortBy: params.sortBy,
    sortOrder: params.sortDirection,
  };
}

function mockDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer);
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
        return;
      }
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      }, { once: true });
    }
  });
}

async function fetchMockPurchaseOrders(
  params: POListParams,
  signal?: AbortSignal,
): Promise<POListResult> {
  await mockDelay(100, signal);

  let result = [...allOrders];

  result = filterByDatePeriod(result, params.filter);
  result = searchPurchaseOrders(result, params.search);

  if (params.sortBy) {
    result.sort((a, b) => {
      const aVal = a[params.sortBy as keyof PurchaseOrder];
      const bVal = b[params.sortBy as keyof PurchaseOrder];
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return params.sortDirection === 'asc' ? cmp : -cmp;
    });
  }

  const total = result.length;
  const totalPages = Math.ceil(total / params.pageSize) || 0;
  const start = (params.page - 1) * params.pageSize;
  const data = result.slice(start, start + params.pageSize);

  return { data, total, page: params.page, pageSize: params.pageSize, totalPages };
}

export async function fetchPurchaseOrders(
  params: POListParams,
  signal?: AbortSignal,
): Promise<POListResult> {
  if (!USE_MOCK) {
    const res = await fetch(
      `${API_BASE}/api/purchase-orders?${new URLSearchParams(toApiParams(params))}`,
      { signal },
    );
    if (!res.ok) throw new Error(`Failed to fetch purchase orders: ${res.status}`);
    return res.json() as Promise<POListResult>;
  }

  return fetchMockPurchaseOrders(params, signal);
}

export async function fetchPODetail(
  id: string,
  signal?: AbortSignal,
): Promise<PODetailResponse> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}`, { signal });
    if (res.status === 404) throw new PONotFoundError(id);
    if (!res.ok) throw new Error(`Failed to fetch purchase order: ${res.status}`);
    return res.json() as Promise<PODetailResponse>;
  }

  await mockDelay(50, signal);
  const item = allOrders.find((o) => o.orderNo === id);
  if (!item) throw new PONotFoundError(id);
  return { ...item };
}

export async function updatePO(
  id: string,
  payload: Partial<PurchaseOrder>,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
    if (res.status === 404) throw new PONotFoundError(id);
    if (!res.ok) throw new Error(`Failed to update purchase order: ${res.status}`);
    return res.json() as Promise<PurchaseOrder>;
  }

  await mockDelay(50, signal);
  const index = allOrders.findIndex((o) => o.orderNo === id);
  if (index < 0) throw new PONotFoundError(id);
  allOrders[index] = { ...allOrders[index], ...payload, orderNo: id };
  return { ...allOrders[index] };
}

export async function createPO(
  payload: Omit<PurchaseOrder, 'orderNo'>,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok) throw new Error(`Failed to create purchase order: ${res.status}`);
    return res.json() as Promise<PurchaseOrder>;
  }

  await mockDelay(80, signal);
  const now = new Date();
  const prefix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const sequence = String(allOrders.length + 1).padStart(4, '0');
  const orderNo = `${prefix}${sequence}`;
  const newOrder: PurchaseOrder = { ...payload, orderNo };
  allOrders.unshift(newOrder);
  return { ...newOrder };
}
