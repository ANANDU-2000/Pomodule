import oracledb, { type Connection } from 'oracledb';
import { env } from './env';
import { getConnection } from './oracle';
import { getPoModuleConfig } from '../modules/po/po.config';
import { buildViewCountQuery } from '../utils/oracleViewQuery';

export interface OracleHealthStatus {
  connected: boolean;
  queryStatus: 'ok' | 'failed';
  error: string | null;
  rowCount: number | null;
  host: string;
  service: string;
  viewName: string;
  compCode: string;
  txnCode: string;
  compTxnFilterApplied: boolean;
}

export async function probeOracleHealth(existingConn?: Connection): Promise<OracleHealthStatus> {
  const poConfig = getPoModuleConfig();
  const base: Omit<OracleHealthStatus, 'connected' | 'queryStatus' | 'error' | 'rowCount'> = {
    host: env.ORACLE_HOST,
    service: env.ORACLE_SERVICE,
    viewName: env.ORACLE_VIEW_NAME,
    compCode: env.ORACLE_COMP_CODE,
    txnCode: env.ORACLE_TXN_CODE,
    compTxnFilterApplied: env.ORACLE_APPLY_COMP_TXN_FILTER,
  };

  const ownsConnection = !existingConn;
  let conn = existingConn;

  try {
    if (!conn) conn = await getConnection();

    await conn.execute('SELECT 1 FROM DUAL');

    const { sql, binds } = buildViewCountQuery(poConfig);
    const countResult = await conn.execute<{ CNT: number }>(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rowCount = Number(countResult.rows?.[0]?.CNT ?? 0);

    return { ...base, connected: true, queryStatus: 'ok', error: null, rowCount };
  } catch (err) {
    return {
      ...base,
      connected: false,
      queryStatus: 'failed',
      error: err instanceof Error ? err.message : String(err),
      rowCount: null,
    };
  } finally {
    if (ownsConnection && conn) await conn.close();
  }
}
