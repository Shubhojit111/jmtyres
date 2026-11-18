import { Router } from 'express';
import { listAdmin, updateStatus } from '../controllers/enquiryController.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/',asyncRoute(listAdmin));
router.patch('/:id',jsonBody,asyncRoute(updateStatus));
export default router;
