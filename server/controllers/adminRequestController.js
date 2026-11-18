import { listRequests, getRequest, approveRequest, rejectRequest, cancelRequest, completeRequest } from '../services/commerceService.js';
import { searchParams, send } from '../utils/http.js';

export async function list(req,res) {send(res,await listRequests(req.actor,searchParams(req),true));}
export async function detail(req,res) {send(res,{request:await getRequest(req.params.idOrCode,req.actor,true)});}
export async function approve(req,res) {send(res,{request:await approveRequest(req.params.code,req.actor,req.body)});}
export async function reject(req,res) {send(res,{request:await rejectRequest(req.params.code,req.actor,req.body.reason)});}
export async function cancel(req,res) {send(res,{request:await cancelRequest(req.params.code,req.actor,req.body.reason)});}
export async function complete(req,res) {send(res,{request:await completeRequest(req.params.code,req.actor,req.body)});}
