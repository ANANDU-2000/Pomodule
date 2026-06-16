import type { POCreatePayload, POUpdatePayload } from '../../types/purchaseOrder.types';
import type { ProcedureBinds } from '../../utils/oracleProcedure';
import { env } from '../../config/env';

export function buildCreateProcedureBinds(
  payload: POCreatePayload,
  userId: string,
): ProcedureBinds {
  return {
    // OT_PO_HEAD — header fields (align with team SP signature when shared)
    p_comp_code: env.ORACLE_COMP_CODE,
    p_txn_code: env.ORACLE_TXN_CODE,
    p_user_id: userId,
    p_supp_code: payload.supplierCode,
    p_supp_name: payload.supplierName,
    p_doc_dt: payload.documentDate,
    p_del_dt: payload.deliveryDate,
    p_curr_code: payload.currency,
    p_locn_code: payload.locationCode,
    p_remarks: payload.remarks ?? '',
    // OT_PO_ITEM lines — JSON until team shares line-level SP/table API
    p_items_json: JSON.stringify(payload.items),
  };
}

export function buildUpdateProcedureBinds(
  orderNo: string,
  payload: POUpdatePayload,
  userId: string,
): ProcedureBinds {
  return {
    p_doc_no: orderNo,
    p_comp_code: env.ORACLE_COMP_CODE,
    p_txn_code: env.ORACLE_TXN_CODE,
    p_user_id: userId,
    p_supp_code: payload.supplierCode ?? '',
    p_doc_dt: payload.documentDate ?? '',
    p_del_dt: payload.deliveryDate ?? '',
    p_items_json: payload.items ? JSON.stringify(payload.items) : null,
  };
}

export function buildApproveProcedureBinds(orderNo: string, userId: string): ProcedureBinds {
  return {
    p_doc_no: orderNo,
    p_comp_code: env.ORACLE_COMP_CODE,
    p_txn_code: env.ORACLE_TXN_CODE,
    p_user_id: userId,
  };
}
