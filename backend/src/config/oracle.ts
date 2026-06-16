import oracledb, { type Pool, type Connection } from 'oracledb';
import { env, buildConnectString } from './env';
import { logger } from '../utils/logger';

let pool: Pool | null = null;

export async function initPool(): Promise<void> {
  if (pool) return;

  pool = await oracledb.createPool({
    user: env.ORACLE_USER,
    password: env.ORACLE_PASSWORD,
    connectString: buildConnectString(),
    poolMin: env.ORACLE_POOL_MIN,
    poolMax: env.ORACLE_POOL_MAX,
    poolIncrement: env.ORACLE_POOL_INCREMENT,
    poolPingInterval: 60,
    poolTimeout: 60,
    queueTimeout: 30_000,
    stmtCacheSize: 30,
    connectTimeout: env.ORACLE_CONNECT_TIMEOUT,
  });

  logger.info('Oracle connection pool initialized', {
    host: env.ORACLE_HOST,
    port: env.ORACLE_PORT,
    service: env.ORACLE_SERVICE,
    poolMin: env.ORACLE_POOL_MIN,
    poolMax: env.ORACLE_POOL_MAX,
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
