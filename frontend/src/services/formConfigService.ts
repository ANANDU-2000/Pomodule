import { API_BASE } from '../config/api.config';
import { USE_MOCK_FORM } from '../config/mock.config';
import type { FormConfigResponse, SystemDefaultsResponse } from '../types/formConfig';
import { delay } from '../mock/delay';
import { MOCK_FORM_CONFIG, MOCK_SYSTEM_DEFAULTS } from '../mock/formConfig.mock';

export async function fetchFormConfig(signal?: AbortSignal): Promise<FormConfigResponse> {
  if (USE_MOCK_FORM) {
    await delay(300);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return MOCK_FORM_CONFIG;
  }

  const res = await fetch(`${API_BASE}/api/po/form-config`, { signal });
  if (!res.ok) {
    if (import.meta.env.DEV) return MOCK_FORM_CONFIG;
    throw new Error(`Failed to fetch form config: ${res.status}`);
  }
  return res.json() as Promise<FormConfigResponse>;
}

export async function fetchSystemDefaults(signal?: AbortSignal): Promise<SystemDefaultsResponse> {
  if (USE_MOCK_FORM) {
    await delay(300);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return MOCK_SYSTEM_DEFAULTS;
  }

  const res = await fetch(`${API_BASE}/api/po/system-defaults`, { signal });
  if (!res.ok) {
    if (import.meta.env.DEV) return MOCK_SYSTEM_DEFAULTS;
    throw new Error(`Failed to fetch system defaults: ${res.status}`);
  }
  return res.json() as Promise<SystemDefaultsResponse>;
}
