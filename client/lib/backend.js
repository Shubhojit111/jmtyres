/* Server-only API client: Next.js renders pages using the separate Express API. */
import { cookies } from 'next/headers';

const backend = () => (process.env.BACKEND_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');

export async function apiGet(path, { session = false } = {}) {
  const token = session ? cookies().get('jm_session')?.value : undefined;
  const response = await fetch(`${backend()}/api/${path}`, {
    headers: token ? { Cookie:`jm_session=${encodeURIComponent(token)}` } : {},
    cache:'no-store', signal:AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.error || `Backend returned HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function getSessionUser() { return (await apiGet('auth/me', {session:true})).user; }
export async function getProduct(slug) { return (await apiGet(`products/${encodeURIComponent(slug)}`)).product; }
export async function getBrands() { return (await apiGet('brands')).items; }
export async function getHomeContent() { return (await apiGet('content/home')).content; }
