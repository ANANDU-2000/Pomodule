import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import {
  getOracleErrorKind,
  getHttpStatusForOracleError,
  getPublicOracleMessage,
  extractOracleErrorMeta,
} from '../utils/oracleErrors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const oracleMeta = extractOracleErrorMeta(err);
  if (oracleMeta.errorNum !== undefined) {
    const kind = getOracleErrorKind(err);
    logger.error('Oracle error', { ...oracleMeta, kind });
    const status = getHttpStatusForOracleError(kind);
    const message = env.NODE_ENV === 'production'
      ? getPublicOracleMessage(kind)
      : (err instanceof Error ? err.message : getPublicOracleMessage(kind));
    res.status(status).json({ error: message });
    return;
  }

  logger.error('Unhandled error', {
    message: err instanceof Error ? err.message : String(err),
  });

  const message = env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err instanceof Error ? err.message : 'Internal server error');

  res.status(500).json({ error: message });
}
