import type { Request, Response, NextFunction } from 'express';
import { poCreateBodySchema } from '../utils/validationRules';
import type { POCreatePayload } from '../types/purchaseOrder.types';

declare global {
  namespace Express {
    interface Request {
      validatedCreateBody?: POCreatePayload;
    }
  }
}

export function validateCreateBody(req: Request, res: Response, next: NextFunction): void {
  const result = poCreateBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: 'Invalid request body',
      details: result.error.flatten().fieldErrors,
    });
    return;
  }
  req.validatedCreateBody = result.data as POCreatePayload;
  next();
}
