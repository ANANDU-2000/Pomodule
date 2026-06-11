import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { getConnection } from '../config/db.config';
import * as purchaseOrderService from '../services/purchaseOrder.service';
import type { POListItem } from '../types/purchaseOrder.types';

export async function getList(req: Request, res: Response, next: NextFunction): Promise<void> {
  let conn;
  try {
    const params = req.validatedQuery;
    if (!params) {
      res.status(400).json({ error: 'Missing validated query parameters' });
      return;
    }

    if (env.DATA_SOURCE === 'oracle') {
      conn = await getConnection();
    }
    const result = await purchaseOrderService.getPOList(params, conn);
    res.json(result);
  } catch (err) {
    next(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

export async function getDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id || id.trim() === '') {
    res.status(400).json({ error: 'Invalid purchase order id' });
    return;
  }

  let conn;
  try {
    if (env.DATA_SOURCE === 'oracle') {
      conn = await getConnection();
    }
    const result = await purchaseOrderService.getPODetail(id, conn);
    if (!result) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

export async function updateDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id || id.trim() === '') {
    res.status(400).json({ error: 'Invalid purchase order id' });
    return;
  }

  const payload = req.body as Partial<POListItem>;
  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  let conn;
  try {
    if (env.DATA_SOURCE === 'oracle') {
      conn = await getConnection();
    }
    const result = await purchaseOrderService.updatePO(id, payload, conn);
    if (!result) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}
