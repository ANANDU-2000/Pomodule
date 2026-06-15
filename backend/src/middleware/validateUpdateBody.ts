import type { Request, Response, NextFunction } from 'express';
import { poUpdateBodySchema } from '../utils/validationRules';
import type { POUpdatePayload } from '../types/purchaseOrder.types';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: POUpdatePayload;
    }
  }
}

export function validateUpdateBody(req: Request, res: Response, next: NextFunction): void {
  const result = poUpdateBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: 'Invalid request body',
      details: result.error.flatten().fieldErrors,
    });
    return;
  }
  req.validatedBody = result.data as POUpdatePayload;
  next();
}
