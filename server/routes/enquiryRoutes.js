import { Router } from 'express';
import { submit } from '../controllers/enquiryController.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { rateLimit } from '../middleware/rateLimitMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.post('/',rateLimit('enquiry',8),jsonBody,asyncRoute(submit));
export default router;
