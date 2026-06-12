import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.info('HTTP request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs,
    });
  });

  next();
}
