import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchLookups } from '../services/lookupService';
import type { LookupType } from '../types/formConfig';
import { usePOFormConfig } from './usePOFormConfig';

export function useLookupSearch(
  type: LookupType,
  query: string,
  options?: { supplierCode?: string; enabled?: boolean },
) {
  const { defaults } = usePOFormConfig();
  const [debouncedQ, setDebouncedQ] = useState(query);
  const debounceMs = defaults?.debounceMs ?? 300;
  const minChars = defaults?.minSearchChars ?? 2;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const enabled = (options?.enabled ?? true) && debouncedQ.trim().length >= minChars;

  return useQuery({
    queryKey: ['lookup', type, debouncedQ, options?.supplierCode],
    queryFn: ({ signal }) =>
      searchLookups({ type, q: debouncedQ, supplierCode: options?.supplierCode }, signal),
    enabled,
    staleTime: 60 * 1000,
  });
}
