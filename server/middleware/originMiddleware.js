import { env } from '../config/env.js';
import { ApiError } from '../utils/validation.js';

const allowed = [
  env.frontendOrigin,
  ...env.trustedOrigins,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4000',
  'http://127.0.0.1:4000',
]
  .filter(Boolean)
  .map(value => {try{return new URL(value).origin;}catch{return '';}})
  .filter(Boolean);

// The browser uses Next.js's same-origin reverse proxy. Cross-origin mutations
// are checked against allowed frontend origins.
export function originMiddleware(req,_res,next) {
  if (req.method==='GET' || (req.method==='POST' && req.path==='/payments/webhook')) return next();
  const origin=req.get('origin');
  if (!origin) return next(); // Service-to-service calls or server components may not send Origin.
  let parsed;
  try {parsed=new URL(origin);}catch{return next(new ApiError(403,'Invalid request origin.'));}
  if (!allowed.includes(parsed.origin) && parsed.host !== req.get('host'))
    return next(new ApiError(403,'Cross-origin request blocked.'));
  next();
}
