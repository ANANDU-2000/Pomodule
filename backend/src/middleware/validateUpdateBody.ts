import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { PurchaseOrderListItem } from '../types/purchaseOrder.types';

const updateBodySchema = z.object({
  documentDate: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
  location: z.string().optional(),
  orderValue: z.coerce.number().optional(),
  status: z.string().optional(),
  deliveryDate: z.string().optional(),
  remarks: z.string().optional(),
  userId: z.string().optional(),
}).strict();

declare global {
  namespace Express {
    interface Request {
      validatedBody?: Partial<PurchaseOrderListItem>;
    }
  }
}

export function validateUpdateBody(req: Request, res: Response, next: NextFunction): void {
  const result = updateBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: 'Invalid request body',
      details: result.error.flatten().fieldErrors,
    });
    return;
  }
  req.validatedBody = result.data;
  next();
}
