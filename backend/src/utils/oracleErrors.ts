export interface OracleError extends Error {
  errorNum?: number;
}

const AUTH_ERRORS = new Set([1017]);
const UNAVAILABLE_ERRORS = new Set([12541, 12543, 12514]);
const TIMEOUT_ERRORS = new Set([12170, 6005]);

export type OracleErrorKind = 'auth' | 'unavailable' | 'timeout' | 'not_found' | 'unknown';

export function getOracleErrorKind(err: unknown): OracleErrorKind {
  const oracleErr = err as OracleError;
  const code = oracleErr.errorNum;
  if (code === undefined) return 'unknown';
  if (AUTH_ERRORS.has(code)) return 'auth';
  if (UNAVAILABLE_ERRORS.has(code)) return 'unavailable';
  if (TIMEOUT_ERRORS.has(code)) return 'timeout';
  if (code === 1403) return 'not_found';
  return 'unknown';
}

export function getHttpStatusForOracleError(kind: OracleErrorKind): number {
  switch (kind) {
    case 'auth':
    case 'unavailable':
      return 503;
    case 'timeout':
      return 504;
    case 'not_found':
      return 404;
    default:
      return 500;
  }
}

export function getPublicOracleMessage(kind: OracleErrorKind): string {
  switch (kind) {
    case 'auth':
      return 'Database authentication failed';
    case 'unavailable':
      return 'Database unavailable';
    case 'timeout':
      return 'Database connection timed out';
    case 'not_found':
      return 'Purchase order not found';
    default:
      return 'Internal server error';
  }
}

export function extractOracleErrorMeta(err: unknown): Record<string, unknown> {
  const oracleErr = err as OracleError;
  return {
    errorNum: oracleErr.errorNum,
    message: err instanceof Error ? err.message : String(err),
  };
}
