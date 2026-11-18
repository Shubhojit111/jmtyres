import { Router } from 'express';
import * as content from '../controllers/contentController.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/home',asyncRoute(content.home));
router.put('/home',jsonBody,asyncRoute(content.updateHome));
export default router;
