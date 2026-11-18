import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { requireCustomer } from '../middleware/authMiddleware.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { rateLimit } from '../middleware/rateLimitMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/me',asyncRoute(auth.me));
router.post('/register',rateLimit('register',8),jsonBody,asyncRoute(auth.register));
router.post('/login',rateLimit('login',20),jsonBody,asyncRoute(auth.login));
router.post('/logout',asyncRoute(auth.logout));
router.patch('/profile',requireCustomer,jsonBody,asyncRoute(auth.profile));
router.post('/forgot-password',rateLimit('password-reset',5),jsonBody,asyncRoute(auth.forgotPassword));
router.post('/reset-password',rateLimit('reset-confirm',8),jsonBody,asyncRoute(auth.reset));
export default router;
