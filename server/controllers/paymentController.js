import { paymentConfig } from '../config/razorpay.js';
import { startPayment, verifyLive, demoAccept, demoVerify, failPayment, handleWebhook } from '../services/paymentService.js';
import { ApiError } from '../utils/validation.js';
import { send } from '../utils/http.js';

export function config(_req,res) {send(res,paymentConfig());}
export async function webhook(req,res) {
  const raw=(req.body || Buffer.alloc(0)).toString('utf8');
  if (raw.length>131072) throw new ApiError(413,'Webhook too large.');
  send(res,await handleWebhook(raw,req.get('x-razorpay-signature'),req.get('x-razorpay-event-id')));
}
export async function createOrder(req,res) {send(res,{payment:await startPayment(req.body.requestId,req.actor)});}
export async function verify(req,res) {send(res,await verifyLive(req.body,req.actor));}
export async function acceptDemo(req,res) {send(res,await demoAccept(req.body.paymentId,req.actor));}
export async function verifyDemo(req,res) {send(res,await demoVerify(req.body.paymentId,req.actor));}
export async function failDemo(req,res) {send(res,await failPayment(req.body.paymentId,req.actor,true));}
