import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { getDb, objectId, withTransaction } from '../config/db.js';
import { ApiError } from '../utils/validation.js';
import { notifyPayment } from './notificationService.js';
import { env } from '../config/env.js';
import { paymentMode, liveReady, paymentConfig, razorpay } from '../config/razorpay.js';
import { payments } from '../models/PaymentModel.js';
import { purchaseRequests } from '../models/PurchaseRequestModel.js';
import { paymentWebhooks } from '../models/PaymentWebhookModel.js';
import { users } from '../models/UserModel.js';
import { auditLogs } from '../models/AuditLogModel.js';
export { paymentConfig };


const safeEqualHex = (given, expected) => /^[a-f\d]+$/i.test(given || '') && Buffer.byteLength(given,'utf8') === expected.length && timingSafeEqual(Buffer.from(given,'utf8'),Buffer.from(expected,'utf8'));
export async function startPayment(requestId, actor) {
  if (actor.role !== 'customer') throw new ApiError(403,'A customer account is required.');
  const db = await getDb();
  const request = await purchaseRequests(db).findOne({requestId,customerId:actor._id});
  if (!request) throw new ApiError(404,'Request not found.');
  if (request.status !== 'awaiting_payment' || request.paidPaise > 0) throw new ApiError(409,'This request does not have an unpaid online payment available.');
  if (!request.paymentDuePaise || request.paymentDuePaise > request.totalPaise) throw new ApiError(409,'The owner has not set a valid payment amount.');
  const actualMode = request.productSnapshot.isDemo ? 'demo' : paymentMode();
  if (actualMode === 'live' && !liveReady()) throw new ApiError(503,'Live payments are not configured. Add Razorpay, SMTP, and owner email settings before enabling them.');
  const previous = await payments(db).findOne({requestId:request._id,status:'pending'});
  if (previous) return publicPayment(previous);
  let orderId = '';
  if (actualMode === 'live') {
    const order = await razorpay('orders',{method:'POST',body:JSON.stringify({ amount:request.paymentDuePaise,currency:'INR',receipt:request.requestId,notes:{requestId:request.requestId} })});
    orderId = order.id;
  }
  const payment = {requestId:request._id,customerId:actor._id,amountPaise:request.paymentDuePaise,currency:'INR',paymentType:request.paymentType,mode:actualMode,status:'pending',gatewayOrderId:orderId || undefined,createdAt:new Date()};
  try { payment._id = (await payments(db).insertOne(payment)).insertedId; }
  catch (error) { if (error.code === 11000) { const latest = await payments(db).findOne({requestId:request._id,status:'pending'}); if (latest) return publicPayment(latest); } throw error; }
  await purchaseRequests(db).updateOne({_id:request._id,status:'awaiting_payment'},{$set:{paymentStatus:'pending',updatedAt:new Date()}});
  return publicPayment(payment);
}
export function publicPayment(payment) { return { id:String(payment._id),requestId:String(payment.requestId),amountPaise:payment.amountPaise,currency:'INR',status:payment.status,mode:payment.mode,gatewayOrderId:payment.gatewayOrderId || '',keyId:payment.mode === 'live' ? env.payment.keyId : '',demoAccepted:!!payment.demoAcceptedAt,createdAt:payment.createdAt }; }
async function ownedPendingPayment(id, actor) {
  const db = await getDb(); const payment = await payments(db).findOne({_id:objectId(id),customerId:actor._id});
  if (!payment) throw new ApiError(404,'Payment not found.');
  if (payment.mode !== 'demo') throw new ApiError(400,'Demo controls cannot be used for a real payment.');
  if (payment.status !== 'pending') throw new ApiError(409,'This payment attempt has already finished.');
  return payment;
}
export async function demoAccept(id, actor) {
  const payment = await ownedPendingPayment(id,actor);
  const db = await getDb();
  await payments(db).updateOne({_id:payment._id,status:'pending'},{$set:{demoAcceptedAt:new Date(),demoReference:`DEMO-${randomBytes(6).toString('hex').toUpperCase()}`}});
  return { accepted:true, notice:'DEMO ACCEPTED — a simulation only. Click Demo Verify to record the simulated outcome. No real funds have moved.' };
}
async function finalize(id, gatewayPaymentId = '') {
  const db = await getDb();
  const result = await withTransaction(async session => {
    const payment = await payments(db).findOne({_id:id},{session});
    if (!payment) throw new ApiError(404,'Payment attempt not found.');
    if (payment.status === 'successful') {
      if (gatewayPaymentId && payment.gatewayPaymentId !== gatewayPaymentId) throw new ApiError(409,'A different Razorpay payment was already recorded for this order. Reconcile the gateway before continuing.');
      return {payment,duplicate:true};
    }
    if (payment.status !== 'pending') throw new ApiError(409,'Only a pending payment can be verified.');
    if (payment.mode === 'demo' && !payment.demoAcceptedAt) throw new ApiError(409,'Click Demo Accept Payment before Demo Verify.');
    const request = await purchaseRequests(db).findOne({_id:payment.requestId},{session});
    if (!request || request.status !== 'awaiting_payment' || (request.paidPaise || 0) > 0 || request.paymentDuePaise !== payment.amountPaise) throw new ApiError(409,'Request payment state changed; no payment was recorded.');
    const full = payment.amountPaise === request.totalPaise;
    const timestamp = new Date();
    const paymentResult = await payments(db).updateOne({_id:id,status:'pending'},{$set:{status:'successful',gatewayPaymentId:gatewayPaymentId || undefined,verifiedAt:timestamp,verificationSource:payment.mode === 'demo' ? 'DEMO_SIMULATION' : 'RAZORPAY_SERVER_CHECK'}},{session});
    if (!paymentResult.modifiedCount) throw new ApiError(409,'Payment has already been processed.');
    await purchaseRequests(db).updateOne({_id:request._id,status:'awaiting_payment'},{$set:{paymentStatus:full ? 'successful' : 'partially_paid',status:full ? 'paid' : 'awaiting_payment',paidPaise:payment.amountPaise,updatedAt:timestamp},$push:{history:{status:full ? 'paid' : 'partially_paid',at:timestamp,actor:payment.mode, note:payment.mode === 'demo' ? 'Simulated demo verification; no real funds moved.' : 'Razorpay captured payment verified server-side.'}}},{session});
    await auditLogs(db).insertOne({type:payment.mode === 'demo' ? 'demo_payment' : 'live_payment',paymentId:payment._id,requestId:request._id,amountPaise:payment.amountPaise,createdAt:timestamp},{session});
    return {payment:{...payment,status:'successful',gatewayPaymentId,verifiedAt:timestamp},request,duplicate:false};
  });
  if (!result.duplicate) {
    const customer = await users(db).findOne({_id:result.request.customerId});
    if (customer) await notifyPayment(result.payment,result.request,customer,true);
  }
  return { payment:publicPayment(result.payment),duplicate:result.duplicate,notice:result.payment.mode === 'demo' ? 'DEMO VERIFIED — simulated success, not a real Razorpay transaction.' : 'Razorpay payment verified server-side.' };
}
export async function demoVerify(id, actor) { await ownedPendingPayment(id,actor); return finalize(objectId(id)); }
export async function failPayment(id, actor, demo = true) {
  const db = await getDb();
  if (demo) await ownedPendingPayment(id,actor);
  const result = await withTransaction(async session => {
    const p = await payments(db).findOne({_id:objectId(id),...(actor ? {customerId:actor._id} : {}),status:'pending'},{session});
    if (!p) return null;
    await payments(db).updateOne({_id:p._id,status:'pending'},{$set:{status:'failed',failedAt:new Date(),failureReason:demo ? 'Simulated failure' : 'Gateway reported payment failed'}},{session});
    const request = await purchaseRequests(db).findOne({_id:p.requestId},{session});
    if (request?.status === 'awaiting_payment') await purchaseRequests(db).updateOne({_id:request._id},{$set:{paymentStatus:'failed',updatedAt:new Date()},$push:{history:{status:'payment_failed',at:new Date(),actor:p.mode}}},{session});
    return {payment:{...p,status:'failed'},request};
  });
  if (result?.request) { const customer = await users(db).findOne({_id:result.request.customerId}); if (customer) await notifyPayment(result.payment,result.request,customer,false); }
  return { failed:!!result,notice:demo ? 'DEMO FAILED — simulated failure; no funds moved.' : 'Payment attempt failed.' };
}
export async function verifyLive(input, actor) {
  if (!liveReady()) throw new ApiError(503,'Live Razorpay is not configured.');
  const {razorpay_order_id:orderId,razorpay_payment_id:paymentId,razorpay_signature:signature} = input || {};
  if (![orderId,paymentId,signature].every(value => typeof value === 'string' && value.length < 160)) throw new ApiError(400,'Invalid payment proof.');
  const db = await getDb(); const payment = await payments(db).findOne({gatewayOrderId:orderId,mode:'live',...(actor ? {customerId:actor._id} : {})});
  if (!payment) throw new ApiError(404,'Payment order not found.');
  const expected = createHmac('sha256',env.payment.keySecret).update(`${orderId}|${paymentId}`).digest('hex');
  if (!safeEqualHex(signature,expected)) throw new ApiError(400,'Razorpay signature verification failed.');
  const gateway = await razorpay(`payments/${encodeURIComponent(paymentId)}`);
  if (gateway.order_id !== orderId || gateway.amount !== payment.amountPaise || gateway.currency !== 'INR' || gateway.status !== 'captured') throw new ApiError(409,'Razorpay has not confirmed a captured payment for this order.');
  return finalize(payment._id,paymentId);
}
export async function handleWebhook(raw, headerSignature, eventId) {
  if (!liveReady()) throw new ApiError(503,'Live Razorpay webhooks are not configured.');
  const expected = createHmac('sha256',env.payment.webhookSecret).update(raw).digest('hex');
  if (!safeEqualHex(headerSignature,expected)) throw new ApiError(401,'Invalid webhook signature.');
  let event;
  try { event = JSON.parse(raw); } catch { throw new ApiError(400,'Webhook body is not valid JSON.'); }
  const id = String(eventId || event.id || '').slice(0,160);
  if (!id) throw new ApiError(400,'Webhook event ID required.');
  const db = await getDb();
  if (await paymentWebhooks(db).findOne({eventId:id})) return {acknowledged:true,duplicate:true};
  const paymentData = event.payload?.payment?.entity;
  if (event.event === 'payment.captured' && paymentData?.order_id && paymentData?.id) {
    const payment = await payments(db).findOne({gatewayOrderId:paymentData.order_id,mode:'live'});
    if (!payment || payment.amountPaise !== paymentData.amount || paymentData.currency !== 'INR') throw new ApiError(409,'Captured payment does not match a recorded order.');
    await verifyLiveWebhook(payment,paymentData.id);
  }
  if (event.event === 'payment.failed' && paymentData?.order_id) {
    const payment = await payments(db).findOne({gatewayOrderId:paymentData.order_id,mode:'live'});
    if (payment && payment.status === 'pending') {
      // One failed attempt does not close a Razorpay order. Another attempt on
      // the same order can still be captured; preserve it for later verification.
      await payments(db).updateOne({_id:payment._id,status:'pending'},{$push:{failedGatewayAttempts:{gatewayPaymentId:String(paymentData.id || ''),eventId:id,at:new Date()}},$set:{lastGatewayFailureAt:new Date()}});
    }
  }
  try { await paymentWebhooks(db).insertOne({eventId:id,event:event.event,receivedAt:new Date()}); } catch(error) { if (error.code !== 11000) throw error; }
  return {acknowledged:true};
}
async function verifyLiveWebhook(payment,paymentId) {
  const gateway = await razorpay(`payments/${encodeURIComponent(paymentId)}`);
  if (gateway.status !== 'captured' || gateway.order_id !== payment.gatewayOrderId || gateway.amount !== payment.amountPaise || gateway.currency !== 'INR') throw new ApiError(409,'Gateway confirmation did not match the webhook.');
  return finalize(payment._id,paymentId);
}
