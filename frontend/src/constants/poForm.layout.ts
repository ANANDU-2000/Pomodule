export type POFormLayoutFieldKey =
  | 'supplier'
  | 'paymentTerm'
  | 'address'
  | 'shipmentMode'
  | 'docLocation'
  | 'location'
  | 'deliveryDate'
  | 'documentDate'
  | 'currency'
  | 'exchangeRate'
  | 'discount'
  | 'docType'
  | 'taxInvoiceDoc'
  | 'remarks'
  | 'inclusiveVat';

export interface POFormGridRow {
  cols: POFormLayoutFieldKey[];
  /** Span all 3 columns (address, remarks). */
  fullWidth?: boolean;
  checkbox?: boolean;
}

/** Maps layout column keys to form-config field `key` values. */
export const PO_LAYOUT_TO_FIELD_KEY: Record<POFormLayoutFieldKey, string> = {
  supplier: 'supplier',
  paymentTerm: 'paymentTerm',
  address: 'address',
  shipmentMode: 'shipmentMode',
  docLocation: 'docLocation',
  location: 'location',
  deliveryDate: 'deliveryDate',
  documentDate: 'documentDate',
  currency: 'currency',
  exchangeRate: 'exchangeRate',
  discount: 'discount',
  docType: 'docType',
  taxInvoiceDoc: 'taxInvoiceDoc',
  remarks: 'remarks',
  inclusiveVat: 'inclusiveVat',
};

export const PO_PRIMARY_FIELD_KEYS = new Set<POFormLayoutFieldKey>([
  'supplier',
  'paymentTerm',
  'location',
  'deliveryDate',
]);

export const PO_SECONDARY_FIELD_KEYS = new Set<POFormLayoutFieldKey>([
  'discount',
  'docType',
  'taxInvoiceDoc',
]);

/**
 * Single-screen 3-column grid — field positions match ERP mockup.
 * Row 1: Supplier | Shipment Mode | Payment Term
 * Row 2: Address (full)
 * Row 3: Delivery Date | Document Location | Location
 * Row 4: Document Date | Currency | Exchange Rate
 * Row 5: Discount | Document Type | Tax Invoice Doc
 * Row 6: Inclusive VAT
 * Row 7: Remarks (full)
 */
export const PO_FORM_GRID_ROWS: POFormGridRow[] = [
  { cols: ['supplier', 'shipmentMode', 'paymentTerm'] },
  { cols: ['address'], fullWidth: true },
  { cols: ['deliveryDate', 'docLocation', 'location'] },
  { cols: ['documentDate', 'currency', 'exchangeRate'] },
  { cols: ['discount', 'docType', 'taxInvoiceDoc'] },
  { cols: ['inclusiveVat'], checkbox: true },
  { cols: ['remarks'], fullWidth: true },
];
