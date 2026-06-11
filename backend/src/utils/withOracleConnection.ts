import type { Connection } from 'oracledb';
import { env } from '../config/env';
import { getConnection } from '../config/db.config';

export async function withOracleConnection<T>(
  handler: (conn: Connection | undefined) => Promise<T>,
): Promise<T> {
  let conn: Connection | undefined;
  try {
    if (env.DATA_SOURCE === 'oracle') {
      conn = await getConnection();
    }
    return await handler(conn);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}
