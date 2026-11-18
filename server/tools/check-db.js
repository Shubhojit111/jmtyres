import 'dotenv/config';
import { connectDatabase, closeDatabase, isReplicaSet } from '../config/db.js';
import { env } from '../config/env.js';

async function main() {
  console.log('Connecting to MongoDB database:', env.mongoDb);
  console.log('Target Database:', env.mongoDb);

  try {
    const db = await connectDatabase();
    console.log('Connection successful!');
    console.log('Replica Set Active:', isReplicaSet() ? 'YES' : 'NO (Standalone mode - local Compass compatible)');

    const collections = await db.listCollections().toArray();
    console.log('\nCollections verified in database:');
    collections.forEach(col => console.log(' - ' + col.name));

    console.log('\nAll indexes and collections initialized successfully.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

main();
