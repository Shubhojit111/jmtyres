import { getDb } from '../config/db.js';
import { env } from '../config/env.js';
import { emailConfigured, mailTransport, notificationMode } from '../config/email.js';
import { site } from '../utils/links.js';
import { notificationLogs } from '../models/NotificationModel.js';
export { notificationMode, site };

const ownerEmail = () => env.ownerEmail;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
export async function notify({ key, channel = 'email', recipient, subject, message, link }) {
  const db = await getDb();
  let doc;
  try {
    const result = await notificationLogs(db).insertOne({ key, channel, recipient: recipient || 'NOT CONFIGURED', subject, message, link: link || '', status: 'pending', createdAt: new Date() });
    doc = result.insertedId;
  } catch (error) {
    if (error.code === 11000) return { status: 'duplicate' };
    throw error;
  }
  let status = 'demo_log_only'; let errorMessage = ''; let providerId = '';
  try {
    if (channel === 'email' && emailConfigured() && recipient) {
      const result = await mailTransport().sendMail({ from: env.smtp.from, to: recipient, subject: `J.M. Tyres | ${subject}`, text: [message, link].filter(Boolean).join('\n\n'), html: `<div style="font-family:Arial,sans-serif;color:#153c28;max-width:570px;padding:28px;border:1px solid #dbe7dc;border-radius:18px"><strong style="font-size:19px">J.M. Tyre Services</strong><p style="white-space:pre-line;line-height:1.6;color:#263c2c">${escapeHtml(message)}</p>${link ? `<p><a href="${escapeHtml(link)}" style="color:#245b37">View details</a></p>` : ''}<small style="color:#5b6c60">Mulund West, Mumbai · This is a transactional message.</small></div>` });
      providerId = result.messageId; status = 'sent';
    }
  } catch (error) { status = 'failed'; errorMessage = String(error.message).slice(0, 280); }
  await notificationLogs(db).updateOne({ _id: doc }, { $set: { status, error: errorMessage, providerId, updatedAt: new Date() } });
  return { status };
}
export async function notifyRequestSubmitted(request, customer) {
  const url = `${site()}/admin/requests?request=${encodeURIComponent(request.requestId)}`;
  const description = `${request.requestId}\n${customer.name} · ${customer.phone}\n${request.productSnapshot.name}\nQuantity ${request.quantity}\nEstimated total ₹${(request.totalPaise / 100).toLocaleString('en-IN')}\n${url}`;
  await Promise.all([
    notify({ key:`request:${request.requestId}:owner`, recipient:ownerEmail(), subject:`New purchase request ${request.requestId}`, message:description, link:url }),
    notify({ key:`request:${request.requestId}:customer`, recipient:customer.email, subject:'Purchase request received', message:`Your request ${request.requestId} was saved. The team will review availability. No payment is due until the owner approves it. Track your request in your account.`, link:`${site()}/account` }),
  ]);
}
export async function notifyRequestStatus(request, customer, event) {
  const reason = request.rejectionReason ? `\nReason: ${request.rejectionReason}` : '';
  const messages = {
    approved:`Your request ${request.requestId} was approved. Log in to see the payment due and the Pay Now option.`,
    rejected:`Your request ${request.requestId} was rejected.${reason}`,
    cancelled:`Your request ${request.requestId} was cancelled. Reserved stock, if any, has been released.`,
    completed:`Your request ${request.requestId} has been marked completed.`,
  };
  return notify({ key:`request:${request.requestId}:${event}`, recipient:customer.email, subject:`Request ${event}`, message:messages[event] || `Your request status changed: ${event}.`, link:`${site()}/account` });
}
export async function notifyLowStock(product, remaining) {
  const link = `${site()}/admin/products?product=${encodeURIComponent(product.sku)}`;
  return notify({ key:`low-stock:${product._id}:${product.lowStockCycle || 0}`, recipient:ownerEmail(), subject:`Low stock · ${product.name}`, message:`${product.name}\nSKU: ${product.sku}\nRemaining: ${remaining}\n${link}`, link });
}
export async function notifyPayment(payment, request, customer, success) {
  const demo = payment.mode === 'demo';
  const description = `${demo ? 'SIMULATED DEMO — NOT A REAL PAYMENT\n' : ''}Request ${request.requestId}\nAmount ₹${(payment.amountPaise / 100).toLocaleString('en-IN')}\nTransaction ${payment.gatewayPaymentId || payment._id}\n${success ? 'Payment recorded as successful.' : 'Payment attempt failed.'}`;
  const promises = [notify({ key:`payment:${payment._id}:customer:${success}`, recipient:customer.email, subject:success ? (demo ? 'Demo payment verified (simulated)' : 'Payment successful') : 'Payment attempt failed', message:description, link:`${site()}/account` })];
  if (success) promises.push(notify({ key:`payment:${payment._id}:owner:success`, recipient:ownerEmail(), subject:demo ? 'DEMO transaction (simulated)' : 'Successful real payment', message:description, link:`${site()}/admin/requests` }));
  return Promise.all(promises);
}
export async function notifyEnquiry(enquiry) {
  const description = `New website enquiry\n${enquiry.name} · ${enquiry.phone} · ${enquiry.email}\n${enquiry.vehicleType}\n${enquiry.requirement}\n${enquiry.message}`;
  return Promise.all([
    notify({ key:`enquiry:${enquiry._id}:owner`, recipient:ownerEmail(), subject:'New enquiry', message:description, link:`${site()}/admin/enquiries` }),
    notify({ key:`enquiry:${enquiry._id}:customer`, recipient:enquiry.email, subject:'Enquiry received', message:`Your enquiry has been saved under reference ${enquiry._id}. You can also open WhatsApp from the confirmation screen if you want to send a message directly.`, link:`${site()}/contact` }),
  ]);
}
