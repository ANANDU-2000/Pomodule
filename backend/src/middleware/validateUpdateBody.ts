import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { POListItem } from '../types/purchaseOrder.types';

const updateBodySchema = z.object({
  orderNo: z.string().optional(),
  documentDate: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
  location: z.string().optional(),
  orderValue: z.number().optional(),
  status: z.string().optional(),
  deliveryDate: z.string().optional(),
  remarks: z.string().optional(),
  userId: z.string().optional(),
}).strict();

declare global {
  namespace Express {
    interface Request {
      validatedBody?: Partial<POListItem>;
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
