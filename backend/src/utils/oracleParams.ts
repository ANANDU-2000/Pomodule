import type { POListQueryParams } from '../types/purchaseOrder.types';

/**
 * Maps validated query params to Oracle stored procedure IN parameters.
 * PLACEHOLDER: replace param names when DB team shares the procedure signature.
 */
export function toOracleListParams(q: POListQueryParams): Record<string, unknown> {
  return {
    P_PAGE: q.page,
    P_PAGE_SIZE: q.pageSize,
    P_SEARCH: q.search || null,
    P_FROM_DATE: q.fromDate || null,
    P_TO_DATE: q.toDate || null,
    P_SORT_BY: q.sortBy || null,
    P_SORT_ORDER: q.sortOrder,
  };
}
