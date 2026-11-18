/** Signed Razorpay event receipts are deduplicated by eventId. */
export const paymentWebhooks = db => db.collection('payment_webhooks');
export const paymentWebhookIndex = {eventId:1};
