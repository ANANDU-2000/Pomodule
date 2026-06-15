import { env } from '../../config/env';
import type { SystemDefaultsResponse } from '../../types/formConfig.types';

export function getSystemDefaults(): SystemDefaultsResponse {
  return {
    currency: env.ORACLE_DEFAULT_CURRENCY,
    searchLimit: env.ORACLE_SEARCH_LIMIT,
    itemSearchLimit: env.ORACLE_ITEM_SEARCH_LIMIT,
    minSearchChars: env.ORACLE_MIN_SEARCH_CHARS,
    debounceMs: env.ORACLE_LOOKUP_DEBOUNCE_MS,
  };
}
