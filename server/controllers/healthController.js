import { getDb, isReplicaSet } from '../config/db.js';
import { paymentConfig } from '../config/razorpay.js';
import { notificationMode } from '../config/email.js';
import { storageMode } from '../config/storage.js';
import { send } from '../utils/http.js';

export async function health(_req,res) {
  const start = Date.now();
  const db=await getDb();
  await db.command({ping:1});
  const dbLatencyMs = Date.now() - start;

  send(res,{
    ok:true,
    status:'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    database:{
      status:'connected',
      latencyMs: dbLatencyMs,
      replicaSet: isReplicaSet(),
      mode: isReplicaSet() ? 'replica_set' : 'standalone'
    },
    payments:paymentConfig(),
    notifications:notificationMode(),
    images:storageMode(),
    memory: {
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024)
    }
  });
}
