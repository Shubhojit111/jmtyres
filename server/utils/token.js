import { randomBytes, createHash } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { env } from '../config/env.js';

export const sessionCookie = 'jm_session';
const secret = () => new TextEncoder().encode(env.authSecret);
const cookieOptions = () => ({ httpOnly:true, sameSite:'lax', secure:env.production, path:'/' });
export const tokenHash = value => createHash('sha256').update(value).digest('hex');
export const newSessionId = () => randomBytes(32).toString('hex');
export const newResetToken = () => randomBytes(32).toString('hex');
export async function signSession(user, id, expiresAt) {
  return new SignJWT({role:user.role,jti:id}).setProtectedHeader({alg:'HS256'})
    .setSubject(String(user._id)).setIssuedAt().setExpirationTime(Math.floor(expiresAt.getTime()/1000)).sign(secret());
}
export async function verifySession(token) { return (await jwtVerify(token,secret(),{algorithms:['HS256']})).payload; }
export const parseCookies = req => parseCookie(req.headers.cookie || '');
export const readSessionToken = req => (req.cookies || parseCookies(req))[sessionCookie];
export function setSessionCookie(res, session) {
  res.append('Set-Cookie',serializeCookie(sessionCookie,session.token,{...cookieOptions(),expires:session.expiresAt}));
}
export function clearSessionCookie(res) {
  res.append('Set-Cookie',serializeCookie(sessionCookie,'',{...cookieOptions(),maxAge:0}));
}
