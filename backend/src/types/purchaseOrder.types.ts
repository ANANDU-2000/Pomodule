export interface POListQueryParams {
  page: number;
  pageSize: number;
  search: string;
  filter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  txnCode?: string;
}

export interface POListItem {
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

export interface POListResponse {
  data: POListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PODetailResponse = POListItem;
