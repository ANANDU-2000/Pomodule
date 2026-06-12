import oracledb, { type Pool, type Connection } from 'oracledb';
import { env, buildConnectString } from './env';
import { logger } from '../utils/logger';

let pool: Pool | null = null;

export async function initPool(): Promise<void> {
  if (pool) return;

  const connectString = buildConnectString();

  pool = await oracledb.createPool({
    user: env.ORACLE_USER,
    password: env.ORACLE_PASSWORD,
    connectString,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 2,
  });

  logger.info('Oracle connection pool initialized', {
    host: env.ORACLE_HOST,
    port: env.ORACLE_PORT,
    service: env.ORACLE_SERVICE,
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
    logger.info('Oracle connection pool closed');
  }
}

export async function pingPool(): Promise<boolean> {
  let conn: Connection | undefined;
  try {
    conn = await getConnection();
    await conn.execute('SELECT 1 FROM DUAL');
    return true;
  } catch (err) {
    logger.warn('Oracle pool ping failed', {
      message: err instanceof Error ? err.message : String(err),
    });
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}
