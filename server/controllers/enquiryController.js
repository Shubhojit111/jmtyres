import { getDb, objectId } from '../config/db.js';
import { enquiries, enquirySchema } from '../models/EnquiryModel.js';
import { notifyEnquiry } from '../services/notificationService.js';
import { ApiError, parse, safeInt } from '../utils/validation.js';
import { searchParams, send } from '../utils/http.js';

export async function submit(req,res) {
  const data=parse(enquirySchema,req.body);
  const db=await getDb();
  const enquiry={...data,status:'new',createdAt:new Date(),updatedAt:new Date()};
  enquiry._id=(await enquiries(db).insertOne(enquiry)).insertedId;
  await notifyEnquiry(enquiry);
  send(res,{id:String(enquiry._id),message:'Your enquiry has been saved. WhatsApp is optional if you also want to send the details directly.'},201);
}
export async function listAdmin(req,res) {
  const q=searchParams(req);
  const filter=q.get('status') && q.get('status')!=='all' ? {status:q.get('status')} : {};
  const page=safeInt(q.get('page'),1,1,10000);
  const db=await getDb();
  const [docs,total]=await Promise.all([
    enquiries(db).find(filter).sort({createdAt:-1}).skip((page-1)*20).limit(20).toArray(),
    enquiries(db).countDocuments(filter),
  ]);
  send(res,{items:docs.map(({_id,...fields})=>({id:String(_id),...fields})),total,page,pages:Math.ceil(total/20)});
}
export async function updateStatus(req,res) {
  const status=req.body.status;
  if (!['new','contacted','closed'].includes(status)) throw new ApiError(400,'Invalid enquiry status.');
  const db=await getDb();
  const result=await enquiries(db).updateOne({_id:objectId(req.params.id)},{$set:{status,updatedAt:new Date()}});
  if (!result.matchedCount) throw new ApiError(404,'Enquiry not found.');
  send(res,{updated:true});
}
