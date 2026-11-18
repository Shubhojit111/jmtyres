/* Startup and lifecycle only; app.js may also be imported without listening. */
import 'dotenv/config';
import app from './app.js';
import { env, validateEnvironment } from './config/env.js';
import { connectDatabase, closeDatabase } from './config/db.js';

let server;
try {
  validateEnvironment();
  await connectDatabase(); // fail fast if MongoDB/index initialization is unavailable
  server=await new Promise((resolve,reject)=>{
    const listening=app.listen(env.port,'0.0.0.0',()=>resolve(listening));
    listening.once('error',reject);
  });
  console.log(`J.M. Tyres Express API listening on 0.0.0.0:${env.port}`);
} catch(error) {
  console.error('Backend startup failed:',error);
  await closeDatabase().catch(()=>{});
  process.exitCode=1;
}

let shuttingDown=false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown=true;
  try {
    if (server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    await closeDatabase();
    console.log(`J.M. Tyres API stopped after ${signal}.`);
  } catch(error) {
    console.error('Backend shutdown failed:',error);
    process.exitCode=1;
  }
}
process.once('SIGTERM',()=>void shutdown('SIGTERM'));
process.once('SIGINT',()=>void shutdown('SIGINT'));
