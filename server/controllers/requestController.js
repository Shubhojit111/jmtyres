import { createPurchaseRequest, listRequests, getRequest } from '../services/commerceService.js';
import { startPayment } from '../services/paymentService.js';
import { searchParams, send } from '../utils/http.js';

export async function listMine(req,res) {send(res,await listRequests(req.actor,searchParams(req)));}
export async function create(req,res) {send(res,{request:await createPurchaseRequest(req.actor,req.body)},201);}
export async function detail(req,res) {send(res,{request:await getRequest(req.params.idOrCode,req.actor)});}
export async function payment(req,res) {send(res,{payment:await startPayment(req.params.idOrCode,req.actor)});}
