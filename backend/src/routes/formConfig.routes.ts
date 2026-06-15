import { Router } from 'express';
import * as formConfigController from '../controllers/formConfig.controller';

const router = Router();

router.get('/form-config', formConfigController.getFormConfig);
router.get('/system-defaults', formConfigController.getSystemDefaultsHandler);

export default router;
