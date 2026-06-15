import oracledb, { type Connection } from 'oracledb';
import type {
  POListQueryParams,
  PurchaseOrderListItem,
  POListResponse,
  PODetailResponse,
  POCreatePayload,
  POUpdatePayload,
  POLineItemsResponse,
} from '../types/purchaseOrder.types';
import type { OraclePurchaseOrderRow } from '../types/oracle.types';
import { getPoModuleConfig } from '../modules/po/po.config';
import { mapOracleRowToPurchaseOrderListItem } from '../mappers/purchaseOrder.mapper';
import { buildViewListQuery, buildViewDetailQuery } from '../utils/oracleViewQuery';
import { calcTotalPages } from '../utils/pagination';
import { resolvePOPermissions } from '../utils/poPermissions.util';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const poConfig = getPoModuleConfig();

function buildAuditFields(row: OraclePurchaseOrderRow) {
  return {
    createdBy: String(row.H_CR_UNAME ?? row.H_CR_UID ?? ''),
    createdDate: String(row.DOC_DT ?? ''),
    updatedBy: '',
    updatedDate: '',
    approvedBy: '',
    approvedDate: '',
  };
}

function enrichDetail(row: OraclePurchaseOrderRow): PODetailResponse {
  const base = mapOracleRowToPurchaseOrderListItem(row);
  return {
    ...base,
    audit: buildAuditFields(row),
    permissions: resolvePOPermissions(base),
  };
}

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
  return row ? enrichDetail(row) : null;
}

export async function getPOLineItems(
  _orderNo: string,
  _conn: Connection,
): Promise<POLineItemsResponse> {
  if (!env.ORACLE_PO_LINE_VIEW) {
    return {
      configured: false,
      envKey: 'ORACLE_PO_LINE_VIEW',
      message: 'Oracle PO line view not configured. Set ORACLE_PO_LINE_VIEW in environment.',
      data: null,
    };
  }

  // Future: query ORACLE_PO_LINE_VIEW by orderNo
  return { configured: true, data: [] };
}

export async function createPO(
  _payload: POCreatePayload,
  _conn: Connection,
): Promise<never> {
  if (!env.ORACLE_PO_CREATE_SP) {
    const err = new Error('PO create stored procedure not configured') as Error & { statusCode: number; blocker: string };
    err.statusCode = 501;
    err.blocker = 'ORACLE_PO_CREATE_SP';
    throw err;
  }
  const err = new Error('PO create stored procedure not yet implemented') as Error & { statusCode: number; blocker: string };
  err.statusCode = 501;
  err.blocker = 'ORACLE_PO_CREATE_SP';
  throw err;
}

export async function updatePO(
  _id: string,
  _payload: POUpdatePayload,
  _conn: Connection,
): Promise<never> {
  if (!env.ORACLE_PO_UPDATE_SP) {
    const err = new Error('PO update stored procedure not configured') as Error & { statusCode: number; blocker: string };
    err.statusCode = 501;
    err.blocker = 'ORACLE_PO_UPDATE_SP';
    throw err;
  }
  const err = new Error('PO update stored procedure not yet implemented') as Error & { statusCode: number; blocker: string };
  err.statusCode = 501;
  err.blocker = 'ORACLE_PO_UPDATE_SP';
  throw err;
}

export async function approvePO(
  _id: string,
  _conn: Connection,
): Promise<never> {
  if (!env.ORACLE_PO_APPROVE_SP) {
    const err = new Error('PO approve stored procedure not configured') as Error & { statusCode: number; blocker: string };
    err.statusCode = 501;
    err.blocker = 'ORACLE_PO_APPROVE_SP';
    throw err;
  }
  const err = new Error('PO approve stored procedure not yet implemented') as Error & { statusCode: number; blocker: string };
  err.statusCode = 501;
  err.blocker = 'ORACLE_PO_APPROVE_SP';
  throw err;
}
