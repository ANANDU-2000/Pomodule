import type { ColumnConfig } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';

const COLUMN_WIDTHS: Record<string, string> = {
  orderNo: '120px',
  documentDate: '110px',
  supplierCode: '110px',
  supplierName: '180px',
  location: '120px',
  orderValue: '110px',
  status: '90px',
  deliveryDate: '110px',
  remarks: '150px',
  userId: '90px',
  actions: '100px',
};

export function getPoColumns(t: TranslationMap): ColumnConfig[] {
  return [
    { key: 'orderNo', label: t.columns.orderNo, sortable: true, width: COLUMN_WIDTHS.orderNo },
    { key: 'documentDate', label: t.columns.documentDate, sortable: true, width: COLUMN_WIDTHS.documentDate },
    { key: 'supplierCode', label: t.columns.supplierCode, sortable: true, width: COLUMN_WIDTHS.supplierCode },
    { key: 'supplierName', label: t.columns.supplierName, sortable: true, width: COLUMN_WIDTHS.supplierName },
    { key: 'location', label: t.columns.location, sortable: true, width: COLUMN_WIDTHS.location },
    { key: 'orderValue', label: t.columns.orderValue, sortable: true, width: COLUMN_WIDTHS.orderValue, align: 'right' },
    { key: 'status', label: t.columns.status, sortable: true, width: COLUMN_WIDTHS.status, align: 'center' },
    { key: 'deliveryDate', label: t.columns.deliveryDate, sortable: true, width: COLUMN_WIDTHS.deliveryDate },
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
