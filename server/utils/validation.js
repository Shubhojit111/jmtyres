import { z } from 'zod';

export class ApiError extends Error {
  constructor(status, message, code = 'REQUEST_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export const text = (max = 250) => z.string().trim().min(1).max(max);
export const email = z.string().trim().email().max(254).transform(value => value.toLowerCase());
export const phone = z.string().trim().regex(/^\+?[0-9][0-9\s()-]{8,20}$/, 'Enter a valid phone number.');
export const password = z.string().min(12).max(72).refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Password must be at most 72 UTF-8 bytes.');
export const cleanOptional = (max = 250) => z.string().trim().max(max).optional().default('');
export function parse(schema, input) {
  const result = schema.safeParse(input);
  if (!result.success) throw new ApiError(400, result.error.issues.map(issue => `${issue.path.join('.') || 'field'}: ${issue.message}`).slice(0, 4).join('; '), 'VALIDATION_ERROR');
  return result.data;
}
export function slugify(value) { return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 110) || 'tyre'; }
export function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
export function safeInt(value, fallback, min, max) { const n = Number(value); return Number.isInteger(n) && n >= min && n <= max ? n : fallback; }
