import type { Request, Response, NextFunction } from 'express';
import * as lookupService from '../services/lookup.service';
import { withOracleConnection } from '../utils/withOracleConnection';
import { isValidLookupType } from '../modules/lookup/lookup.config';
import type { LookupType } from '../types/lookup.types';

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  const type = String(req.query.type ?? '');
  const q = String(req.query.q ?? '');
  const supplierCode = req.query.supplierCode ? String(req.query.supplierCode) : undefined;

  if (!isValidLookupType(type)) {
    res.status(400).json({ error: 'Invalid lookup type', validTypes: ['supplier', 'item', 'location', 'paymentTerm'] });
    return;
  }

  try {
    const result = await withOracleConnection((conn) =>
      lookupService.getLookupResults({ type: type as LookupType, q, supplierCode }, conn),
    );

    if (!result.configured) {
      res.status(503).json(result);
      return;
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}
