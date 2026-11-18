import { Router } from 'express';
import { home } from '../controllers/contentController.js';
import { asyncRoute } from '../utils/http.js';
const router=Router();
router.get('/home',asyncRoute(home));
export default router;
