import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

interface OracleError extends Error {
  errorNum?: number;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  const oracleErr = err as OracleError;
  if (oracleErr.errorNum === 1403) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  const message = env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err instanceof Error ? err.message : 'Internal server error');

  res.status(500).json({ error: message });
}
