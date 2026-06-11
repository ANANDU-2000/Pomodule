import { Router } from 'express';
import { validateQuery } from '../middleware/validateQuery';
import { validateUpdateBody } from '../middleware/validateUpdateBody';
import * as purchaseOrderController from '../controllers/purchaseOrder.controller';

const router = Router();

router.get('/', validateQuery, purchaseOrderController.getList);
router.get('/:id', purchaseOrderController.getDetail);
router.put('/:id', validateUpdateBody, purchaseOrderController.updateDetail);

export default router;
