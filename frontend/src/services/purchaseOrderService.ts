import type { PurchaseOrder, POFormPayload } from '../types/PurchaseOrder';
import type {
  POActionPermissions,
  POAuditFields,
  POLineItemsResponse,
} from '../types/formConfig';
import { API_BASE } from '../config/api.config';
import { MOCK_MODE, USE_MOCK_FORM } from '../config/mock.config';
import { delay } from '../mock/delay';
import {
  mockApprovePO,
  mockCreatePO,
  mockFetchPODetail,
  mockFetchPOLineItems,
  mockFetchPurchaseOrders,
  mockUpdatePO,
  hasMockPurchaseOrder,
} from '../mock/mockStore';

export interface POListResult {
  data: PurchaseOrder[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PODetailResponse extends PurchaseOrder {
  audit?: POAuditFields;
  permissions?: POActionPermissions;
  address?: string;
  shipmentMode?: string;
  paymentTerm?: string;
  docLocation?: string;
  exchangeRate?: number;
  discount?: number;
  inclusiveVat?: boolean;
  docType?: string;
  taxInvoiceDoc?: string;
}

export class PONotFoundError extends Error {
  constructor(id: string) {
    super(`Purchase order not found: ${id}`);
    this.name = 'PONotFoundError';
  }
}

export class POActionError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'POActionError';
    this.statusCode = statusCode;
  }
}

export class PONotImplementedError extends Error {
  blocker?: string;

  constructor(message: string, blocker?: string) {
    super(message);
    this.name = 'PONotImplementedError';
    this.blocker = blocker;
  }
}

export function toApiParams(params: import('../types/PurchaseOrder').POListParams): Record<string, string> {
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
  params: import('../types/PurchaseOrder').POListParams,
  signal?: AbortSignal,
): Promise<POListResult> {
  if (MOCK_MODE) {
    await delay(300);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return mockFetchPurchaseOrders(params);
  }

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
  if (MOCK_MODE) {
    await delay(300);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const detail = mockFetchPODetail(id);
    if (!detail) throw new PONotFoundError(id);
    return detail;
  }

  if (USE_MOCK_FORM && hasMockPurchaseOrder(id)) {
    await delay(150);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const detail = mockFetchPODetail(id);
    if (detail) return detail;
  }

  const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}`, { signal });
  if (res.status === 404) throw new PONotFoundError(id);
  if (!res.ok) throw new Error(`Failed to fetch purchase order: ${res.status}`);
  return res.json() as Promise<PODetailResponse>;
}

export async function fetchPOLineItems(
  id: string,
  signal?: AbortSignal,
): Promise<POLineItemsResponse> {
  if (USE_MOCK_FORM && (MOCK_MODE || hasMockPurchaseOrder(id))) {
    await delay(300);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return mockFetchPOLineItems(id);
  }

  const res = await fetch(
    `${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}/items`,
    { signal },
  );
  if (!res.ok) throw new Error(`Failed to fetch line items: ${res.status}`);
  const body = (await res.json()) as POLineItemsResponse;
  if (!body.configured) {
    return mockFetchPOLineItems(id);
  }
  return body;
}

export async function updatePO(
  id: string,
  payload: POFormPayload,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  if (USE_MOCK_FORM && (MOCK_MODE || hasMockPurchaseOrder(id))) {
    await delay(800);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const updated = mockUpdatePO(id, payload);
    if (!updated) throw new PONotFoundError(id);
    return updated;
  }

  const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  if (res.status === 404) throw new PONotFoundError(id);
  if (res.status === 501) {
    const body = await res.json().catch(() => ({})) as { error?: string; blocker?: string };
    throw new PONotImplementedError(body.error ?? 'Update not available', body.blocker);
  }
  if (!res.ok) throw new Error(`Failed to update purchase order: ${res.status}`);
  return res.json() as Promise<PurchaseOrder>;
}

export async function approvePO(
  id: string,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  if (USE_MOCK_FORM && (MOCK_MODE || hasMockPurchaseOrder(id))) {
    await delay(500);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const approved = mockApprovePO(id);
    if (!approved) throw new PONotFoundError(id);
    return approved;
  }

  const res = await fetch(`${API_BASE}/api/purchase-orders/${encodeURIComponent(id)}/approve`, {
    method: 'POST',
    signal,
  });
  if (res.status === 404) throw new PONotFoundError(id);
  if (res.status === 409) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new POActionError(body.error ?? 'Purchase order cannot be approved', 409);
  }
  if (res.status === 501) {
    const body = await res.json().catch(() => ({})) as { error?: string; blocker?: string };
    throw new PONotImplementedError(body.error ?? 'Approve not available', body.blocker);
  }
  if (!res.ok) throw new Error(`Failed to approve purchase order: ${res.status}`);
  return res.json() as Promise<PurchaseOrder>;
}

export async function createPO(
  payload: POFormPayload,
  signal?: AbortSignal,
): Promise<PurchaseOrder> {
  if (USE_MOCK_FORM) {
    await delay(800);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return mockCreatePO(payload);
  }

  const res = await fetch(`${API_BASE}/api/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  if (res.status === 501) {
    const body = await res.json().catch(() => ({})) as { error?: string; blocker?: string };
    throw new PONotImplementedError(body.error ?? 'Create not available', body.blocker);
  }
  if (!res.ok) throw new Error(`Failed to create purchase order: ${res.status}`);
  return res.json() as Promise<PurchaseOrder>;
}
