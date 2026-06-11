import oracledb, { type Pool, type Connection } from 'oracledb';
import { env } from './env';

let pool: Pool | null = null;

export async function initPool(): Promise<void> {
  if (pool) return;

  pool = await oracledb.createPool({
    user: env.ORACLE_USER,
    password: env.ORACLE_PASSWORD,
    connectString: env.ORACLE_CONNECT_STR,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 2,
  });
}

export async function getConnection(): Promise<Connection> {
  if (!pool) {
    throw new Error('Oracle connection pool is not initialized');
  }
  return pool.getConnection();
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close(0);
    pool = null;
  }
}
