/* One-time admin bootstrap / explicit reset; no default admin credentials are shipped. */
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
(async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = (process.env.ADMIN_NAME || 'J.M. Tyres Owner').trim();
  const phone = (process.env.ADMIN_PHONE || '918336819093').trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || Buffer.byteLength(password,'utf8') > 72) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12–72 UTF-8 bytes) as environment variables.');
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jmtyres?replicaSet=jmrs');
  try {
    await client.connect(); const db = client.db(process.env.MONGODB_DB || 'jmtyres');
    await db.collection('users').createIndex({email:1},{unique:true});
    const old = await db.collection('users').findOne({email});
    if (old) {
      if (old.role !== 'admin') throw new Error('This email belongs to a customer. Choose another admin email.');
      console.log(`Admin ${email} already exists; no changes made.`);
      return;
    }
    const passwordHash = await bcrypt.hash(password,12);
    await db.collection('users').insertOne({name,email,phone,passwordHash,role:'admin',accountStatus:'active',createdAt:new Date(),updatedAt:new Date()});
    console.log(`Created admin ${email}. Password was not printed. Never use development credentials in production.`);
  } finally { await client.close(); }
})().catch(error=>{console.error(error.message);process.exit(1);});
