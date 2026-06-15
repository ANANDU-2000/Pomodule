import type { PurchaseOrderListItem } from '../types/purchaseOrder.types';
import type { OraclePurchaseOrderRow } from '../types/oracle.types';

function formatOracleDate(value: Date | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const str = String(value);
  if (str.includes('T')) {
    return str.split('T')[0];
  }
  return str;
}

export function mapOracleRowToPurchaseOrderListItem(row: OraclePurchaseOrderRow): PurchaseOrderListItem {
  return {
    orderNo: String(row.DOC_NO ?? ''),
    documentDate: formatOracleDate(row.DOC_DT),
    supplierCode: String(row.SUPP_CODE ?? ''),
    supplierName: String(row.SUPP_NAME ?? ''),
    locationCode: String(row.H_LOCN_CODE ?? ''),
    location: String(row.LOCN_NAME ?? ''),
    deliveryDate: formatOracleDate(row.H_DEL_DT),
    orderQty: Number(row.TOT_QTY ?? 0),
    currency: String(row.CURR_CODE ?? ''),
    orderValue: Number(row.GROSS_AMNT ?? 0),
    lineItemCount: Number(row.ITEM_COUNT ?? 0),
    terms: String(row.TERM_NAME ?? ''),
    status: String(row.DOC_STATUS ?? ''),
    remarks: String(row.REFERENCE_NO ?? ''),
    userId: String(row.H_CR_UID ?? ''),
    userName: String(row.H_CR_UNAME ?? ''),
    rowId: String(row.H_ROW_ID ?? ''),
  };
}
