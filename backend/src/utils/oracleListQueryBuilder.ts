/**
 * Future extension point for SQL-side pagination, search, filter, and sort.
 * Phase 1 fetches all rows from OV_PO_SEARCH_VIEW_YSG and applies list params in Node.
 * Wire these methods when DB team confirms pagination approach for large volumes.
 */

export function buildWhereClause(): string {
  return 'COMP_CODE = :compCode AND TXN_CODE = :txnCode';
}

export function buildOrderBy(_sortBy: string, _sortOrder: 'asc' | 'desc'): string {
  return 'DOC_DT DESC';
}

export function buildOffsetFetch(page: number, pageSize: number): { offset: number; fetch: number } {
  return {
    offset: (page - 1) * pageSize,
    fetch: pageSize,
  };
}
