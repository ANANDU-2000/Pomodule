import { useQuery } from '@tanstack/react-query';
import { fetchFormConfig, fetchSystemDefaults } from '../services/formConfigService';

export function usePOFormConfig() {
  const configQuery = useQuery({
    queryKey: ['po', 'form-config'],
    queryFn: ({ signal }) => fetchFormConfig(signal),
    staleTime: 5 * 60 * 1000,
  });

  const defaultsQuery = useQuery({
    queryKey: ['po', 'system-defaults'],
    queryFn: ({ signal }) => fetchSystemDefaults(signal),
    staleTime: 5 * 60 * 1000,
  });

  return {
    config: configQuery.data,
    defaults: defaultsQuery.data,
    isLoading: configQuery.isLoading || defaultsQuery.isLoading,
    error: configQuery.error ?? defaultsQuery.error,
  };
}
