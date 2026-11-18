import { z } from 'zod';
import { text, cleanOptional } from '../utils/validation.js';

/** Native collection; preserve slug/SKU uniqueness and existing tyre/fitment BSON. */
export const products = db => db.collection('products');
export const productIndexes = [
  {key:{slug:1},unique:true},{key:{sku:1},unique:true},
  {key:{active:1,createdAt:-1}},{key:{active:1,brand:1,category:1}},
  {key:{'tyre.width':1,'tyre.aspectRatio':1,'tyre.rimDiameter':1}},
  {key:{'compatibility.vehicleType':1,'compatibility.make':1,'compatibility.model':1}},
];
const tyre = z.object({
  width:z.coerce.number().int().min(60).max(450),
  aspectRatio:z.coerce.number().int().min(20).max(100),
  rimDiameter:z.coerce.number().int().min(8).max(30),
  loadIndex:cleanOptional(12),speedRating:cleanOptional(12),type:text(50),
});
const compatibility = z.object({
  vehicleType:z.enum(['Car / SUV','Bike / scooter','Commercial']),
  make:text(60),model:text(70),variant:cleanOptional(70),
  yearFrom:z.coerce.number().int().min(1950).max(2100).nullable().optional().default(null),
  yearTo:z.coerce.number().int().min(1950).max(2100).nullable().optional().default(null),
}).refine(value => !value.yearFrom || !value.yearTo || value.yearTo >= value.yearFrom,{message:'Year range is invalid.'});
const image = z.object({
  url:z.string().max(1000).refine(value => value.startsWith('/uploads/') || value.startsWith('/demo/') || /^https:\/\//.test(value),'Use an uploaded HTTPS or demo image.'),
  alt:cleanOptional(150),
});
export const productSchema = z.object({
  name:text(120),sku:z.string().trim().min(2).max(64).regex(/^[a-zA-Z0-9._-]+$/),
  brand:text(60),category:text(60),description:text(3500),
  pricePaise:z.coerce.number().int().min(100).max(200000000),
  stockQty:z.coerce.number().int().min(0).max(100000),
  images:z.array(image).max(8).default([]),tyre,
  compatibility:z.array(compatibility).max(150).default([]),
  active:z.boolean().default(true),isDemo:z.boolean().default(false),featured:z.boolean().default(false),
}).strict();
export const finderSchema = z.object({
  method:z.enum(['size','vehicle']),
  width:z.coerce.number().int().min(60).max(450).optional(),
  aspectRatio:z.coerce.number().int().min(20).max(100).optional(),
  rimDiameter:z.coerce.number().int().min(8).max(30).optional(),
  vehicleType:z.enum(['Car / SUV','Bike / scooter','Commercial']).optional(),
  make:z.string().trim().max(60).optional(),model:z.string().trim().max(70).optional(),
  variant:z.string().trim().max(70).optional(),year:z.coerce.number().int().min(1950).max(2100).optional(),
  brand:z.string().trim().max(60).optional(),
});
