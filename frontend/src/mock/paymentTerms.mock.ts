// MOCK DATA — remove imports from services when real API is live
import type { LookupItem } from '../types/formConfig';

export interface MockPaymentTerm extends LookupItem {
  supplierCode?: string;
}

export const MOCK_PAYMENT_TERMS: MockPaymentTerm[] = [
  { code: 'NET30', name: 'Net 30 Days' },
  { code: 'NET45', name: 'Net 45 Days' },
  { code: 'NET60', name: 'Net 60 Days' },
  { code: 'COD', name: 'Cash on Delivery' },
  { code: 'NET30', name: 'Net 30 Days (SUP001)', supplierCode: 'SUP001' },
  { code: 'NET60', name: 'Net 60 Days (SUP002)', supplierCode: 'SUP002' },
  { code: 'NET30', name: 'Net 30 Days (SUP016)', supplierCode: 'SUP016' },
  { code: 'NET45', name: 'Net 45 Days (SUP017)', supplierCode: 'SUP017' },
  { code: 'NET30', name: 'Net 30 Days (SUP018)', supplierCode: 'SUP018' },
];

export function getPaymentTermLabel(code: string, supplierCode?: string): string {
  const normalized = code.trim().toUpperCase();
  const match = MOCK_PAYMENT_TERMS.find(
    (term) =>
      term.code.toUpperCase() === normalized &&
      (!supplierCode || !term.supplierCode || term.supplierCode === supplierCode),
  );
  return match?.name ?? code;
}
