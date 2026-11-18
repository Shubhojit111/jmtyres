/** Shared Mongo-backed per-window counters (not process-local memory). */
export const rateLimits = db => db.collection('rate_limits');
export const rateLimitIndexes = [{key:{key:1},unique:true},{key:{expiresAt:1},expireAfterSeconds:0}];
