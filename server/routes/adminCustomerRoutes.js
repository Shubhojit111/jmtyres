import { Router } from 'express';
import * as customer from '../controllers/adminCustomerController.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/',asyncRoute(customer.list));
router.get('/:id',asyncRoute(customer.detail));
export default router;
