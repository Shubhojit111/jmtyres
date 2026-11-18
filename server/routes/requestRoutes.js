import { Router } from 'express';
import * as request from '../controllers/requestController.js';
import { requireBuyer } from '../middleware/authMiddleware.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { rateLimit } from '../middleware/rateLimitMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.use(requireBuyer);
router.get('/my',asyncRoute(request.listMine));
router.post('/',rateLimit(req=>`request:${req.actor._id}`,25),jsonBody,asyncRoute(request.create));
router.post('/:idOrCode/payment',asyncRoute(request.payment));
router.get('/:idOrCode',asyncRoute(request.detail));
export default router;
