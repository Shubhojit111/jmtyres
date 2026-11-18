/* Explicit opt-in: 16 fictional examples for testing, never genuine stock. */
import 'dotenv/config';
import { seedDemoProducts } from '../services/demoSeedService.js';
import { closeDatabase } from '../config/db.js';
try {
  const result = await seedDemoProducts();
  console.log(result);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
