import oracledb, { type Connection } from 'oracledb';
import type {
  POListQueryParams,
  PurchaseOrderListItem,
  POListResponse,
  PODetailResponse,
  POCreatePayload,
  POUpdatePayload,
  POLineItemsResponse,
  POLineItem,
} from '../types/purchaseOrder.types';
import type { OraclePurchaseOrderRow } from '../types/oracle.types';
import { getPoModuleConfig } from '../modules/po/po.config';
import {
  buildApproveProcedureBinds,
  buildCreateProcedureBinds,
  buildUpdateProcedureBinds,
} from '../modules/po/poProcedure.binds';
import { mapOracleRowToPurchaseOrderListItem } from '../mappers/purchaseOrder.mapper';
import { buildViewListQuery, buildViewDetailQuery } from '../utils/oracleViewQuery';
import { executeNamedProcedure } from '../utils/oracleProcedure';
import { calcTotalPages } from '../utils/pagination';
import { resolvePOPermissions } from '../utils/poPermissions.util';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const poConfig = getPoModuleConfig();

function notConfiguredError(message: string, blocker: string): Error & { statusCode: number; blocker: string } {
  const err = new Error(message) as Error & { statusCode: number; blocker: string };
  err.statusCode = 501;
  err.blocker = blocker;
  return err;
}

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

function mapLineItemRow(row: Record<string, unknown>): POLineItem {
  return {
    itemCode: String(row.ITEM_CODE ?? row.item_code ?? ''),
    itemName: String(row.ITEM_NAME ?? row.item_name ?? ''),
    uom: String(row.UOM ?? row.uom ?? ''),
    quantity: Number(row.QTY ?? row.quantity ?? row.QTY_NUM ?? 1),
    rate: Number(row.RATE ?? row.rate ?? 0),
    discPercent: Number(row.DISC_PCT ?? row.disc_percent ?? 0),
    discAmt: Number(row.DISC_AMT ?? row.disc_amt ?? 0),
    netValue: Number(row.NET_VALUE ?? row.net_value ?? 0),
    tolPlus: Number(row.TOL_PLUS ?? row.tol_plus ?? 0),
    tolMinus: Number(row.TOL_MINUS ?? row.tol_minus ?? 0),
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
  orderNo: string,
  conn: Connection,
): Promise<POLineItemsResponse> {
  if (!env.ORACLE_PO_LINE_VIEW) {
    return {
      configured: false,
      envKey: 'ORACLE_PO_LINE_VIEW',
      message: 'Oracle PO line view not configured. Set ORACLE_PO_LINE_VIEW in environment.',
      data: null,
    };
  }

  const docCol = env.ORACLE_PO_LINE_DOC_COL;
  const sql = `
    SELECT ITEM_CODE, ITEM_NAME, UOM, QTY, RATE, DISC_PCT, DISC_AMT, NET_VALUE, TOL_PLUS, TOL_MINUS
    FROM   ${env.ORACLE_PO_LINE_VIEW}
    WHERE  ${docCol} = :orderNo
  `.trim();

  const result = await conn.execute<Record<string, unknown>>(sql, { orderNo }, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });

  const data = (result.rows ?? []).map(mapLineItemRow);
  return { configured: true, data };
}

export async function createPO(
  payload: POCreatePayload,
  conn: Connection,
): Promise<PurchaseOrderListItem> {
  if (!env.ORACLE_PO_CREATE_SP) {
    throw notConfiguredError('PO create stored procedure not configured', 'ORACLE_PO_CREATE_SP');
  }

  const binds = {
    ...buildCreateProcedureBinds(payload, env.ORACLE_USER),
    p_doc_no: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 64 },
  };

  await executeNamedProcedure(conn, env.ORACLE_PO_CREATE_SP, binds);
  await conn.commit();

  const newOrderNo = String(binds.p_doc_no ?? '');
  if (!newOrderNo) {
    throw notConfiguredError(
      'PO create SP did not return p_doc_no — align binds with DB team',
      'ORACLE_PO_CREATE_SP',
    );
  }

  const detail = await getPODetail(newOrderNo, conn);
  if (!detail) {
    throw new Error(`PO created but detail not found: ${newOrderNo}`);
  }
  return detail;
}

export async function updatePO(
  id: string,
  payload: POUpdatePayload,
  conn: Connection,
): Promise<PurchaseOrderListItem> {
  if (!env.ORACLE_PO_UPDATE_SP) {
    throw notConfiguredError('PO update stored procedure not configured', 'ORACLE_PO_UPDATE_SP');
  }

  await executeNamedProcedure(
    conn,
    env.ORACLE_PO_UPDATE_SP,
    buildUpdateProcedureBinds(id, payload, env.ORACLE_USER),
  );
  await conn.commit();

  const detail = await getPODetail(id, conn);
  if (!detail) {
    throw new Error(`PO updated but detail not found: ${id}`);
  }
  return detail;
}

export async function approvePO(
  id: string,
  conn: Connection,
): Promise<PurchaseOrderListItem> {
  if (!env.ORACLE_PO_APPROVE_SP) {
    throw notConfiguredError('PO approve stored procedure not configured', 'ORACLE_PO_APPROVE_SP');
  }

  await executeNamedProcedure(
    conn,
    env.ORACLE_PO_APPROVE_SP,
    buildApproveProcedureBinds(id, env.ORACLE_USER),
  );
  await conn.commit();

  const detail = await getPODetail(id, conn);
  if (!detail) {
    throw new Error(`PO approved but detail not found: ${id}`);
  }
  return detail;
}
