import type { POListQueryParams } from '../types/purchaseOrder.types';
import { resolveFilterDates } from './dateFilter';

/**
 * Maps validated query params to Oracle stored procedure IN parameters.
 * Date range is resolved on the Node layer from filter enum — not sent by frontend.
 * PLACEHOLDER: replace param names when DB team shares the procedure signature.
 */
export function toOracleListParams(q: POListQueryParams): Record<string, unknown> {
  const { fromDate, toDate } = resolveFilterDates(q.filter);

  return {
    P_PAGE: q.page,
    P_PAGE_SIZE: q.pageSize,
    P_SEARCH: q.search || null,
    P_FROM_DATE: fromDate || null,
    P_TO_DATE: toDate || null,
    P_SORT_BY: q.sortBy || null,
    P_SORT_ORDER: q.sortOrder,
  };
}
