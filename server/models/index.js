import { users, userIndexes } from './UserModel.js';
import { sessions, sessionIndexes } from './SessionModel.js';
import { passwordResets, passwordResetIndexes } from './PasswordResetModel.js';
import { products, productIndexes } from './ProductModel.js';
import { purchaseRequests, purchaseRequestIndexes } from './PurchaseRequestModel.js';
import { payments, paymentIndexes } from './PaymentModel.js';
import { paymentWebhooks, paymentWebhookIndex } from './PaymentWebhookModel.js';
import { enquiries, enquiryIndex } from './EnquiryModel.js';
import { notificationLogs, notificationIndexes } from './NotificationModel.js';
import { auditLogs, auditIndex } from './AuditLogModel.js';
import { rateLimits, rateLimitIndexes } from './RateLimitModel.js';

// Exactly the pre-migration indexes: unique, partial and TTL options retained.
// Site content relies only on MongoDB's built-in _id index.
export async function ensureIndexes(db) {
  await Promise.all([
    users(db).createIndexes(userIndexes),
    sessions(db).createIndexes(sessionIndexes),
    passwordResets(db).createIndexes(passwordResetIndexes),
    products(db).createIndexes(productIndexes),
    purchaseRequests(db).createIndexes(purchaseRequestIndexes),
    payments(db).createIndexes(paymentIndexes),
    paymentWebhooks(db).createIndex(paymentWebhookIndex,{unique:true}),
    enquiries(db).createIndex(enquiryIndex),
    notificationLogs(db).createIndexes(notificationIndexes),
    auditLogs(db).createIndex(auditIndex),
    rateLimits(db).createIndexes(rateLimitIndexes),
  ]);
}
