import type { Connection } from 'oracledb';
import { env } from '../config/env';
import { getLookupTypeConfig, isValidLookupType } from '../modules/lookup/lookup.config';
import type { LookupResponse, LookupSearchParams } from '../types/lookup.types';
import { searchLookup } from '../repositories/lookup.repository';

export function buildLookupNotConfiguredResponse(type: string): LookupResponse {
  const config = isValidLookupType(type) ? getLookupTypeConfig(type) : null;
  const envKey = config?.envKey ?? `ORACLE_${type.toUpperCase()}_VIEW`;
  return {
    configured: false,
    envKey,
    message: `Oracle lookup view not configured. Set ${envKey} in environment.`,
    data: null,
  };
}

export async function getLookupResults(
  params: LookupSearchParams,
  conn: Connection,
): Promise<LookupResponse> {
  const config = getLookupTypeConfig(params.type);
  if (!config) {
    return buildLookupNotConfiguredResponse(params.type);
  }

  if (params.q.trim().length < env.ORACLE_MIN_SEARCH_CHARS) {
    return { configured: true, data: [] };
  }

  const data = await searchLookup(params, conn);
  return { configured: true, data };
}
