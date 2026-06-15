import type { Request, Response, NextFunction } from 'express';
import * as purchaseOrderService from '../services/purchaseOrder.service';
import { withOracleConnection } from '../utils/withOracleConnection';
import { parseOrderId } from '../utils/parseOrderId';

function sendNotImplemented(res: Response, err: unknown): void {
  const e = err as Error & { blocker?: string };
  res.status(501).json({
    error: e.message,
    blocker: e.blocker,
  });
}

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

export async function getLineItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = parseOrderId(req);
  if (!id) {
    res.status(400).json({ error: 'Invalid purchase order id' });
    return;
  }

  try {
    const result = await withOracleConnection((conn) =>
      purchaseOrderService.getPOLineItems(id, conn),
    );
    if (!result.configured) {
      res.status(200).json(result);
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  const payload = req.validatedCreateBody;
  if (!payload) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  try {
    await withOracleConnection((conn) =>
      purchaseOrderService.createPO(payload, conn),
    );
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 501) {
      sendNotImplemented(res, err);
      return;
    }
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
    const existing = await withOracleConnection((conn) =>
      purchaseOrderService.getPODetail(id, conn),
    );
    if (!existing) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }

    await withOracleConnection((conn) =>
      purchaseOrderService.updatePO(id, payload, conn),
    );
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 501) {
      sendNotImplemented(res, err);
      return;
    }
    next(err);
  }
}

export async function approveDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = parseOrderId(req);
  if (!id) {
    res.status(400).json({ error: 'Invalid purchase order id' });
    return;
  }

  try {
    const existing = await withOracleConnection((conn) =>
      purchaseOrderService.getPODetail(id, conn),
    );
    if (!existing) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }

    if (!existing.permissions.canApprove) {
      res.status(409).json({ error: 'Purchase order is not in an approvable status' });
      return;
    }

    await withOracleConnection((conn) =>
      purchaseOrderService.approvePO(id, conn),
    );
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 501) {
      sendNotImplemented(res, err);
      return;
    }
    next(err);
  }
}
