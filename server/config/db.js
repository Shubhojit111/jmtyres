import { MongoClient, ObjectId } from 'mongodb';
import { env, validateEnvironment } from './env.js';
import { ensureIndexes } from '../models/index.js';

let client;
let connecting;
let indexing;
let replicaSetSupported = null;

async function checkReplicaSet(mongo) {
  if (replicaSetSupported !== null) return replicaSetSupported;
  try {
    const admin = mongo.db('admin');
    const status = await admin.command({ replSetGetStatus: 1 });
    replicaSetSupported = Boolean(status?.ok);
  } catch {
    replicaSetSupported = false;
  }
  return replicaSetSupported;
}

export function mongoClient() {
  if (!client) {
    validateEnvironment();
    client = new MongoClient(env.mongoUri,{serverSelectionTimeoutMS:6000,maxPoolSize:12,retryWrites:true});
  }
  return client;
}
export async function getDb() {
  const mongo = mongoClient();
  if (!connecting) connecting = mongo.connect().catch(error => {connecting=null;throw error;});
  await connecting;
  const db = mongo.db(env.mongoDb);
  if (!indexing) indexing = ensureIndexes(db).catch(error => {indexing=null;throw error;});
  await indexing;
  return db;
}
export async function connectDatabase() {
  const db = await getDb();
  await db.command({ping:1});
  await checkReplicaSet(mongoClient());
  return db;
}
export async function closeDatabase() {
  if (client) await client.close();
  client=null;connecting=null;indexing=null;replicaSetSupported=null;
}
export function isReplicaSet() {
  return Boolean(replicaSetSupported);
}
export function objectId(value) {
  return typeof value === 'string' && ObjectId.isValid(value) && new ObjectId(value).toHexString() === value.toLowerCase() ? new ObjectId(value) : null;
}
export function serialize(value) {
  return JSON.parse(JSON.stringify(value,(_key,item) => item instanceof ObjectId ? item.toHexString() : item));
}
export async function withTransaction(task) {
  await getDb();
  const mongo = mongoClient();
  const hasReplicaSet = await checkReplicaSet(mongo);

  if (!hasReplicaSet) {
    // Standalone MongoDB (e.g. standard local Compass instance). Execute task with undefined session.
    return task(undefined);
  }

  for (let retry=0;retry<4;retry++) {
    const session=mongo.startSession();
    try {
      let result;
      await session.withTransaction(async()=>{result=await task(session);},{readConcern:{level:'snapshot'},writeConcern:{w:'majority'}});
      return result;
    } catch(error) {
      if ((error.hasErrorLabel?.('TransientTransactionError') || error.code===112) && retry<3) continue;
      throw error;
    } finally {await session.endSession();}
  }
}
