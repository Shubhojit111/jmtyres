import { getDb, objectId } from '../config/db.js';
import { users } from '../models/UserModel.js';
import { purchaseRequests } from '../models/PurchaseRequestModel.js';
import { publicUser } from '../services/authService.js';
import { ApiError, safeInt } from '../utils/validation.js';
import { searchParams, send } from '../utils/http.js';

export async function list(req,res) {
  const page=safeInt(searchParams(req).get('page'),1,1,10000);
  const db=await getDb();
  const [docs,total]=await Promise.all([
    users(db).find({role:'customer'},{projection:{passwordHash:0}}).sort({createdAt:-1}).skip((page-1)*20).limit(20).toArray(),
    users(db).countDocuments({role:'customer'}),
  ]);
  send(res,{items:docs.map(publicUser),total,page,pages:Math.ceil(total/20)});
}
export async function detail(req,res) {
  const db=await getDb();
  const user=await users(db).findOne({_id:objectId(req.params.id),role:'customer'},{projection:{passwordHash:0}});
  if (!user) throw new ApiError(404,'Customer not found.');
  const requests=await purchaseRequests(db).find({customerId:user._id}).sort({createdAt:-1}).limit(25).toArray();
  send(res,{user:publicUser(user),requests:requests.map(r=>({requestId:r.requestId,status:r.status,totalPaise:r.totalPaise,createdAt:r.createdAt}))});
}
