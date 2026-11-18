// Express 4 does not automatically forward rejected async handlers to next().
export const asyncRoute = fn => (req, res, next) => Promise.resolve().then(() => fn(req,res,next)).catch(next);
export const send = (res, data, status = 200) => res.status(status).set('Cache-Control','no-store').json(data);
// URLSearchParams mirrors the old Next/Web-Request query parser (including .get).
export const searchParams = req => new URL(req.originalUrl, 'http://localhost').searchParams;
