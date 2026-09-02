import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance
export const db = drizzle(pool);

// Your existing query function
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Pool bhi export karo
export default pool;