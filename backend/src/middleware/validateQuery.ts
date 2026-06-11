import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { POListQueryParams } from '../types/purchaseOrder.types';

const filterEnum = z.enum([
  'today',
  'yesterday',
  'last_week',
  'this_week',
  'this_month',
  'last_month',
  'all',
  'none',
]);

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(25),
  search: z.string().max(200).default(''),
  filter: filterEnum.default('all'),
  sortBy: z.string().max(50).default(''),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: POListQueryParams;
    }
  }
}

export function validateQuery(req: Request, res: Response, next: NextFunction): void {
  const result = querySchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({
      error: 'Invalid query parameters',
      details: result.error.flatten().fieldErrors,
    });
    return;
  }
  req.validatedQuery = result.data;
  next();
}
