import { z } from 'zod';
import { cleanOptional, phone } from '../utils/validation.js';

/** customerId/productId reference BSON _ids; snapshots are immutable at request. */
export const purchaseRequests = db => db.collection('purchase_requests');
export const purchaseRequestIndexes = [
  {key:{requestId:1},unique:true},{key:{customerId:1,createdAt:-1}},
  {key:{status:1,createdAt:-1}},{key:{productId:1}},
];
export const requestSchema = z.object({
  productId:z.string().min(12).max(40),quantity:z.coerce.number().int().min(1).max(20),
  fulfillment:z.enum(['pickup','delivery']),message:cleanOptional(1500),phone,
});
export const approvalSchema = z.discriminatedUnion('paymentType',[
  z.object({paymentType:z.literal('full')}),
  z.object({paymentType:z.literal('advance'),advancePaise:z.coerce.number().int().positive().max(200000000)}),
]);
