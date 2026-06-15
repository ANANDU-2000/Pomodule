import { Router } from 'express';
import * as lookupController from '../controllers/lookup.controller';

const router = Router();

router.get('/', lookupController.search);

export default router;
