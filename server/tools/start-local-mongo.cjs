/* Optional development-only MongoDB replica set. Never use memory-server as
 * production/durable hosting. Start this in a separate terminal when you
 * have no MongoDB replica set already available. Downloads can take time. */
const path = require('node:path');
const fs = require('node:fs');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const local = path.resolve(__dirname, '../.local');
const binaries = path.join(local,'mongo-binaries');
const data = path.join(local,'mongo-data');
fs.mkdirSync(binaries,{recursive:true});
fs.mkdirSync(data,{recursive:true});
(async () => {
  const replSet = await MongoMemoryReplSet.create({
    binary: { version:'7.0.18', downloadDir:binaries },
    instanceOpts: [{ port:Number(process.env.MONGO_PORT || 27017), dbPath:data }],
    replSet: { count:1, name:'jmrs', storageEngine:'wiredTiger' },
  });
  console.log('Local MongoDB replica set ready: '+replSet.getUri('jmtyres'));
  const end = async () => { await replSet.stop(); process.exit(0); };
  process.once('SIGTERM', end); process.once('SIGINT', end);
})().catch(error => { console.error(error); process.exit(1); });
