import { env } from '../config/env.js';
import { getDb } from '../config/db.js';
import { paymentConfig } from '../config/razorpay.js';
import { notificationMode } from '../config/email.js';
import { storageMode } from '../config/storage.js';
import { seedDemoProducts } from '../services/demoSeedService.js';
import { auditLogs } from '../models/AuditLogModel.js';
import { notificationLogs } from '../models/NotificationModel.js';
import { send } from '../utils/http.js';

export function settings(_req,res) {
  send(res,{payment:paymentConfig(),notifications:notificationMode(),images:storageMode(),callPhone:env.callPhone,whatsAppPhone:env.whatsAppPhone});
}
export async function seedDemo(req,res) {
  const result=await seedDemoProducts();
  const db=await getDb();
  await auditLogs(db).insertOne({type:'seed_demo_products',actorId:req.actor._id,createdAt:new Date()});
  send(res,result);
}
export async function notifications(_req,res) {
  const db=await getDb();
  const docs=await notificationLogs(db).find().sort({createdAt:-1}).limit(70).toArray();
  send(res,{items:docs.map(({_id,...fields})=>({id:String(_id),...fields}))});
}
export async function audit(_req,res) {
  const db=await getDb();
  const docs=await auditLogs(db).find().sort({createdAt:-1}).limit(80).toArray();
  send(res,{items:docs.map(({_id,...fields})=>({id:String(_id),...fields,actorId:fields.actorId?String(fields.actorId):null}))});
}
