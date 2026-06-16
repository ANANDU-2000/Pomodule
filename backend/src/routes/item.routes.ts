import { Router } from 'express';
import * as itemValidateController from '../controllers/itemValidate.controller';

const router = Router();

router.get('/:itemCode/validate', itemValidateController.validate);

export default router;
