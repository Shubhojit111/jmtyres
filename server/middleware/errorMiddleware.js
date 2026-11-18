import { ApiError } from '../utils/validation.js';
import { env } from '../config/env.js';

export function notFound(_req,_res,next) {next(new ApiError(404,'API endpoint not found.','NOT_FOUND'));}
export function errorMiddleware(error,req,res,next) {
  if (res.headersSent) return next(error);
  res.set('Cache-Control','no-store');
  if (error instanceof ApiError) return res.status(error.status).json({error:error.message,code:error.code});
  if (error.code===11000) return res.status(409).json({error:'This record already exists.'});
  if (error.type==='entity.too.large') {
    const webhook=req.originalUrl?.split('?')[0]==='/api/payments/webhook';
    return res.status(413).json({error:webhook?'Webhook too large.':'Request body is too large.',code:'REQUEST_ERROR'});
  }
  if (error.status===404) return res.status(404).json({error:'File not found.'});
  console.error('API error',req.method,req.originalUrl,error);
  return res.status(500).json({error:env.production?'An unexpected server error occurred.':String(error.message || 'Server error')});
}
