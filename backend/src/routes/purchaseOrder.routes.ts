import { Router } from 'express';
import { validateQuery } from '../middleware/validateQuery';
import { validateUpdateBody } from '../middleware/validateUpdateBody';
import { validateCreateBody } from '../middleware/validateCreateBody';
import * as purchaseOrderController from '../controllers/purchaseOrder.controller';

const router = Router();

router.get('/', validateQuery, purchaseOrderController.getList);
router.post('/', validateCreateBody, purchaseOrderController.createDetail);
router.post('/:id/approve', purchaseOrderController.approveDetail);
router.get('/:id/items', purchaseOrderController.getLineItems);
router.get('/:id', purchaseOrderController.getDetail);
router.put('/:id', validateUpdateBody, purchaseOrderController.updateDetail);

export default router;
