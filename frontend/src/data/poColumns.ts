import type { ColumnConfig } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';

const COLUMN_WIDTHS: Record<string, string> = {
  orderNo: '116px',
  documentDate: '108px',
  supplierCode: '106px',
  supplierName: '176px',
  location: '118px',
  orderValue: '108px',
  status: '94px',
  deliveryDate: '108px',
  remarks: '180px',
  userId: '86px',
  actions: '72px',
};

export function getPoColumns(t: TranslationMap): ColumnConfig[] {
  return [
    { key: 'orderNo', label: t.columns.orderNo, sortable: true, width: COLUMN_WIDTHS.orderNo },
    { key: 'documentDate', label: t.columns.documentDate, sortable: true, width: COLUMN_WIDTHS.documentDate, align: 'right' },
    { key: 'supplierCode', label: t.columns.supplierCode, sortable: true, width: COLUMN_WIDTHS.supplierCode },
    { key: 'supplierName', label: t.columns.supplierName, sortable: true, width: COLUMN_WIDTHS.supplierName },
    { key: 'location', label: t.columns.location, sortable: true, width: COLUMN_WIDTHS.location },
    { key: 'orderValue', label: t.columns.orderValue, sortable: true, width: COLUMN_WIDTHS.orderValue, align: 'right' },
    { key: 'status', label: t.columns.status, sortable: true, width: COLUMN_WIDTHS.status, align: 'center' },
    { key: 'deliveryDate', label: t.columns.deliveryDate, sortable: true, width: COLUMN_WIDTHS.deliveryDate, align: 'right' },
    { key: 'remarks', label: t.columns.remarks, sortable: false, width: COLUMN_WIDTHS.remarks },
    { key: 'userId', label: t.columns.userId, sortable: true, width: COLUMN_WIDTHS.userId },
    { key: 'actions', label: t.columns.actions, sortable: false, width: COLUMN_WIDTHS.actions, align: 'center' },
  ];
}

/** Sum of column widths for horizontal scroll min-width. */
export const TABLE_MIN_WIDTH = Object.values(COLUMN_WIDTHS).reduce((sum, w) => {
  const n = parseInt(w, 10);
  return sum + (Number.isNaN(n) ? 0 : n);
}, 0);
