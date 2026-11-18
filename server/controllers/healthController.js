import { getDb } from '../config/db.js';
import { paymentConfig } from '../config/razorpay.js';
import { notificationMode } from '../config/email.js';
import { storageMode } from '../config/storage.js';
import { send } from '../utils/http.js';

export async function health(_req,res) {
  const db=await getDb();
  await db.command({ping:1});
  send(res,{ok:true,database:'connected',payments:paymentConfig(),notifications:notificationMode(),images:storageMode()});
}
