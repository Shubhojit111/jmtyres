import { env } from '../config/env.js';

// Never put an internal backend URL in customer mail or reset links.
export const site = () => {
  const configured = env.siteUrl.replace(/\/$/, '');
  const loopback = !configured || /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(configured);
  if (loopback && /^[a-z0-9-]+$/i.test(env.sandboxId) && /^\d{2,5}$/.test(String(env.sitePreviewPort)))
    return `https://${env.sitePreviewPort}-${env.sandboxId}.e2b.app`;
  return configured || 'http://localhost:3000';
};
