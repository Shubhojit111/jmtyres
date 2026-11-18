/** requestId/customerId refer to BSON _ids; unique pending attempt and gateway IDs. */
export const payments = db => db.collection('payments');
export const paymentIndexes = [
  {key:{requestId:1,status:1},unique:true,partialFilterExpression:{status:'pending'}},
  {key:{gatewayOrderId:1},unique:true,partialFilterExpression:{gatewayOrderId:{$type:'string'}}},
  {key:{gatewayPaymentId:1},unique:true,partialFilterExpression:{gatewayPaymentId:{$type:'string'}}},
  {key:{requestId:1,createdAt:-1}},
];
