/* Next.js serves the UI; the independent Express app owns every API endpoint.
 * The browser only uses same-origin /api/* and /uploads/*; BACKEND_URL stays server-side. */
const backend = (process.env.BACKEND_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');
const target = new URL(backend);
if (!['http:', 'https:'].includes(target.protocol) || target.pathname !== '/' || target.search || target.hash)
  throw new Error('BACKEND_URL must be an HTTP(S) origin, e.g. http://127.0.0.1:4000.');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async rewrites() {
    return [
      { source:'/api/:path*', destination:`${backend}/api/:path*` },
      { source:'/uploads/:path*', destination:`${backend}/uploads/:path*` },
    ];
  },
};
