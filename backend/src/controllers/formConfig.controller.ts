import type { Request, Response } from 'express';
import * as formConfigService from '../services/formConfig.service';
import { getSystemDefaults } from '../modules/po/systemDefaults.config';

export function getFormConfig(_req: Request, res: Response): void {
  res.json(formConfigService.getFormConfig());
}

export function getSystemDefaultsHandler(_req: Request, res: Response): void {
  res.json(getSystemDefaults());
}
