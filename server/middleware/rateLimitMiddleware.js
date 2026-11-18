import { getDb } from '../config/db.js';
import { rateLimits } from '../models/RateLimitModel.js';
import { ApiError } from '../utils/validation.js';
import { asyncRoute } from '../utils/http.js';

// Counters live in MongoDB so rate limits work across Express replicas.
// req.ip uses only the socket by default; configure TRUST_PROXY for known
// reverse proxies rather than accepting spoofable forwarded IP headers.
export const rateLimit = (label,max=12,windowMinutes=60) => asyncRoute(async(req,_res,next)=>{
  const ip=String(req.ip || 'local').slice(0,80);
  const windowId=Math.floor(Date.now()/(windowMinutes*60000));
  const name=typeof label==='function'?label(req):label;
  const key=`${name}:${ip}:${windowId}`;
  const db=await getDb();let doc;
  try {
    doc=await rateLimits(db).findOneAndUpdate({key},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((windowId+1)*windowMinutes*60000+3600000)}},{upsert:true,returnDocument:'after'});
  } catch(error) {
    if (error.code===11000) doc=await rateLimits(db).findOneAndUpdate({key},{$inc:{count:1}},{returnDocument:'after'});
    else throw error;
  }
  if (doc.count>max) throw new ApiError(429,'Too many attempts. Please try again later.','RATE_LIMITED');
  next();
});
