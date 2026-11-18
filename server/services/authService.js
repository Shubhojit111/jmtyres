import bcrypt from 'bcryptjs';
import { getDb, objectId, withTransaction } from '../config/db.js';
import { ApiError, email, parse } from '../utils/validation.js';
import { users, registrationSchema, loginSchema, profileSchema } from '../models/UserModel.js';
import { sessions } from '../models/SessionModel.js';
import { passwordResets, resetSchema } from '../models/PasswordResetModel.js';
import { newSessionId, newResetToken, signSession, verifySession, readSessionToken, tokenHash } from '../utils/token.js';

export async function createSession(user) {
  const db = await getDb();
  const id = newSessionId();
  const expiresAt = new Date(Date.now() + (user.role === 'admin' ? 8 : 7 * 24) * 3600000);
  await sessions(db).insertOne({id,userId:user._id,createdAt:new Date(),expiresAt});
  const token = await signSession(user,id,expiresAt);
  return {token,expiresAt};
}
export async function getActor(req, required = null) {
  const token = readSessionToken(req);
  if (!token) {if (required) throw new ApiError(401,'Please sign in to continue.','AUTH_REQUIRED');return null;}
  let payload;
  try {payload = await verifySession(token);}
  catch {if (required) throw new ApiError(401,'Your session has expired. Please sign in again.','AUTH_REQUIRED');return null;}
  const userId = objectId(payload.sub);
  if (!userId || !payload.jti) {if (required) throw new ApiError(401,'Please sign in again.','AUTH_REQUIRED');return null;}
  const db = await getDb();
  const [session,user] = await Promise.all([
    sessions(db).findOne({id:payload.jti,userId,expiresAt:{$gt:new Date()}}),
    users(db).findOne({_id:userId,accountStatus:'active'}),
  ]);
  if (!session || !user) {if (required) throw new ApiError(401,'Please sign in again.','AUTH_REQUIRED');return null;}
  if (required === 'admin' && user.role !== 'admin') throw new ApiError(403,'Admin access required.','FORBIDDEN');
  if (required === 'customer' && user.role !== 'customer') throw new ApiError(403,'Customer access required.','FORBIDDEN');
  return user;
}
export function publicUser(user) {
  return {id:String(user._id),name:user.name,email:user.email,phone:user.phone,role:user.role,createdAt:user.createdAt};
}
export async function register(input) {
  const data = parse(registrationSchema,input);
  const db = await getDb();
  const user = {...data,passwordHash:await bcrypt.hash(data.password,12),role:'customer',accountStatus:'active',createdAt:new Date(),updatedAt:new Date()};
  delete user.password;
  try {const result=await users(db).insertOne(user);user._id=result.insertedId;}
  catch(error){if(error.code===11000)throw new ApiError(409,'An account already exists for this email address.');throw error;}
  return user;
}
export async function authenticate(input) {
  const data = parse(loginSchema,input);
  const db = await getDb();
  const user = await users(db).findOne({email:data.email,accountStatus:'active'});
  // Verify a fixed dummy hash for unknown accounts to avoid address timing leaks.
  const hash = user?.passwordHash || '$2a$12$C95kGE5dWbZjgIixYYRxhuh.9ct4cRvCLLyA.gP75.YWIOItxRRGe';
  if (!await bcrypt.compare(data.password,hash) || !user) throw new ApiError(401,'Email or password is incorrect.','INVALID_LOGIN');
  return user;
}
export async function logout(req) {
  const token = readSessionToken(req);
  if (!token) return;
  try {const payload=await verifySession(token);const db=await getDb();await sessions(db).deleteOne({id:payload.jti});}
  catch { /* Clearing the cookie still signs the user out. */ }
}
export async function updateProfile(user,input) {
  const data = parse(profileSchema,input);
  const db = await getDb();
  await users(db).updateOne({_id:user._id},{$set:{...data,updatedAt:new Date()}});
  return {...publicUser(user),...data};
}
export async function issueReset(emailAddress) {
  const value = parse(email,emailAddress);
  const db = await getDb();
  const user = await users(db).findOne({email:value,accountStatus:'active'});
  if (!user) return null;
  const token = newResetToken();
  await passwordResets(db).insertOne({tokenHash:tokenHash(token),userId:user._id,expiresAt:new Date(Date.now()+30*60000),createdAt:new Date()});
  return {user,token};
}
export async function resetPassword(input) {
  const data = parse(resetSchema,input);
  const db = await getDb();
  const hash = await bcrypt.hash(data.password,12);
  return withTransaction(async session => {
    const reset = await passwordResets(db).findOneAndDelete({tokenHash:tokenHash(data.token),expiresAt:{$gt:new Date()}},{session});
    if (!reset) throw new ApiError(400,'This reset link has expired or has already been used.');
    await users(db).updateOne({_id:reset.userId},{$set:{passwordHash:hash,updatedAt:new Date()}},{session});
    await sessions(db).deleteMany({userId:reset.userId},{session});
    return true;
  });
}
