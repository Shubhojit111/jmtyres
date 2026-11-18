import express from 'express';
import { ApiError } from '../utils/validation.js';
import { asyncRoute } from '../utils/http.js';

const rawMultipart = express.raw({type:()=>true,limit:'6mb'});
export function multipartBody(req,res,next) {
  rawMultipart(req,res,error=>{
    if (error?.type==='entity.too.large') return next(new ApiError(413,'Request body is too large.'));
    if (error) return next(new ApiError(400,'Invalid multipart image upload.'));
    next();
  });
}
export const parseUpload = asyncRoute(async(req,_res,next)=>{
  try {
    const request=new Request('http://localhost/upload',{
      method:'POST',headers:{'content-type':req.get('content-type') || ''},
      body:req.body || Buffer.alloc(0),duplex:'half',
    });
    const form=await request.formData();
    req.imageFile=form.get('file');
    next();
  } catch {throw new ApiError(400,'Invalid multipart image upload.');}
});
export const webhookBody=express.raw({type:()=>true,limit:'128kb'});
