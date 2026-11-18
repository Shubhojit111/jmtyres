import { getDb } from '../config/db.js';
import { parse } from '../utils/validation.js';
import { siteContent, contentSchema, defaultHome } from '../models/SiteContentModel.js';
import { auditLogs } from '../models/AuditLogModel.js';

export { defaultHome };
export async function getHomeContent() {
  const db = await getDb();
  const doc = await siteContent(db).findOne({_id:'home'});
  return {...defaultHome,...(doc ? Object.fromEntries(Object.entries(doc).filter(([key]) => key !== '_id' && key !== 'updatedBy' && key !== 'updatedAt')) : {})};
}
export async function updateHomeContent(input, admin) {
  const data = parse(contentSchema,input);
  const db = await getDb();
  await siteContent(db).updateOne({_id:'home'},{$set:{...data,updatedBy:admin._id,updatedAt:new Date()}},{upsert:true});
  await auditLogs(db).insertOne({type:'update_home_content',actorId:admin._id,createdAt:new Date()});
  return data;
}
