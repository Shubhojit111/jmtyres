import { z } from 'zod';
import { text, cleanOptional, email, phone } from '../utils/validation.js';

export const enquiries = db => db.collection('enquiries');
export const enquiryIndex = {createdAt:-1};
export const enquirySchema = z.object({
  name:text(90),phone,email,vehicleType:cleanOptional(70),requirement:text(500),message:text(2000),
});
