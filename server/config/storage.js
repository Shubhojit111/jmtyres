import { fileURLToPath } from 'node:url';
import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env.js';

export const localUploads = fileURLToPath(new URL('../public/uploads/',import.meta.url));
export const r2Configured = () => Boolean(env.r2.endpoint && env.r2.bucket && env.r2.accessKeyId && env.r2.secretAccessKey && env.r2.publicBaseUrl);
export const storageMode = () => r2Configured() ? 'cloudflare_r2' : env.production ? 'not_configured' : 'local_development';
let client;
export function r2Client() {
  if (!client) client = new S3Client({region:'auto',endpoint:env.r2.endpoint,credentials:{accessKeyId:env.r2.accessKeyId,secretAccessKey:env.r2.secretAccessKey}});
  return client;
}
