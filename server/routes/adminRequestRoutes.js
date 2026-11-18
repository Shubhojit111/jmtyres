import { Router } from 'express';
import * as request from '../controllers/adminRequestController.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/',asyncRoute(request.list));
router.get('/:idOrCode',asyncRoute(request.detail));
router.patch('/:code/approve',jsonBody,asyncRoute(request.approve));
router.patch('/:code/reject',jsonBody,asyncRoute(request.reject));
router.patch('/:code/cancel',jsonBody,asyncRoute(request.cancel));
router.patch('/:code/complete',jsonBody,asyncRoute(request.complete));
export default router;
