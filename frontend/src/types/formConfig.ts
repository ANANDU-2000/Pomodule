export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'lookup';

export interface FormFieldValidationSchema {
  rules: string[];
}

export interface FormFieldDef {
  key: string;
  apiField: string;
  type: FormFieldType;
  lookupType?: string;
  required: boolean;
  section: string;
  editable: boolean;
  labelKey: string;
  validationSchema: FormFieldValidationSchema;
  dependsOn?: string;
  readOnly?: boolean;
  defaultFrom?: string;
}

export interface FormSectionDef {
  id: string;
  labelKey: string;
  fields: FormFieldDef[];
}

export type FormConfigSource = 'oracle' | 'temporary-fallback';

export interface FormConfigResponse {
  source: FormConfigSource;
  sections: FormSectionDef[];
}

export interface SystemDefaultsResponse {
  currency: string;
  searchLimit: number;
  itemSearchLimit: number;
  minSearchChars: number;
  debounceMs: number;
}

export type LookupType = 'supplier' | 'item' | 'location' | 'paymentTerm';

export interface LookupItem {
  code: string;
  name: string;
  uom?: string;
  address?: string;
  shipmentMode?: string;
  paymentTerm?: string;
  docLocation?: string;
  locationCode?: string;
  locationName?: string;
}

export interface LookupResponse {
  configured: boolean;
  envKey?: string;
  message?: string;
  data: LookupItem[] | null;
}

export interface POActionPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  canApprove: boolean;
  canPrint: boolean;
}

export interface POAuditFields {
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  approvedBy: string;
  approvedDate: string;
}

export interface POLineItem {
  itemCode: string;
  itemName: string;
  grade1?: string;
  grade2?: string;
  freeStock?: number;
  uom: string;
  quantity: number;
  rate: number;
  discPercent: number;
  discAmt: number;
  netValue: number;
  tolPlus: number;
  tolMinus: number;
}

export interface POFormValues {
  supplierCode: string;
  supplierName: string;
  address: string;
  shipmentMode: string;
  paymentTerm: string;
  docLocation: string;
  locationCode: string;
  location: string;
  documentDate: string;
  deliveryDate: string;
  currency: string;
  exchangeRate: number;
  discount: number;
  remarks: string;
  inclusiveVat: boolean;
  docType: string;
  taxInvoiceDoc: string;
  items: POLineItem[];
}

export interface POLineItemsResponse {
  configured: boolean;
  envKey?: string;
  message?: string;
  data: POLineItem[] | null;
}
