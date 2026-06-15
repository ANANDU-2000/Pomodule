export interface POAuditFields {
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  approvedBy: string;
  approvedDate: string;
}

export interface POActionPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  canApprove: boolean;
  canPrint: boolean;
}

export interface POLineItem {
  itemCode: string;
  itemName: string;
  uom: string;
  quantity: number;
  rate: number;
  discPercent: number;
  discAmt: number;
  netValue: number;
  tolPlus: number;
  tolMinus: number;
}

export interface POFormHeader {
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
  discount: number;
  remarks: string;
  inclusiveVat: boolean;
  docType: string;
  taxInvoiceDoc: string;
}

export type POCreatePayload = POFormHeader & { items: POLineItem[] };
export type POUpdatePayload = Partial<POFormHeader> & { items?: POLineItem[] };

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
}

export interface POListResponse {
  data: PurchaseOrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PODetailResponse extends PurchaseOrderListItem {
  audit: POAuditFields;
  permissions: POActionPermissions;
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

export interface POLineItemsResponse {
  configured: boolean;
  envKey?: string;
  message?: string;
  data: POLineItem[] | null;
}

export class NotConfiguredError extends Error {
  constructor(
    public readonly blocker: string,
    message: string,
  ) {
    super(message);
    this.name = 'NotConfiguredError';
  }
}
