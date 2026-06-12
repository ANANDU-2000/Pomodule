import type { Connection } from 'oracledb';
import { getConnection } from '../config/oracle';

export async function withOracleConnection<T>(
  handler: (conn: Connection) => Promise<T>,
): Promise<T> {
  const conn = await getConnection();
  try {
    return await handler(conn);
  } finally {
    await conn.close();
  }
}
