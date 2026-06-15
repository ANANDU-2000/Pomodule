export type LookupType = 'supplier' | 'item' | 'location' | 'paymentTerm';

export interface LookupSearchParams {
  type: LookupType;
  q: string;
  supplierCode?: string;
  limit?: number;
}

export interface LookupItem {
  code: string;
  name: string;
  uom?: string;
  address?: string;
  shipmentMode?: string;
  paymentTerm?: string;
  docLocation?: string;
}

export interface LookupResponse {
  configured: boolean;
  envKey?: string;
  message?: string;
  data: LookupItem[] | null;
}
