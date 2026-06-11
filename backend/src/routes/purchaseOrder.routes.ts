import { Router } from 'express';
import { validateQuery } from '../middleware/validateQuery';
import * as purchaseOrderController from '../controllers/purchaseOrder.controller';

const router = Router();

router.get('/', validateQuery, purchaseOrderController.getList);
router.get('/:id', purchaseOrderController.getDetail);
router.put('/:id', purchaseOrderController.updateDetail);

export default router;
