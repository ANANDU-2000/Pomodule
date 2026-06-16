import type { POListQueryParams } from '../types/purchaseOrder.types';
import { resolveFilterDates } from './dateFilter';

export interface OracleViewModuleConfig {
  viewName: string;
  selectColumns: readonly string[];
  searchColumns: readonly string[];
  sortColumnMap: Record<string, string>;
  idColumn: string;
  dateColumn: string;
  applyCompTxnFilter: boolean;
  compCode: string;
  txnCode: string;
}

export interface BuiltViewListQuery {
  countSql: string;
  listSql: string;
  countBinds: Record<string, string | number>;
  listBinds: Record<string, string | number>;
  skipQuery: boolean;
}

function escapeLikePattern(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&');
}

function buildWhereClause(
  config: OracleViewModuleConfig,
  params: POListQueryParams,
  binds: Record<string, string | number>,
): string {
  const clauses: string[] = [];

  if (config.applyCompTxnFilter) {
    clauses.push('COMP_CODE = :compCode', 'TXN_CODE = :txnCode');
    binds.compCode = config.compCode;
    binds.txnCode = params.txnCode ?? config.txnCode;
  }

  if (params.filter === 'none') {
    clauses.push('1 = 0');
    return clauses.join(' AND ');
  }

  const searchTerm = params.search.trim();
  if (searchTerm) {
    const searchClauses = config.searchColumns.map(
      (col) => `UPPER(TO_CHAR(${col})) LIKE :search ESCAPE '\\'`,
    );
    clauses.push(`(${searchClauses.join(' OR ')})`);
    binds.search = `%${escapeLikePattern(searchTerm.toUpperCase())}%`;
  }

  if (params.filter !== 'all') {
    const { fromDate, toDate } = resolveFilterDates(params.filter);
    if (fromDate && toDate) {
      clauses.push(`TRUNC(${config.dateColumn}) >= TO_DATE(:fromDate, 'YYYY-MM-DD')`);
      clauses.push(`TRUNC(${config.dateColumn}) <= TO_DATE(:toDate, 'YYYY-MM-DD')`);
      binds.fromDate = fromDate;
      binds.toDate = toDate;
    }
  }

  return clauses.length > 0 ? clauses.join(' AND ') : '1 = 1';
}

function buildOrderBy(
  config: OracleViewModuleConfig,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
): string {
  const column =
    sortBy && config.sortColumnMap[sortBy] ? config.sortColumnMap[sortBy] : config.dateColumn;
  return `${column} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
}

export function buildViewListQuery(
  config: OracleViewModuleConfig,
  params: POListQueryParams,
): BuiltViewListQuery {
  const binds: Record<string, string | number> = {};
  const where = buildWhereClause(config, params, binds);
  const selectSql = config.selectColumns.join(', ');

  if (params.filter === 'none') {
    return { countSql: '', listSql: '', countBinds: binds, listBinds: binds, skipQuery: true };
  }

  const countSql = `SELECT COUNT(*) AS TOTAL FROM ${config.viewName} WHERE ${where}`;
  const offset = (params.page - 1) * params.pageSize;
  const listBinds = { ...binds, offset, pageSize: params.pageSize };
  const orderBy = buildOrderBy(config, params.sortBy, params.sortOrder);
  const queryHint = (process.env.ORACLE_QUERY_HINT ?? '').trim();
  const hintClause = queryHint ? `/*+ ${queryHint} */ ` : '';

  const listSql = `
    SELECT ${hintClause}${selectSql}
    FROM   ${config.viewName}
    WHERE  ${where}
    ORDER BY ${orderBy}
    OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
  `.trim();

  return { countSql, listSql, countBinds: binds, listBinds, skipQuery: false };
}

export function buildViewDetailQuery(
  config: OracleViewModuleConfig,
  idValue: string,
): { sql: string; binds: Record<string, string> } {
  const selectSql = config.selectColumns.join(', ');
  const binds: Record<string, string> = { idValue };

  if (config.applyCompTxnFilter) {
    binds.compCode = config.compCode;
    binds.txnCode = config.txnCode;
    return {
      sql: `
        SELECT ${selectSql}
        FROM   ${config.viewName}
        WHERE  COMP_CODE = :compCode
        AND    TXN_CODE  = :txnCode
        AND    ${config.idColumn} = :idValue
      `.trim(),
      binds,
    };
  }

  return {
    sql: `
      SELECT ${selectSql}
      FROM   ${config.viewName}
      WHERE  ${config.idColumn} = :idValue
    `.trim(),
    binds,
  };
}

export function buildViewCountQuery(config: OracleViewModuleConfig): {
  sql: string;
  binds: Record<string, string>;
} {
  if (config.applyCompTxnFilter) {
    return {
      sql: `
        SELECT COUNT(*) AS CNT
        FROM   ${config.viewName}
        WHERE  COMP_CODE = :compCode
        AND    TXN_CODE  = :txnCode
      `.trim(),
      binds: { compCode: config.compCode, txnCode: config.txnCode },
    };
  }

  return {
    sql: `SELECT COUNT(*) AS CNT FROM ${config.viewName}`,
    binds: {},
  };
}
