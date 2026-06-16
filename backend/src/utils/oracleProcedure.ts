import type { Connection, ExecuteResult } from 'oracledb';
import oracledb from 'oracledb';
import { logger } from './logger';

export type ProcedureBinds = Record<string, unknown>;

export async function executeNamedProcedure(
  conn: Connection,
  procedureName: string,
  binds: ProcedureBinds,
): Promise<ExecuteResult<unknown>> {
  const bindNames = Object.keys(binds);
  const plsqlBinds = bindNames.map((k) => `:${k}`).join(', ');
  const sql = `BEGIN ${procedureName}(${plsqlBinds}); END;`;

  logger.debug('Executing Oracle procedure', { procedureName, bindKeys: bindNames });

  return conn.execute(sql, binds, { autoCommit: false });
}
