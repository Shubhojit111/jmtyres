import { randomUUID } from 'crypto';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getDb } from '../config/db.js';
import { ApiError } from '../utils/validation.js';

import { localUploads, r2Configured, r2Client, storageMode } from '../config/storage.js';
import { env } from '../config/env.js';
import { auditLogs } from '../models/AuditLogModel.js';
import { products } from '../models/ProductModel.js';
export { storageMode };
export async function uploadImage(file, actor) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new ApiError(400,'Select an image file.');
  if (file.size === 0 || file.size > 5 * 1024 * 1024) throw new ApiError(400,'Image must be smaller than 5 MB.');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new ApiError(400,'Upload a JPEG, PNG or WebP image.');
  const raw = Buffer.from(await file.arrayBuffer());
  let metadata, image;
  try {
    metadata = await sharp(raw,{limitInputPixels:36e6,failOn:'error'}).metadata();
    if (!['jpeg','png','webp'].includes(metadata.format) || metadata.pages > 1) throw new Error('Unsupported image format.');
    image = await sharp(raw,{limitInputPixels:36e6}).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
  } catch { throw new ApiError(400,'The file is not a supported, valid still image.'); }
  const key = `products/${randomUUID()}.webp`;
  let url;
  if (r2Configured()) {
    await r2Client().send(new PutObjectCommand({ Bucket:env.r2.bucket, Key:key, Body:image, ContentType:'image/webp', CacheControl:'public, max-age=31536000, immutable' }));
    url = `${env.r2.publicBaseUrl.replace(/\/$/,'')}/${key}`;
  } else {
    if (env.production) throw new ApiError(503,'Cloudflare R2 storage must be configured for production image uploads.');
    const folder = join(localUploads,'products'); await mkdir(folder,{recursive:true});
    await writeFile(join(folder,key.split('/')[1]),image,{flag:'wx'});
    url = `/uploads/${key}`;
  }
  const db = await getDb();
  await auditLogs(db).insertOne({type:'upload_image',actorId:actor._id,url,bytes:image.length,createdAt:new Date()});
  return {url,bytes:image.length,width:metadata.width,height:metadata.height,storage:storageMode()};
}
export async function deleteImage(url, actor) {
  if (typeof url !== 'string' || url.length > 1000) throw new ApiError(400,'Invalid image URL.');
  const db = await getDb();
  if (await products(db).findOne({'images.url':url})) throw new ApiError(409,'Remove the image from all products before deleting it from storage.');
  if (url.startsWith('/uploads/products/')) {
    if (!/^\/uploads\/products\/[a-f0-9-]{36}\.webp$/.test(url)) throw new ApiError(400,'Invalid local image path.');
    try { await unlink(join(localUploads,url.slice('/uploads/'.length))); } catch(error) { if (error.code !== 'ENOENT') throw error; }
  } else if (r2Configured() && url.startsWith(`${env.r2.publicBaseUrl.replace(/\/$/,'')}/products/`)) {
    const key = url.slice(env.r2.publicBaseUrl.replace(/\/$/,'').length + 1);
    if (!/^products\/[a-f0-9-]{36}\.webp$/.test(key)) throw new ApiError(400,'Invalid storage key.');
    await r2Client().send(new DeleteObjectCommand({Bucket:env.r2.bucket,Key:key}));
  } else throw new ApiError(400,'Only uploaded product images may be deleted.');
  await auditLogs(db).insertOne({type:'delete_image',actorId:actor._id,url,createdAt:new Date()});
  return {deleted:true};
}
