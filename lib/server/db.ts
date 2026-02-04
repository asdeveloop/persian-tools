import { Pool, type QueryResult } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env['DATABASE_URL'];
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function query<T>(
  text: string,
  params: Array<string | number | null> = [],
): Promise<QueryResult<T>> {
  const client = getPool();
  return client.query<T>(text, params);
}

export async function withTransaction<T>(fn: (queryFn: typeof query) => Promise<T>): Promise<T> {
  const client = getPool();
  const connection = await client.connect();
  try {
    await connection.query('BEGIN');
    const result = await fn((text, params) => connection.query(text, params));
    await connection.query('COMMIT');
    return result;
  } catch (error) {
    await connection.query('ROLLBACK');
    throw error;
  } finally {
    connection.release();
  }
}
