import { API_BASE } from '../config/api.config';
import type { FormConfigResponse, SystemDefaultsResponse } from '../types/formConfig';

export async function fetchFormConfig(signal?: AbortSignal): Promise<FormConfigResponse> {
  const res = await fetch(`${API_BASE}/api/po/form-config`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch form config: ${res.status}`);
  return res.json() as Promise<FormConfigResponse>;
}

export async function fetchSystemDefaults(signal?: AbortSignal): Promise<SystemDefaultsResponse> {
  const res = await fetch(`${API_BASE}/api/po/system-defaults`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch system defaults: ${res.status}`);
  return res.json() as Promise<SystemDefaultsResponse>;
}
