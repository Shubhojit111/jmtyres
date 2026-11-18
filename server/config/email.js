import nodemailer from 'nodemailer';
import { env } from './env.js';

export const emailConfigured = () => Boolean(env.smtp.host && env.smtp.from && env.smtp.user && env.smtp.pass);
export const notificationMode = () => ({
  email:emailConfigured() ? 'configured' : 'demo_log_only',
  whatsApp:'redirect_only',
});
let transport;
export function mailTransport() {
  if (!transport) transport = nodemailer.createTransport({
    host:env.smtp.host,port:env.smtp.port,secure:env.smtp.secure,
    auth:{user:env.smtp.user,pass:env.smtp.pass},
  });
  return transport;
}
