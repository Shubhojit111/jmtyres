import { getActor, authenticate, createSession, issueReset, logout as revokeSession, publicUser, register as registerUser, resetPassword, updateProfile } from '../services/authService.js';
import { notify } from '../services/notificationService.js';
import { site } from '../utils/links.js';
import { setSessionCookie, clearSessionCookie } from '../utils/token.js';
import { send } from '../utils/http.js';

export async function me(req,res) {
  const actor=await getActor(req);
  send(res,{user:actor?publicUser(actor):null});
}
export async function register(req,res) {
  const user=await registerUser(req.body);
  const session=await createSession(user);
  setSessionCookie(res,session);
  send(res,{user:publicUser(user)},201);
}
export async function login(req,res) {
  const user=await authenticate(req.body);
  const session=await createSession(user);
  setSessionCookie(res,session);
  send(res,{user:publicUser(user)});
}
export async function logout(req,res) {
  await revokeSession(req);
  clearSessionCookie(res);
  send(res,{signedOut:true});
}
export async function profile(req,res) {send(res,{user:await updateProfile(req.actor,req.body)});}
export async function forgotPassword(req,res) {
  const reset=await issueReset(req.body.email);
  if (reset) await notify({
    key:`reset:${reset.token.slice(0,20)}`,recipient:reset.user.email,subject:'Reset your password',
    message:'A password reset was requested. This link works once and expires after 30 minutes. Ignore it if you did not request it.',
    link:`${site()}/${reset.user.role==='admin'?'admin/login':'account'}?reset=${reset.token}`,
  });
  send(res,{message:'If that account exists, password reset instructions have been sent or logged in the demo outbox.'});
}
export async function reset(req,res) {
  await resetPassword(req.body);
  send(res,{message:'Password reset. You can sign in now.'});
}
