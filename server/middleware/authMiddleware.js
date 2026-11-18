import { getActor } from '../services/authService.js';
import { parseCookies } from '../utils/token.js';
import { asyncRoute } from '../utils/http.js';

export function cookieMiddleware(req,_res,next) {req.cookies=parseCookies(req);next();}
export const optionalActor = asyncRoute(async(req,_res,next)=>{req.actor=await getActor(req);next();});
export const requireCustomer = asyncRoute(async(req,_res,next)=>{req.actor=await getActor(req,'customer');next();});
export const requireBuyer = asyncRoute(async(req,_res,next)=>{req.actor=await getActor(req,'buyer');next();});
export const requireAdmin = asyncRoute(async(req,_res,next)=>{req.actor=await getActor(req,'admin');next();});
