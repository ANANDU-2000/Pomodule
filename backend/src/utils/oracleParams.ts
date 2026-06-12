import type { POListQueryParams } from '../types/purchaseOrder.types';
import { env } from '../config/env';
import { resolveFilterDates } from './dateFilter';

export function toOracleListParams(q: POListQueryParams): Record<string, unknown> {
  const { fromDate, toDate } = resolveFilterDates(q.filter);

  return {
    compCode: env.ORACLE_COMP_CODE,
    txnCode: q.txnCode ?? env.ORACLE_TXN_CODE,
    P_PAGE: q.page,
    P_PAGE_SIZE: q.pageSize,
    P_SEARCH: q.search || null,
    P_FROM_DATE: fromDate || null,
    P_TO_DATE: toDate || null,
    P_SORT_BY: q.sortBy || null,
    P_SORT_ORDER: q.sortOrder,
  };
}
