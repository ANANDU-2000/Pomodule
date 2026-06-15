import { API_BASE } from '../config/api.config';
import type { LookupResponse, LookupType } from '../types/formConfig';

export interface LookupSearchParams {
  type: LookupType;
  q: string;
  supplierCode?: string;
}

export async function searchLookups(
  params: LookupSearchParams,
  signal?: AbortSignal,
): Promise<LookupResponse> {
  const query = new URLSearchParams({
    type: params.type,
    q: params.q,
  });
  if (params.supplierCode) query.set('supplierCode', params.supplierCode);

  const res = await fetch(`${API_BASE}/api/lookups?${query}`, { signal });
  if (res.status === 503) {
    return res.json() as Promise<LookupResponse>;
  }
  if (!res.ok) throw new Error(`Lookup search failed: ${res.status}`);
  return res.json() as Promise<LookupResponse>;
}
