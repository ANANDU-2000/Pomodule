import type { PurchaseOrder, POListParams } from '../types/PurchaseOrder';
import { API_BASE } from '../config/api.config';

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

export class POActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'POActionError';
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

export async function fetchPurchaseOrders(
  params: POListParams,
  signal?: AbortSignal,
): Promise<POListResult> {
  const res = await fetch(
    `${API_BASE}/api/purchase-orders?${new URLSearchParams(toApiParams(params))}`,
    { signal },
  );
  if (!res.ok) throw new Error(`Failed to fetch purchase orders: ${res.status}`);
  return res.json() as Promise<POListResult>;
}

export async function fetchPODetail(
  id: string,
  signal?: AbortSignal,
): Promise<PODetailResponse> {
  const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}`, { signal });
  if (res.status === 404) throw new PONotFoundError(id);
  if (!res.ok) throw new Error(`Failed to fetch purchase order: ${res.status}`);
  return res.json() as Promise<PODetailResponse>;
}

export async function updatePO(
  id: string,
  payload: Partial<PurchaseOrder>,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
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

export async function approvePO(
  id: string,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}/approve`, {
    method: 'POST',
    signal,
  });
  if (res.status === 404) throw new PONotFoundError(id);
  if (res.status === 409) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new POActionError(body.error ?? 'Purchase order cannot be approved');
  }
  if (!res.ok) throw new Error(`Failed to approve purchase order: ${res.status}`);
  return res.json() as Promise<PurchaseOrder>;
}

export async function createPO(
  payload: Omit<PurchaseOrder, 'orderNo'>,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  const res = await fetch(`${API_BASE}/api/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) throw new Error(`Failed to create purchase order: ${res.status}`);
  return res.json() as Promise<PurchaseOrder>;
}
