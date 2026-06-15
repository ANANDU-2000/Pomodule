import { env } from '../../config/env';

/** API field → Oracle column for PO module (reuse pattern for next modules). */
export const PO_FIELD_MAP = {
  orderNo: 'DOC_NO',
  documentDate: 'DOC_DT',
  supplierCode: 'SUPP_CODE',
  supplierName: 'SUPP_NAME',
  location: 'LOCN_NAME',
  deliveryDate: 'H_DEL_DT',
  orderValue: 'GROSS_AMNT',
  status: 'DOC_STATUS',
  remarks: 'REFERENCE_NO',
  userId: 'H_CR_UID',
} as const;

export const PO_SELECT_COLUMNS = Object.values(PO_FIELD_MAP);
export const PO_SEARCH_COLUMNS = [
  PO_FIELD_MAP.orderNo,
  PO_FIELD_MAP.supplierCode,
  PO_FIELD_MAP.supplierName,
  PO_FIELD_MAP.location,
  PO_FIELD_MAP.status,
  PO_FIELD_MAP.userId,
  PO_FIELD_MAP.remarks,
] as const;

export const PO_SORTABLE_API_FIELDS = Object.keys(PO_FIELD_MAP);

export function getPoModuleConfig() {
  return {
    viewName: env.ORACLE_VIEW_NAME,
    selectColumns: PO_SELECT_COLUMNS,
    searchColumns: PO_SEARCH_COLUMNS,
    sortColumnMap: PO_FIELD_MAP as Record<string, string>,
    idColumn: env.ORACLE_ID_COLUMN,
    dateColumn: env.ORACLE_DATE_COLUMN,
    applyCompTxnFilter: env.ORACLE_APPLY_COMP_TXN_FILTER,
    compCode: env.ORACLE_COMP_CODE,
    txnCode: env.ORACLE_TXN_CODE,
  };
}
