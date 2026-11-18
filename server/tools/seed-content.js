import 'dotenv/config';
import { connectDatabase, closeDatabase } from '../config/db.js';
import { defaultHome } from '../models/SiteContentModel.js';

async function seedContent() {
  const db = await connectDatabase();
  const setOnInsert = Object.assign({ _id: 'home', updatedAt: new Date() }, defaultHome);
  await db.collection('site_content').updateOne(
    { _id: 'home' },
    { $setOnInsert: setOnInsert },
    { upsert: true }
  );
  const doc = await db.collection('site_content').findOne({ _id: 'home' });
  console.log('Seeded site_content successfully in Compass DB:', doc);
  await closeDatabase();
}

seedContent().catch(console.error);
