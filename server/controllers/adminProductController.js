import { getDb, objectId } from '../config/db.js';
import { products, productSchema } from '../models/ProductModel.js';
import { purchaseRequests } from '../models/PurchaseRequestModel.js';
import { auditLogs } from '../models/AuditLogModel.js';
import { publicProduct, getProduct, formatSize } from '../services/catalogService.js';
import { updateStock } from '../services/commerceService.js';
import { ApiError, escapeRegex, parse, safeInt } from '../utils/validation.js';
import { searchParams, send } from '../utils/http.js';

export async function list(req,res) {
  const q=searchParams(req);
  const filter={};const term=String(q.get('q') || '').trim().slice(0,70);
  if (term) filter.$or=[{name:{$regex:escapeRegex(term),$options:'i'}},{sku:{$regex:escapeRegex(term),$options:'i'}}];
  if (q.get('status')==='active') filter.active=true;
  if (q.get('status')==='inactive') filter.active=false;
  const page=safeInt(q.get('page'),1,1,10000);
  const limit=safeInt(q.get('limit'),15,1,50);
  const db=await getDb();
  const [docs,total]=await Promise.all([
    products(db).find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).toArray(),
    products(db).countDocuments(filter),
  ]);
  send(res,{items:docs.map(publicProduct),total,page,pages:Math.ceil(total/limit)});
}
export async function create(req,res) {
  const data=parse(productSchema,req.body);
  const db=await getDb();const timestamp=new Date();
  const slug=`${data.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,78)}-${data.sku.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
  const product={...data,slug,tyre:{...data.tyre,size:formatSize(data.tyre)},lowStockAlerted:data.stockQty<5 && data.stockQty>0,lowStockCycle:0,createdAt:timestamp,updatedAt:timestamp};
  product._id=(await products(db).insertOne(product)).insertedId;
  await auditLogs(db).insertOne({type:'create_product',actorId:req.actor._id,productId:product._id,createdAt:timestamp});
  send(res,{product:publicProduct(product)},201);
}
export async function detail(req,res) {send(res,{product:await getProduct(req.params.id,true)});}
export async function stock(req,res) {send(res,await updateStock(req.params.id,req.actor,req.body.stockQty));}
export async function update(req,res) {
  const id=objectId(req.params.id);if(!id)throw new ApiError(400,'Invalid product ID.');
  const db=await getDb();
  const old=await products(db).findOne({_id:id});if(!old)throw new ApiError(404,'Product not found.');
  const data=parse(productSchema,req.body);
  const {stockQty,...fields}=data;
  await products(db).updateOne({_id:id},{$set:{...fields,tyre:{...fields.tyre,size:formatSize(fields.tyre)},updatedAt:new Date()}});
  if (stockQty!==old.stockQty) await updateStock(req.params.id,req.actor,stockQty);
  await auditLogs(db).insertOne({type:'edit_product',actorId:req.actor._id,productId:id,createdAt:new Date()});
  send(res,{product:await getProduct(req.params.id,true)});
}
export async function remove(req,res) {
  const id=objectId(req.params.id);if(!id)throw new ApiError(400,'Invalid product ID.');
  const db=await getDb();
  const refs=await purchaseRequests(db).countDocuments({productId:id});
  const result=refs ? await products(db).updateOne({_id:id},{$set:{active:false,deletedAt:new Date()}}) : await products(db).deleteOne({_id:id});
  if(!result.matchedCount && !result.deletedCount)throw new ApiError(404,'Product not found.');
  await auditLogs(db).insertOne({type:refs?'archive_product':'delete_product',actorId:req.actor._id,productId:id,createdAt:new Date()});
  send(res,{deleted:true,archived:!!refs});
}
