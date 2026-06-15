export interface OracleSearchQueryConfig {
  viewName: string;
  selectColumns: string[];
  searchColumns: string[];
  compCode: string;
  limit: number;
  extraWhere?: string;
  extraBinds?: Record<string, string>;
}

export interface BuiltOracleSearchQuery {
  sql: string;
  binds: Record<string, string | number>;
}

function escapeLikePattern(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&');
}

export function buildOracleSearchQuery(
  config: OracleSearchQueryConfig,
  searchTerm: string,
): BuiltOracleSearchQuery {
  const binds: Record<string, string | number> = {
    compCode: config.compCode,
    limit: config.limit,
    ...config.extraBinds,
  };

  const clauses: string[] = ['COMP_CODE = :compCode'];
  if (config.extraWhere) clauses.push(config.extraWhere);

  const term = searchTerm.trim();
  if (term) {
    const searchClauses = config.searchColumns.map(
      (col) => `UPPER(TO_CHAR(${col})) LIKE :search ESCAPE '\\'`,
    );
    clauses.push(`(${searchClauses.join(' OR ')})`);
    binds.search = `%${escapeLikePattern(term.toUpperCase())}%`;
  }

  const selectSql = config.selectColumns.join(', ');
  const sql = `
    SELECT ${selectSql}
    FROM   ${config.viewName}
    WHERE  ${clauses.join(' AND ')}
    FETCH FIRST :limit ROWS ONLY
  `.trim();

  return { sql, binds };
}
