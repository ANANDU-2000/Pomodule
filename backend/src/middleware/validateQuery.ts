import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { POListQueryParams } from '../types/purchaseOrder.types';
import { FILTER_PERIODS } from '../types/filter.types';
import { env } from '../config/env';

const SORTABLE_FIELDS = [
  'orderNo',
  'documentDate',
  'supplierCode',
  'supplierName',
  'location',
  'orderValue',
  'status',
  'deliveryDate',
  'remarks',
  'userId',
] as const;

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(25),
  search: z.string().max(200).default(''),
  filter: z.enum(FILTER_PERIODS).default('all'),
  sortBy: z.string().max(50).default('').refine(
    (val) => val === '' || SORTABLE_FIELDS.includes(val as typeof SORTABLE_FIELDS[number]),
    { message: 'Invalid sort field' },
  ),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  txnCode: z.string().max(20).regex(/^[A-Za-z0-9_]*$/).optional(),
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

  const { txnCode, ...rest } = result.data;
  req.validatedQuery = {
    ...rest,
    txnCode: txnCode || env.ORACLE_TXN_CODE,
  };
  next();
}
