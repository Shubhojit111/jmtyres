import { products } from '../models/ProductModel.js';
import { purchaseRequests, requestSchema, approvalSchema } from '../models/PurchaseRequestModel.js';
import { users } from '../models/UserModel.js';
import { payments } from '../models/PaymentModel.js';
import { auditLogs } from '../models/AuditLogModel.js';
import { randomBytes } from 'crypto';
import { getDb, objectId, withTransaction } from '../config/db.js';
import { ApiError, parse, safeInt, text } from '../utils/validation.js';
import { notifyLowStock, notifyRequestStatus, notifyRequestSubmitted } from './notificationService.js';

const now = () => new Date();
export const makeRequestId = () => `JM-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${randomBytes(5).toString('hex').toUpperCase()}`;
export function publicRequest(req) {
  return { id:String(req._id), requestId:req.requestId, customerId:String(req.customerId), productId:String(req.productId), productSnapshot:req.productSnapshot,
    customerSnapshot:req.customerSnapshot, phone:req.phone, quantity:req.quantity, totalPaise:req.totalPaise, fulfillment:req.fulfillment, message:req.message,
    status:req.status, paymentStatus:req.paymentStatus, paymentType:req.paymentType || null, paymentDuePaise:req.paymentDuePaise || 0,
    paidPaise:req.paidPaise || 0, offlineBalancePaidPaise:req.offlineBalancePaidPaise || 0, reservedQty:req.reservedQty || 0,
    rejectionReason:req.rejectionReason || '', history:req.history || [], createdAt:req.createdAt, updatedAt:req.updatedAt, isDemo:!!req.productSnapshot.isDemo };
}
export async function createPurchaseRequest(customer, input) {
  if (!['customer','admin'].includes(customer.role)) throw new ApiError(403,'Sign in with a customer or admin account to request a tyre.');
  const data = parse(requestSchema,input);
  const id = objectId(data.productId);
  if (!id) throw new ApiError(400,'Select a valid product.');
  const db = await getDb();
  const product = await products(db).findOne({ _id:id, active:true });
  if (!product) throw new ApiError(404,'Product unavailable.');
  if (product.stockQty === 0) throw new ApiError(409,'This product is out of stock. Call the owner instead.');
  if (product.stockQty < data.quantity) throw new ApiError(409,'Requested quantity is above current stock.');
  const time = now();
  const request = { requestId:makeRequestId(), customerId:customer._id, productId:product._id,
    productSnapshot:{ name:product.name, sku:product.sku, brand:product.brand, tyre:product.tyre, pricePaise:product.pricePaise, image:product.images?.[0]?.url || '', isDemo:!!product.isDemo },
    customerSnapshot:{ name:customer.name,email:customer.email }, phone:data.phone,
    quantity:data.quantity, totalPaise:product.pricePaise * data.quantity, fulfillment:data.fulfillment, message:data.message,
    status:'pending', paymentStatus:'not_initiated', reservedQty:0, paidPaise:0,
    history:[{status:'pending',at:time,actor:customer.role}], createdAt:time, updatedAt:time };
  const result = await purchaseRequests(db).insertOne(request);
  request._id = result.insertedId;
  await notifyRequestSubmitted(request, customer);
  return publicRequest(request);
}
export async function getRequest(idOrCode, actor, admin = false) {
  const db = await getDb(); const id = objectId(idOrCode);
  const filter = { ...(id ? { _id:id } : { requestId:idOrCode }), ...(!admin ? { customerId:actor._id } : {}) };
  const req = await purchaseRequests(db).findOne(filter);
  if (!req) throw new ApiError(404,'Request not found.');
  const paymentDocs = await payments(db).find({requestId:req._id}).sort({createdAt:-1}).toArray();
  return { ...publicRequest(req), payments:paymentDocs.map(p=>({id:String(p._id), mode:p.mode, amountPaise:p.amountPaise, status:p.status, gatewayOrderId:p.gatewayOrderId || '',gatewayPaymentId:p.gatewayPaymentId || '', demoAccepted:!!p.demoAcceptedAt, gatewayFailureCount:p.failedGatewayAttempts?.length || 0, createdAt:p.createdAt, verifiedAt:p.verifiedAt || null})) };
}
export async function listRequests(actor, search, admin = false) {
  const db = await getDb(); const filter = admin ? {} : { customerId:actor._id };
  const status = search.get('status'); if (status && status !== 'all') filter.status = status;
  if (admin && search.get('q')) {
    const q = String(search.get('q')).trim().slice(0,70);
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    filter.$or = [{ requestId:{$regex:escaped,$options:'i'} },{ 'customerSnapshot.name':{$regex:escaped,$options:'i'} },{ phone:{$regex:escaped,$options:'i'} }];
  }
  const page = safeInt(search.get('page'),1,1,10000); const limit = safeInt(search.get('limit'),12,1,48);
  const [items,total] = await Promise.all([purchaseRequests(db).find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).toArray(),purchaseRequests(db).countDocuments(filter)]);
  return { items:items.map(publicRequest),total,page,pages:Math.ceil(total/limit) };
}
export async function approveRequest(code, admin, input) {
  const options = parse(approvalSchema,input); const db = await getDb(); const time = now();
  const result = await withTransaction(async session => {
    const request = await purchaseRequests(db).findOne({requestId:code,status:'pending'}, {session});
    if (!request) throw new ApiError(409,'Only pending requests can be approved.');
    const product = await products(db).findOne({_id:request.productId}, {session});
    if (!product || !product.active || product.stockQty < request.quantity) throw new ApiError(409,'Insufficient current stock. Approval was not performed.');
    const advance = options.paymentType === 'advance' ? options.advancePaise : request.totalPaise;
    if (advance > request.totalPaise || (options.paymentType === 'advance' && advance >= request.totalPaise)) throw new ApiError(400,'An advance must be less than the full request amount.');
    const remaining = product.stockQty - request.quantity;
    const crossing = product.stockQty >= 5 && remaining < 5 && !product.lowStockAlerted;
    const stockUpdate = await products(db).updateOne({_id:product._id,stockQty:{$gte:request.quantity}},{$inc:{stockQty:-request.quantity},$set:{updatedAt:time,...(crossing ? {lowStockAlerted:true} : {})}},{session});
    if (!stockUpdate.modifiedCount) throw new ApiError(409,'Stock changed during approval. Please retry.');
    const approval = await purchaseRequests(db).updateOne({_id:request._id,status:'pending'},{$set:{status:'awaiting_payment',paymentStatus:'not_initiated',paymentType:options.paymentType,paymentDuePaise:advance,reservedQty:request.quantity,approvedBy:admin._id,approvedAt:time,updatedAt:time},$push:{history:{status:'awaiting_payment',at:time,actor:String(admin._id),note:`${options.paymentType} payment due`}}},{session});
    if (!approval.modifiedCount) throw new ApiError(409,'Request changed during approval.');
    await auditLogs(db).insertOne({type:'approve_request',actorId:admin._id,requestId:request._id,productId:product._id,quantity:request.quantity,createdAt:time},{session});
    return { request:{...request,status:'awaiting_payment',paymentStatus:'not_initiated',paymentType:options.paymentType,paymentDuePaise:advance,reservedQty:request.quantity}, crossing, product, remaining };
  });
  const customer = await users(db).findOne({_id:result.request.customerId});
  if (customer) await notifyRequestStatus(result.request,customer,'approved');
  if (result.crossing) await notifyLowStock(result.product,result.remaining);
  return publicRequest(result.request);
}
export async function rejectRequest(code, admin, reason) {
  const textReason = parse(text(500),reason);
  const db = await getDb(); const time = now();
  const request = await purchaseRequests(db).findOneAndUpdate({requestId:code,status:'pending'},{$set:{status:'rejected',rejectionReason:textReason,updatedAt:time},$push:{history:{status:'rejected',at:time,actor:String(admin._id),note:textReason}}},{returnDocument:'after'});
  if (!request) throw new ApiError(409,'Only pending requests can be rejected.');
  await auditLogs(db).insertOne({type:'reject_request',actorId:admin._id,requestId:request._id,reason:textReason,createdAt:time});
  const customer = await users(db).findOne({_id:request.customerId});
  if (customer) await notifyRequestStatus(request,customer,'rejected');
  return publicRequest(request);
}
export async function cancelRequest(code, admin, reason) {
  const textReason = parse(text(500),reason);
  const db = await getDb(); const time = now();
  const request = await withTransaction(async session => {
    const doc = await purchaseRequests(db).findOne({requestId:code,status:{$in:['pending','awaiting_payment']}},{session});
    if (!doc) throw new ApiError(409,'Only pending or unpaid approved requests can be cancelled. Paid requests need a separate refund process.');
    const paymentSucceeded = await payments(db).findOne({requestId:doc._id,status:'successful'},{session});
    if (paymentSucceeded) throw new ApiError(409,'A successful payment exists. Resolve/refund payment before restoring stock.');
    // A live order may already have been captured before its webhook reaches us.
    if (await payments(db).findOne({requestId:doc._id,mode:'live',status:'pending'},{session})) throw new ApiError(409,'A Razorpay order is pending. Reconcile it with the gateway before cancelling or restocking.');
    if (doc.reservedQty > 0) {
      const product = await products(db).findOne({_id:doc.productId},{session});
      if (!product) throw new ApiError(409,'The product no longer exists; stock cannot be restored automatically.');
      const rearmed = product.stockQty < 5 && product.stockQty + doc.reservedQty >= 5;
      await products(db).updateOne({_id:doc.productId},{$inc:{stockQty:doc.reservedQty,...(rearmed ? {lowStockCycle:1} : {})},$set:{updatedAt:time,...(rearmed ? {lowStockAlerted:false} : {})}},{session});
    }
    const updated = await purchaseRequests(db).findOneAndUpdate({_id:doc._id,status:doc.status},{$set:{status:'cancelled',reservedQty:0,updatedAt:time},$push:{history:{status:'cancelled',at:time,actor:String(admin._id),note:textReason}}},{session,returnDocument:'after'});
    if (!updated) throw new ApiError(409,'Request changed during cancellation.');
    await auditLogs(db).insertOne({type:'cancel_request',actorId:admin._id,requestId:doc._id,restocked:doc.reservedQty,reason:textReason,createdAt:time},{session});
    return updated;
  });
  const customer = await users(db).findOne({_id:request.customerId});
  if (customer) await notifyRequestStatus(request,customer,'cancelled');
  return publicRequest(request);
}
export async function updateStock(id, admin, quantity) {
  const qty = Number(quantity); if (!Number.isInteger(qty) || qty < 0 || qty > 100000) throw new ApiError(400,'Stock quantity must be a whole number from 0 to 100000.');
  const db = await getDb(); const time = now();
  const result = await withTransaction(async session => {
    const product = await products(db).findOne({_id:objectId(id)},{session});
    if (!product) throw new ApiError(404,'Product not found.');
    const crossed = product.stockQty >= 5 && qty < 5 && !product.lowStockAlerted;
    const rearmed = product.stockQty < 5 && qty >= 5;
    await products(db).updateOne({_id:product._id},{$set:{stockQty:qty,lowStockAlerted:crossed ? true : rearmed ? false : !!product.lowStockAlerted,updatedAt:time},...(rearmed ? {$inc:{lowStockCycle:1}} : {})},{session});
    await auditLogs(db).insertOne({type:'update_stock',actorId:admin._id,productId:product._id,from:product.stockQty,to:qty,createdAt:time},{session});
    return {product,crossed};
  });
  if (result.crossed) await notifyLowStock(result.product,qty);
  return {stockQty:qty};
}
export async function completeRequest(code, admin, input) {
  const offlineBalancePaidPaise = Number(input?.offlineBalancePaidPaise || 0);
  if (!Number.isInteger(offlineBalancePaidPaise) || offlineBalancePaidPaise < 0) throw new ApiError(400,'Enter a valid amount collected offline.');
  const db = await getDb(); const time = now();
  const doc = await purchaseRequests(db).findOne({requestId:code,status:{$in:['paid','awaiting_payment']}});
  if (!doc || !['successful','partially_paid'].includes(doc.paymentStatus)) throw new ApiError(409,'A verified payment is required before completion.');
  const balance = doc.totalPaise - (doc.paidPaise || 0);
  if (offlineBalancePaidPaise !== balance) throw new ApiError(400,`The remaining balance to record is ₹${(balance/100).toFixed(2)}.`);
  const updated = await purchaseRequests(db).findOneAndUpdate({_id:doc._id,status:doc.status},{$set:{status:'completed',offlineBalancePaidPaise,updatedAt:time},$push:{history:{status:'completed',at:time,actor:String(admin._id),note:`Offline balance ₹${(offlineBalancePaidPaise/100).toFixed(2)} confirmed by admin`}}},{returnDocument:'after'});
  if (!updated) throw new ApiError(409,'Request changed; retry.');
  await auditLogs(db).insertOne({type:'complete_request',actorId:admin._id,requestId:doc._id,offlineBalancePaidPaise,createdAt:time});
  const customer = await users(db).findOne({_id:doc.customerId});
  if (customer) await notifyRequestStatus(updated,customer,'completed');
  return publicRequest(updated);
}
