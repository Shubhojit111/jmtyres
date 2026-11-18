import { Router } from 'express';
import * as product from '../controllers/adminProductController.js';
import * as image from '../controllers/adminImageController.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { multipartBody, parseUpload } from '../middleware/uploadMiddleware.js';
import { rateLimit } from '../middleware/rateLimitMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/',asyncRoute(product.list));
router.post('/',jsonBody,asyncRoute(product.create));
router.post('/images',rateLimit(req=>`image:${req.actor._id}`,80),multipartBody,parseUpload,asyncRoute(image.upload));
router.delete('/images',asyncRoute(image.remove));
router.patch('/:id/stock',jsonBody,asyncRoute(product.stock));
router.get('/:id',asyncRoute(product.detail));
router.put('/:id',jsonBody,asyncRoute(product.update));
router.delete('/:id',asyncRoute(product.remove));
export default router;
