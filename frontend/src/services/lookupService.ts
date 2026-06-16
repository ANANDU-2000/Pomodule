import { API_BASE } from '../config/api.config';
import { USE_MOCK_LOOKUPS } from '../config/mock.config';
import type { LookupResponse, LookupType } from '../types/formConfig';
import { delay } from '../mock/delay';
import { MOCK_ITEMS } from '../mock/items.mock';
import { MOCK_LOCATIONS } from '../mock/locations.mock';
import { MOCK_PAYMENT_TERMS } from '../mock/paymentTerms.mock';
import { MOCK_SUPPLIERS, toSupplierLookupItem } from '../mock/suppliers.mock';

export interface LookupSearchParams {
  type: LookupType;
  q: string;
  supplierCode?: string;
}

function filterByQuery(items: { code: string; name: string }[], q: string, minChars: number) {
  if (q.trim().length < minChars) {
    return [];
  }
  const needle = q.trim().toLowerCase();
  const tokens = needle.split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    const hay = `${item.code} ${item.name}`.toLowerCase();
    if (hay.includes(needle)) return true;
    return tokens.every((token) => hay.includes(token));
  });
}

function filterSuppliers(q: string, minChars: number) {
  if (q.trim().length < minChars) return [];
  const needle = q.trim().toLowerCase();
  return MOCK_SUPPLIERS.filter(
    (s) =>
      s.suppCode.toLowerCase().includes(needle) ||
      s.suppName.toLowerCase().includes(needle) ||
      s.address.toLowerCase().includes(needle) ||
      s.shipMode.toLowerCase().includes(needle),
  );
}

async function mockSearchLookups(params: LookupSearchParams): Promise<LookupResponse> {
  await delay(250);
  const minChars = 2;
  const limit = params.type === 'item' ? 30 : 20;

  switch (params.type) {
    case 'supplier': {
      const hits = filterSuppliers(params.q, minChars).slice(0, limit);
      const data = hits.map((supplier) => toSupplierLookupItem(supplier));
      return { configured: true, data };
    }
    case 'item': {
      // When real DB: calls ORACLE_ITEM_VIEW with search param
      const data = filterByQuery(MOCK_ITEMS, params.q, minChars).slice(0, limit);
      return { configured: true, data };
    }
    case 'location': {
      const data = filterByQuery(MOCK_LOCATIONS, params.q, minChars).slice(0, limit);
      return { configured: true, data };
    }
    case 'paymentTerm': {
      const pool = params.supplierCode
        ? MOCK_PAYMENT_TERMS.filter((t) => !t.supplierCode || t.supplierCode === params.supplierCode)
        : MOCK_PAYMENT_TERMS.filter((t) => !t.supplierCode);
      const data = filterByQuery(pool, params.q, minChars).slice(0, limit);
      return { configured: true, data };
    }
    default:
      return { configured: false, data: null, message: 'Unknown lookup type' };
  }
}

export async function searchLookups(
  params: LookupSearchParams,
  signal?: AbortSignal,
): Promise<LookupResponse> {
  if (USE_MOCK_LOOKUPS) {
    const result = await mockSearchLookups(params);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return result;
  }

  const query = new URLSearchParams({
    type: params.type,
    q: params.q,
  });
  if (params.supplierCode) query.set('supplierCode', params.supplierCode);

  const res = await fetch(`${API_BASE}/api/lookups?${query}`, { signal });
  if (res.status === 503) {
    const body = (await res.json()) as LookupResponse;
    if (!body.configured) {
      return mockSearchLookups(params);
    }
    return body;
  }
  if (!res.ok) throw new Error(`Lookup search failed: ${res.status}`);
  return res.json() as Promise<LookupResponse>;
}
