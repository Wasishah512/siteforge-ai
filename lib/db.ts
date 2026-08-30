import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Query function export karo
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Pool bhi export karo
export default pool;