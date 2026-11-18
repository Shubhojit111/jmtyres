import { products, finderSchema } from '../models/ProductModel.js';
import { getDb, objectId } from '../config/db.js';
import { ApiError, escapeRegex, parse, safeInt } from '../utils/validation.js';

export const formatSize = tyre => `${tyre.width}/${tyre.aspectRatio} R${tyre.rimDiameter}`;
export function publicProduct(p) {
  return { id:String(p._id), slug:p.slug, sku:p.sku, name:p.name, brand:p.brand, category:p.category,
    description:p.description, images:p.images || [], pricePaise:p.pricePaise, stockQty:p.stockQty, stockStatus:p.stockQty === 0 ? 'Out of Stock' : 'Available',
    tyre:p.tyre, compatibility:p.compatibility || [], active:p.active, isDemo:!!p.isDemo, featured:!!p.featured, createdAt:p.createdAt, updatedAt:p.updatedAt };
}
export async function listProducts(query) {
  const db = await getDb();
  const filter = { active:true };
  const q = String(query.get('q') || '').trim().slice(0,80);
  if (q) {
    const term = escapeRegex(q);
    filter.$or = [{ name:{ $regex:term, $options:'i' } }, { brand:{ $regex:term, $options:'i' } }, { sku:{ $regex:term, $options:'i' } }, { 'tyre.size':{ $regex:term, $options:'i' } }];
  }
  if (query.get('brand')) filter.brand = { $regex:`^${escapeRegex(query.get('brand').slice(0,60))}$`, $options:'i' };
  if (query.get('category')) filter.category = { $regex:`^${escapeRegex(query.get('category').slice(0,60))}$`, $options:'i' };
  if (query.get('size')) {
    const match = String(query.get('size')).trim().match(/^(\d{2,3})\s*\/\s*(\d{2})\s*[- ]?\s*R?\s*(\d{2})$/i);
    if (!match) throw new ApiError(400,'Use a tyre size such as 205/55 R16.');
    Object.assign(filter, { 'tyre.width':Number(match[1]), 'tyre.aspectRatio':Number(match[2]), 'tyre.rimDiameter':Number(match[3]) });
  }
  const min = query.get('minPrice') ? Number(query.get('minPrice')) : null;
  const max = query.get('maxPrice') ? Number(query.get('maxPrice')) : null;
  if ((min !== null && (!Number.isFinite(min) || min < 0)) || (max !== null && (!Number.isFinite(max) || max < 0))) throw new ApiError(400,'Enter valid price limits.');
  if (min !== null || max !== null) filter.pricePaise = { ...(min !== null ? { $gte:Math.round(min*100) } : {}), ...(max !== null ? { $lte:Math.round(max*100) } : {}) };
  if (query.get('availability') === 'available') filter.stockQty = { $gt:0 };
  if (query.get('availability') === 'out') filter.stockQty = 0;
  if (query.get('featured') === 'true') filter.featured = true;
  const page = safeInt(query.get('page'),1,1,10000);
  const limit = safeInt(query.get('limit'),12,1,48);
  const sort = ({ newest:{createdAt:-1}, oldest:{createdAt:1}, price_asc:{pricePaise:1,_id:1}, price_desc:{pricePaise:-1,_id:1}, name:{name:1,_id:1} })[query.get('sort')] || { createdAt:-1, _id:-1 };
  const [items,total] = await Promise.all([products(db).find(filter).sort(sort).skip((page-1)*limit).limit(limit).toArray(),products(db).countDocuments(filter)]);
  return { items:items.map(publicProduct), total, page, pages:Math.ceil(total/limit), limit };
}
export async function getProduct(idOrSlug, admin = false) {
  const db = await getDb();
  const id = objectId(idOrSlug);
  const filter = { ...(id ? { _id:id } : { slug:String(idOrSlug).slice(0,120) }), ...(!admin ? { active:true } : {}) };
  const p = await products(db).findOne(filter);
  if (!p) throw new ApiError(404,'Product not found.','NOT_FOUND');
  return publicProduct(p);
}
export async function categories() {
  const db = await getDb();
  return products(db).aggregate([{ $match:{ active:true } }, { $sort:{ createdAt:-1 } }, { $group:{ _id:'$category', count:{$sum:1}, image:{$first:{$arrayElemAt:['$images.url',0]}} } }, { $sort:{ _id:1 } }, { $project:{ _id:0, name:'$_id', count:1, image:1 } }]).toArray();
}
export async function brands() {
  const db = await getDb();
  return products(db).aggregate([{ $match:{ active:true } },{ $group:{ _id:'$brand', count:{$sum:1}, demoCount:{$sum:{$cond:[{$eq:['$isDemo',true]},1,0]}} } },{$sort:{ _id:1 }},{$project:{_id:0,name:'$_id',count:1,demoCount:1}}]).toArray();
}
export async function findTyres(input) {
  const query = parse(finderSchema,input);
  const filter = { active:true };
  if (query.brand) filter.brand = { $regex:`^${escapeRegex(query.brand)}$`, $options:'i' };
  if (query.method === 'size') {
    if (!query.width || !query.aspectRatio || !query.rimDiameter) throw new ApiError(400,'Width, aspect ratio and rim diameter are all required.');
    Object.assign(filter, { 'tyre.width':query.width, 'tyre.aspectRatio':query.aspectRatio, 'tyre.rimDiameter':query.rimDiameter });
  } else {
    if (!query.vehicleType || !query.make || !query.model) throw new ApiError(400,'Select a vehicle type, make and model from verified options.');
    const match = { vehicleType:query.vehicleType,
      make:{ $regex:`^${escapeRegex(query.make)}$`, $options:'i' }, model:{ $regex:`^${escapeRegex(query.model)}$`, $options:'i' },
      variant:query.variant ? { $in:[{ $regex:`^${escapeRegex(query.variant)}$`, $options:'i' },''] } : '',
      ...(query.year ? { $and:[{ $or:[{ yearFrom:null },{ yearFrom:{ $lte:query.year } }] },{ $or:[{ yearTo:null },{ yearTo:{ $gte:query.year } }] }] } : { yearFrom:null,yearTo:null }),
    };
    filter.compatibility = { $elemMatch:match };
  }
  const db = await getDb();
  const items = await products(db).find(filter).sort({ stockQty:-1,pricePaise:1 }).limit(48).toArray();
  return { items:items.map(publicProduct), total:items.length, method:query.method, verifiedFitment:query.method === 'vehicle' && items.length > 0, alternatives:[] };
}
export async function vehicleOptions() {
  const db = await getDb();
  return products(db).aggregate([{ $match:{ active:true, 'compatibility.0':{ $exists:true } } },{ $unwind:'$compatibility' },{ $group:{ _id:{vehicleType:'$compatibility.vehicleType',make:'$compatibility.make',model:'$compatibility.model',variant:'$compatibility.variant'}, yearFrom:{$min:'$compatibility.yearFrom'},yearTo:{$max:'$compatibility.yearTo'} } },{ $project:{_id:0,vehicleType:'$_id.vehicleType',make:'$_id.make',model:'$_id.model',variant:'$_id.variant',yearFrom:1,yearTo:1} },{ $sort:{vehicleType:1,make:1,model:1,variant:1} }]).toArray();
}
