import { API_BASE } from '../config/api.config';
import { USE_MOCK_FORM } from '../config/mock.config';
import { delay } from '../mock/delay';
import { mockValidateItem, type ItemValidateParams, type ItemValidateResult } from '../mock/itemValidate.mock';

export type { ItemValidateParams, ItemValidateResult };

export class ItemNotFoundError extends Error {
  constructor(itemCode: string) {
    super(`Item not found: ${itemCode}`);
    this.name = 'ItemNotFoundError';
  }
}

export async function validateItem(
  params: ItemValidateParams,
  signal?: AbortSignal,
): Promise<ItemValidateResult> {
  if (USE_MOCK_FORM) {
    await delay(200);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const result = mockValidateItem(params);
    if (!result) throw new ItemNotFoundError(params.itemCode);
    return result;
  }

  const query = new URLSearchParams();
  if (params.langCode) query.set('langCode', params.langCode);
  if (params.txnCode) query.set('txnCode', params.txnCode);
  if (params.compCode) query.set('compCode', params.compCode);
  if (params.locnCode) query.set('locnCode', params.locnCode);

  const res = await fetch(
    `${API_BASE}/api/items/${encodeURIComponent(params.itemCode)}/validate?${query}`,
    { signal },
  );

  if (res.status === 404) throw new ItemNotFoundError(params.itemCode);
  if (res.status === 501 || res.status === 503) {
    const fallback = mockValidateItem(params);
    if (!fallback) throw new ItemNotFoundError(params.itemCode);
    return fallback;
  }
  if (!res.ok) throw new Error(`Item validation failed: ${res.status}`);
  return res.json() as Promise<ItemValidateResult>;
}
