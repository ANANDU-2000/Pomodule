import type { Request, Response, NextFunction } from 'express';
import * as purchaseOrderService from '../services/purchaseOrder.service';
import { withOracleConnection } from '../utils/withOracleConnection';
import { parseOrderId } from '../utils/parseOrderId';

export async function getList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = req.validatedQuery!;
    const result = await withOracleConnection((conn) =>
      purchaseOrderService.getPOList(params, conn),
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = parseOrderId(req);
  if (!id) {
    res.status(400).json({ error: 'Invalid purchase order id' });
    return;
  }

  try {
    const result = await withOracleConnection((conn) =>
      purchaseOrderService.getPODetail(id, conn),
    );
    if (!result) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = parseOrderId(req);
  if (!id) {
    res.status(400).json({ error: 'Invalid purchase order id' });
    return;
  }

  const payload = req.validatedBody;
  if (!payload) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  try {
    const result = await withOracleConnection((conn) =>
      purchaseOrderService.updatePO(id, payload, conn),
    );
    if (!result) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}
