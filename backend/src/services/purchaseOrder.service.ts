import oracledb, { type Connection } from 'oracledb';
import type {
  POListQueryParams,
  PurchaseOrderListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import type { OraclePurchaseOrderRow } from '../types/oracle.types';
import { getPoModuleConfig } from '../modules/po/po.config';
import { mapOracleRowToPurchaseOrderListItem } from '../mappers/purchaseOrder.mapper';
import { buildViewListQuery, buildViewDetailQuery } from '../utils/oracleViewQuery';
import { calcTotalPages } from '../utils/pagination';
import { logger } from '../utils/logger';

const poConfig = getPoModuleConfig();

export async function getPOList(
  params: POListQueryParams,
  conn: Connection,
): Promise<POListResponse> {
  const query = buildViewListQuery(poConfig, params);

  if (query.skipQuery) {
    return { data: [], total: 0, page: params.page, pageSize: params.pageSize, totalPages: 0 };
  }

  const countResult = await conn.execute<{ TOTAL: number }>(
    query.countSql,
    query.countBinds,
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const total = Number(countResult.rows?.[0]?.TOTAL ?? 0);
  if (total === 0) {
    return { data: [], total: 0, page: params.page, pageSize: params.pageSize, totalPages: 0 };
  }

  const listResult = await conn.execute<OraclePurchaseOrderRow>(
    query.listSql,
    query.listBinds,
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const data = ((listResult.rows ?? []) as OraclePurchaseOrderRow[]).map(
    mapOracleRowToPurchaseOrderListItem,
  );

  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: calcTotalPages(total, params.pageSize),
  };
}

export async function getPODetail(
  orderNo: string,
  conn: Connection,
): Promise<PODetailResponse | null> {
  const { sql, binds } = buildViewDetailQuery(poConfig, orderNo);

  logger.debug('PO detail query', { orderNo });

  const result = await conn.execute<OraclePurchaseOrderRow>(sql, binds, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });

  const row = result.rows?.[0] as OraclePurchaseOrderRow | undefined;
  return row ? mapOracleRowToPurchaseOrderListItem(row) : null;
}

export async function updatePO(
  _id: string,
  _payload: Partial<PurchaseOrderListItem>,
  _conn: Connection,
): Promise<PurchaseOrderListItem | null> {
  return null;
}

export async function approvePO(
  _id: string,
  _conn: Connection,
): Promise<PurchaseOrderListItem | null> {
  return null;
}
