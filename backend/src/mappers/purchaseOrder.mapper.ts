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
    location: String(row.LOCN_NAME ?? ''),
    orderValue: Number(row.GROSS_AMNT ?? 0),
    status: String(row.DOC_STATUS ?? ''),
    deliveryDate: formatOracleDate(row.H_DEL_DT),
    remarks: String(row.REFERENCE_NO ?? ''),
    userId: String(row.H_CR_UID ?? ''),
  };
}
