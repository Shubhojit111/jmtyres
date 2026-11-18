import { uploadImage, deleteImage } from '../services/storageService.js';
import { searchParams, send } from '../utils/http.js';

export async function upload(req,res) {send(res,await uploadImage(req.imageFile,req.actor),201);}
export async function remove(req,res) {send(res,await deleteImage(searchParams(req).get('url'),req.actor));}
