import { Router } from 'express';
import * as catalog from '../controllers/catalogController.js';
import { jsonBody } from '../middleware/validationMiddleware.js';
import { rateLimit } from '../middleware/rateLimitMiddleware.js';
import { asyncRoute } from '../utils/http.js';

const router=Router();
router.get('/products',asyncRoute(catalog.list));
router.get('/products/search',asyncRoute(catalog.list));
router.get('/products/:idOrSlug',asyncRoute(catalog.detail));
router.get('/categories',asyncRoute(catalog.listCategories));
router.get('/brands',asyncRoute(catalog.listBrands));
router.get('/tyre-finder/vehicle-options',asyncRoute(catalog.listVehicles));
router.post('/tyre-finder/search',rateLimit('finder',60),jsonBody,asyncRoute(catalog.searchTyres));
export default router;
