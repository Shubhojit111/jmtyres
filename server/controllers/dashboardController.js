import { getDb } from '../config/db.js';
import { products } from '../models/ProductModel.js';
import { users } from '../models/UserModel.js';
import { purchaseRequests } from '../models/PurchaseRequestModel.js';
import { payments } from '../models/PaymentModel.js';
import { publicProduct } from '../services/catalogService.js';
import { send } from '../utils/http.js';

export async function dashboard(_req,res) {
  const db=await getDb();
  const product=products(db),request=purchaseRequests(db),payment=payments(db);
  const [totalProducts,totalCustomers,totalRequests,pending,approved,paid,rejected,lowStock,outOfStock,recentRequests,recentTransactions,aggregate]=await Promise.all([
    product.countDocuments({active:true}),users(db).countDocuments({role:'customer'}),request.countDocuments(),
    request.countDocuments({status:'pending'}),request.countDocuments({status:'awaiting_payment'}),
    request.countDocuments({status:{$in:['paid','completed']}}),request.countDocuments({status:'rejected'}),
    product.find({active:true,stockQty:{$gt:0,$lt:5}}).sort({stockQty:1}).limit(8).toArray(),
    product.countDocuments({active:true,stockQty:0}),
    request.find().sort({createdAt:-1}).limit(6).toArray(),
    payment.find().sort({createdAt:-1}).limit(6).toArray(),
    payment.aggregate([{$match:{status:'successful',mode:'live'}},{$group:{_id:null,totalPaise:{$sum:'$amountPaise'},count:{$sum:1}}}]).toArray(),
  ]);
  send(res,{
    totalProducts,totalCustomers,totalRequests,pending,approved,paid,rejected,outOfStock,
    lowStock:lowStock.map(publicProduct),realSuccessfulPayments:aggregate[0] || {totalPaise:0,count:0},
    recentRequests:recentRequests.map(r=>({requestId:r.requestId,name:r.customerSnapshot.name,product:r.productSnapshot.name,status:r.status,totalPaise:r.totalPaise,createdAt:r.createdAt})),
    recentTransactions:recentTransactions.map(r=>({id:String(r._id),status:r.status,mode:r.mode,amountPaise:r.amountPaise,createdAt:r.createdAt})),
  });
}
