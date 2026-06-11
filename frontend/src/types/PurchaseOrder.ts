export interface PurchaseOrder {
  orderNo: string;
  documentDate: string;
  supplierCode: string;
  supplierName: string;
  location: string;
  orderValue: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Draft';
  deliveryDate: string;
  remarks: string;
  userId: string;
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
