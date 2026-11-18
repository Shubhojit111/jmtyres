import { listProducts, getProduct, categories, brands, findTyres, vehicleOptions } from '../services/catalogService.js';
import { searchParams, send } from '../utils/http.js';

export async function list(req,res) {send(res,await listProducts(searchParams(req)));}
export async function detail(req,res) {send(res,{product:await getProduct(req.params.idOrSlug)});}
export async function listCategories(_req,res) {send(res,{items:await categories()});}
export async function listBrands(_req,res) {send(res,{items:await brands()});}
export async function searchTyres(req,res) {send(res,await findTyres(req.body));}
export async function listVehicles(_req,res) {send(res,{items:await vehicleOptions()});}
