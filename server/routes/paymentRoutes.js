import { Router } from 'express';
import * as payment from '../controllers/paymentController.js';
import { requireCustomer } from '../middleware/authMiddleware.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { webhookBody } from '../middleware/uploadMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/config',payment.config);
// Signed webhook bytes must be read before any JSON/body parser.
router.post('/webhook',webhookBody,asyncRoute(payment.webhook));
router.use(requireCustomer);
router.post('/create-order',jsonBody,asyncRoute(payment.createOrder));
router.post('/verify',jsonBody,asyncRoute(payment.verify));
router.post('/demo/accept',jsonBody,asyncRoute(payment.acceptDemo));
router.post('/demo/verify',jsonBody,asyncRoute(payment.verifyDemo));
router.post('/demo/fail',jsonBody,asyncRoute(payment.failDemo));
export default router;
