import pg from 'pg';
const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // During build time on Vercel, DATABASE_URL might not be present.
  // We should not throw an error during build time, only when running queries.
  console.warn("Warning: DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export { pool };
