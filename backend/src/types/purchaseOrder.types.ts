export interface POListQueryParams {
  page: number;
  pageSize: number;
  search: string;
  filter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  txnCode?: string;
}

export interface PurchaseOrderListItem {
  orderNo: string;
  documentDate: string;
  supplierCode: string;
  supplierName: string;
  location: string;
  orderValue: number;
  status: string;
  deliveryDate: string;
  remarks: string;
  userId: string;
}

/** @deprecated Use PurchaseOrderListItem */
export type POListItem = PurchaseOrderListItem;

export interface POListResponse {
  data: PurchaseOrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PODetailResponse = PurchaseOrderListItem;

export interface PurchaseOrderListItemExtended extends PurchaseOrderListItem {
  locationCode?: string;
  totalQty?: number;
  currency?: string;
  itemCount?: number;
  termName?: string;
  userName?: string;
  rowId?: string;
}
