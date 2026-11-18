import { env } from '../config/env.js';
import { ApiError } from '../utils/validation.js';

const allowed = [env.frontendOrigin,...env.trustedOrigins]
  .filter(Boolean).map(value => {try{return new URL(value).origin;}catch{return '';}});

// The browser uses Next.js's same-origin reverse proxy. Cross-origin mutations
// are rejected; X-Forwarded-Host is deliberately never used as an allowlist.
export function originMiddleware(req,_res,next) {
  if (req.method==='GET' || (req.method==='POST' && req.path==='/payments/webhook')) return next();
  const origin=req.get('origin');
  if (!origin) return next(); // Service-to-service calls may not send Origin.
  let parsed;
  try {parsed=new URL(origin);}catch{return next(new ApiError(403,'Invalid request origin.'));}
  if (parsed.origin!==origin || (parsed.host!==req.get('host') && !allowed.includes(parsed.origin)))
    return next(new ApiError(403,'Cross-origin request blocked.'));
  next();
}
