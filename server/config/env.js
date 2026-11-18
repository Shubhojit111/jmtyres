import { randomBytes } from 'node:crypto';

// dotenv/config is loaded by server.js and the CLI scripts before this module.
// Keep provider credentials server-side; the Next.js client knows only its
// public phone settings and the private (server-side) BACKEND_URL.
const production = process.env.NODE_ENV === 'production';
if (!globalThis.__jmDevSecret) globalThis.__jmDevSecret = randomBytes(48).toString('hex');

export const env = Object.freeze({
  production,
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || (production ? '' : 'mongodb://127.0.0.1:27017/jmtyres?replicaSet=jmrs'),
  mongoDb: process.env.MONGODB_DB || 'jmtyres',
  authSecret: process.env.AUTH_SECRET || (production ? '' : globalThis.__jmDevSecret),
  frontendOrigin: process.env.FRONTEND_ORIGIN || '',
  trustedOrigins: (process.env.TRUSTED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean),
  siteUrl: process.env.SITE_URL || '',
  sandboxId: process.env.E2B_SANDBOX_ID || '',
  sitePreviewPort: process.env.SITE_PREVIEW_PORT || '3000',
  trustProxy: (process.env.TRUST_PROXY || '').split(',').map(x => x.trim()).filter(Boolean),
  callPhone: process.env.CALL_PHONE || '918336819093',
  whatsAppPhone: process.env.WHATSAPP_NUMBER || '918336819093',
  ownerWhatsAppNumber: process.env.OWNER_WHATSAPP_NUMBER || '918336819093',
  ownerEmail: process.env.OWNER_EMAIL?.trim() || '',
  smtp: Object.freeze({
    host:process.env.SMTP_HOST || '', port:Number(process.env.SMTP_PORT || 587),
    secure:process.env.SMTP_SECURE === 'true', user:process.env.SMTP_USER || '',
    pass:process.env.SMTP_PASS || '', from:process.env.SMTP_FROM || '',
  }),
  whatsApp: Object.freeze({
    phoneNumberId:process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    apiToken:process.env.WHATSAPP_API_TOKEN || '',
    templateName:process.env.WHATSAPP_TEMPLATE_NAME || '',
    templateLanguage:process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en',
  }),
  payment: Object.freeze({
    mode:process.env.PAYMENT_MODE === 'live' ? 'live' : 'demo',
    keyId:process.env.RAZORPAY_KEY_ID || '', keySecret:process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret:process.env.RAZORPAY_WEBHOOK_SECRET || '',
  }),
  r2: Object.freeze({
    endpoint:process.env.R2_ENDPOINT || '', bucket:process.env.R2_BUCKET || '',
    accessKeyId:process.env.R2_ACCESS_KEY_ID || '', secretAccessKey:process.env.R2_SECRET_ACCESS_KEY || '',
    publicBaseUrl:process.env.R2_PUBLIC_BASE_URL || '',
  }),
});

export function validateEnvironment() {
  if (!Number.isSafeInteger(env.port) || env.port < 1 || env.port > 65535) throw Error('Set PORT to a valid TCP port.');
  if (!env.mongoUri) throw Error('Set MONGODB_URI before starting in production.');
  if (production && Buffer.byteLength(env.authSecret) < 32) throw Error('Set AUTH_SECRET to at least 32 random bytes before starting production.');
  // A production frontend origin is needed for browser POST requests proxied by Next.
  if (production && !env.frontendOrigin && !env.trustedOrigins.length) throw Error('Set FRONTEND_ORIGIN to the public frontend origin in production.');
}
