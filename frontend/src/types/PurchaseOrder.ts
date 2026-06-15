import type { POActionPermissions, POAuditFields, POLineItem } from './formConfig';

export interface PurchaseOrder {
  orderNo: string;
  documentDate: string;
  supplierCode: string;
  supplierName: string;
  locationCode: string;
  location: string;
  deliveryDate: string;
  orderQty: number;
  currency: string;
  orderValue: number;
  lineItemCount: number;
  terms: string;
  status: string;
  remarks: string;
  userId: string;
  userName: string;
  rowId: string;
  permissions?: POActionPermissions;
  audit?: POAuditFields;
  address?: string;
  shipmentMode?: string;
  paymentTerm?: string;
  docLocation?: string;
  exchangeRate?: number;
  discount?: number;
  inclusiveVat?: boolean;
  docType?: string;
  taxInvoiceDoc?: string;
}

export interface POFormPayload {
  supplierCode: string;
  supplierName: string;
  address: string;
  shipmentMode: string;
  paymentTerm: string;
  docLocation: string;
  locationCode: string;
  location?: string;
  documentDate: string;
  deliveryDate: string;
  currency: string;
  exchangeRate: number;
  discount?: number;
  remarks?: string;
  inclusiveVat?: boolean;
  docType?: string;
  taxInvoiceDoc?: string;
  items: POLineItem[];
}

export interface ColumnConfig {
  key: keyof PurchaseOrder | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export type FilterPeriod =
  | 'today'
  | 'yesterday'
  | 'last_week'
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'all'
  | 'none';

export interface FilterOption {
  value: FilterPeriod;
  label: string;
}

export interface POListParams {
  page: number;
  pageSize: number;
  search: string;
  filter: FilterPeriod;
  sortBy: keyof PurchaseOrder | '';
  sortDirection: 'asc' | 'desc';
}
