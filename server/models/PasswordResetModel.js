import { z } from 'zod';
import { password } from '../utils/validation.js';

/** Hashed one-time tokens; userId references users._id; TTL cleans up expiry. */
export const passwordResets = db => db.collection('password_resets');
export const passwordResetIndexes = [{key:{tokenHash:1},unique:true},{key:{expiresAt:1},expireAfterSeconds:0}];
export const resetSchema = z.object({token:z.string().regex(/^[0-9a-f]{64}$/),password});
