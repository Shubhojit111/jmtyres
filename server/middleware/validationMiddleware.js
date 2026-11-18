import express from 'express';
import { ApiError } from '../utils/validation.js';

const parseJson = express.json({limit:'32kb',strict:false,verify(req,_res,raw){req.jsonBytes=raw.length;}});
export function jsonBody(req,res,next) {
  if (!req.get('content-type')?.includes('application/json'))
    return next(new ApiError(415,'Send JSON with Content-Type: application/json.'));
  parseJson(req,res,error=>{
    if (error?.type==='entity.too.large') return next(new ApiError(413,'Request body is too large.'));
    if (error) return next(new ApiError(400,'Malformed JSON request.'));
    if (!req.jsonBytes) return next(new ApiError(400,'Malformed JSON request.'));
    next();
  });
}
