import type { Request, Response, NextFunction } from 'express';
import * as itemValidateService from '../services/itemValidate.service';
import { withOracleConnection } from '../utils/withOracleConnection';

function sendNotImplemented(res: Response, err: unknown): void {
  const e = err as Error & { blocker?: string };
  res.status(501).json({
    error: e.message,
    blocker: e.blocker,
  });
}

export async function validate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const itemCode = String(req.params.itemCode ?? '').trim();
  if (!itemCode) {
    res.status(400).json({ error: 'Item code is required' });
    return;
  }

  try {
    const result = await withOracleConnection((conn) =>
      itemValidateService.validateItem(
        {
          itemCode,
          langCode: req.query.langCode ? String(req.query.langCode) : undefined,
          txnCode: req.query.txnCode ? String(req.query.txnCode) : undefined,
          compCode: req.query.compCode ? String(req.query.compCode) : undefined,
          locnCode: req.query.locnCode ? String(req.query.locnCode) : undefined,
        },
        conn,
      ),
    );
    res.json(result);
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 501) {
      sendNotImplemented(res, err);
      return;
    }
    next(err);
  }
}
