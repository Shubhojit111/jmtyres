import { getHomeContent, updateHomeContent } from '../services/contentService.js';
import { send } from '../utils/http.js';

export async function home(_req,res) {send(res,{content:await getHomeContent()});}
export async function updateHome(req,res) {send(res,{content:await updateHomeContent(req.body,req.actor)});}
