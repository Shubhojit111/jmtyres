/* HTTP composition only. Business logic lives in controllers/services/models. */
import express from 'express';
import { env } from './config/env.js';
import { localUploads } from './config/storage.js';
import { cookieMiddleware } from './middleware/authMiddleware.js';
import { originMiddleware } from './middleware/originMiddleware.js';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';
import { asyncRoute } from './utils/http.js';
import { health } from './controllers/healthController.js';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import contentRoutes from './routes/publicContentRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app=express();
app.disable('x-powered-by');
app.disable('etag');
app.set('trust proxy',env.trustProxy.length?env.trustProxy:false);
app.get('/',(_req,res)=>res.redirect('/api/health'));
app.use('/uploads',express.static(localUploads,{dotfiles:'deny',fallthrough:false,maxAge:'1y',immutable:true}));

// Next.js already reverse-proxies /api and /uploads from the browser's origin.
// No permissive cross-origin credential/CORS policy is necessary or enabled.
app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');next();},cookieMiddleware,originMiddleware);
app.get('/api/health',asyncRoute(health));
app.use('/api/auth',authRoutes);
app.use('/api',catalogRoutes);
app.use('/api/content',contentRoutes);
app.use('/api/enquiries',enquiryRoutes);
app.use('/api/requests',requestRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api',notFound);
app.use(errorMiddleware);
export default app;
