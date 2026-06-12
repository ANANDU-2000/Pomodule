import oracledb, { type Connection } from 'oracledb';
import type { POListQueryParams, PurchaseOrderListItem, POListResponse } from '../types/purchaseOrder.types';
import type { OraclePurchaseOrderRow } from '../types/oracle.types';
import { env } from '../config/env';
import { mapOracleRowToPurchaseOrderListItem } from '../mappers/purchaseOrder.mapper';
import { applyListParams } from '../utils/applyListParams';
import { logger } from '../utils/logger';

const PO_LIST_SQL = `
  SELECT DOC_NO, DOC_DT, SUPP_CODE, SUPP_NAME, H_LOCN_CODE, LOCN_NAME,
         H_DEL_DT, TOT_QTY, CURR_CODE, GROSS_AMNT, ITEM_COUNT, TERM_NAME,
         DOC_STATUS, REFERENCE_NO, H_CR_UID, H_CR_UNAME, H_ROW_ID
  FROM   OV_PO_SEARCH_VIEW_YSG
  WHERE  COMP_CODE = :compCode
  AND    TXN_CODE  = :txnCode
`;

const PO_DETAIL_SQL = `
  SELECT DOC_NO, DOC_DT, SUPP_CODE, SUPP_NAME, H_LOCN_CODE, LOCN_NAME,
         H_DEL_DT, TOT_QTY, CURR_CODE, GROSS_AMNT, ITEM_COUNT, TERM_NAME,
         DOC_STATUS, REFERENCE_NO, H_CR_UID, H_CR_UNAME, H_ROW_ID
  FROM   OV_PO_SEARCH_VIEW_YSG
  WHERE  COMP_CODE = :compCode
  AND    TXN_CODE  = :txnCode
  AND    DOC_NO    = :orderNo
`;

function resolveTxnCode(params?: POListQueryParams): string {
  return params?.txnCode ?? env.ORACLE_TXN_CODE;
}

async function fetchAllRows(
  conn: Connection,
  txnCode: string,
): Promise<PurchaseOrderListItem[]> {
  const binds = {
    compCode: env.ORACLE_COMP_CODE,
    txnCode,
  };

  logger.debug('Executing PO list query', binds);

  const result = await conn.execute<OraclePurchaseOrderRow>(
    PO_LIST_SQL,
    binds,
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const rows = (result.rows ?? []) as OraclePurchaseOrderRow[];

  if (rows.length === 0) {
    logger.warn('Empty result from OV_PO_SEARCH_VIEW_YSG', { txnCode });
  }

  return rows.map(mapOracleRowToPurchaseOrderListItem);
}

export async function getPOList(
  params: POListQueryParams,
  conn: Connection,
): Promise<POListResponse> {
  const txnCode = resolveTxnCode(params);
  const allOrders = await fetchAllRows(conn, txnCode);
  return applyListParams(allOrders, params);
}

export async function getPODetail(
  orderNo: string,
  conn: Connection,
  txnCode?: string,
): Promise<PurchaseOrderListItem | null> {
  const binds = {
    compCode: env.ORACLE_COMP_CODE,
    txnCode: txnCode ?? env.ORACLE_TXN_CODE,
    orderNo,
  };

  logger.debug('Executing PO detail query', { orderNo, txnCode: binds.txnCode });

  const result = await conn.execute<OraclePurchaseOrderRow>(
    PO_DETAIL_SQL,
    binds,
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const row = result.rows?.[0] as OraclePurchaseOrderRow | undefined;
  if (!row) return null;

  return mapOracleRowToPurchaseOrderListItem(row);
}
