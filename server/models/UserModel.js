import { z } from 'zod';
import { text, email, phone, password } from '../utils/validation.js';

/** Native MongoDB collection. Existing BSON: email unique; role admin/customer. */
export const users = db => db.collection('users');
export const userIndexes = [{key:{email:1},unique:true},{key:{role:1,createdAt:-1}}];
export const registrationSchema = z.object({name:text(90),email,phone,password});
export const loginSchema = z.object({email,password:z.string().min(1).max(128)});
export const profileSchema = z.object({name:text(90),phone});
