// MOCK DATA — remove imports from services when real API is live
import type { FormConfigResponse, SystemDefaultsResponse } from '../types/formConfig';

export const MOCK_FORM_CONFIG: FormConfigResponse = {
  source: 'temporary-fallback',
  sections: [
    {
      id: 'supplierInfo',
      labelKey: 'form.supplierInfo',
      fields: [
        { key: 'supplier', apiField: 'supplierCode', type: 'lookup', lookupType: 'supplier', required: true, section: 'supplierInfo', editable: true, labelKey: 'form.supplier', validationSchema: { rules: ['required'] } },
        { key: 'address', apiField: 'address', type: 'textarea', required: true, section: 'supplierInfo', editable: false, readOnly: true, labelKey: 'form.address', validationSchema: { rules: ['required'] }, dependsOn: 'supplier' },
        { key: 'shipmentMode', apiField: 'shipmentMode', type: 'text', required: true, section: 'supplierInfo', editable: true, labelKey: 'form.shipmentMode', validationSchema: { rules: ['required'] }, dependsOn: 'supplier' },
        { key: 'paymentTerm', apiField: 'paymentTerm', type: 'lookup', lookupType: 'paymentTerm', required: true, section: 'supplierInfo', editable: true, labelKey: 'form.paymentTerm', validationSchema: { rules: ['required'] }, dependsOn: 'supplier' },
      ],
    },
    {
      id: 'documentInfo',
      labelKey: 'form.documentInfo',
      fields: [
        { key: 'docLocation', apiField: 'docLocation', type: 'text', required: true, section: 'documentInfo', editable: true, labelKey: 'form.docLocation', validationSchema: { rules: ['required'] }, dependsOn: 'supplier' },
        { key: 'location', apiField: 'locationCode', type: 'lookup', lookupType: 'location', required: true, section: 'documentInfo', editable: true, labelKey: 'form.location', validationSchema: { rules: ['required'] } },
        { key: 'documentDate', apiField: 'documentDate', type: 'date', required: true, section: 'documentInfo', editable: true, labelKey: 'form.documentDate', validationSchema: { rules: ['required', 'dateEqualsToday'] } },
        { key: 'deliveryDate', apiField: 'deliveryDate', type: 'date', required: true, section: 'documentInfo', editable: true, labelKey: 'form.deliveryDate', validationSchema: { rules: ['required'] } },
      ],
    },
    {
      id: 'financialInfo',
      labelKey: 'form.financialInfo',
      fields: [
        { key: 'currency', apiField: 'currency', type: 'text', required: true, section: 'financialInfo', editable: true, labelKey: 'form.currency', validationSchema: { rules: ['required'] }, defaultFrom: 'system.currency' },
        { key: 'exchangeRate', apiField: 'exchangeRate', type: 'number', required: true, section: 'financialInfo', editable: true, labelKey: 'form.exchangeRate', validationSchema: { rules: ['required', 'positiveNumber'] } },
        { key: 'discount', apiField: 'discount', type: 'number', required: false, section: 'financialInfo', editable: true, labelKey: 'form.discount', validationSchema: { rules: [] } },
        { key: 'inclusiveVat', apiField: 'inclusiveVat', type: 'checkbox', required: false, section: 'financialInfo', editable: true, labelKey: 'form.inclusiveVat', validationSchema: { rules: [] } },
      ],
    },
    {
      id: 'additionalInfo',
      labelKey: 'form.additionalInfo',
      fields: [
        { key: 'remarks', apiField: 'remarks', type: 'textarea', required: false, section: 'additionalInfo', editable: true, labelKey: 'form.remarks', validationSchema: { rules: [] } },
        { key: 'docType', apiField: 'docType', type: 'text', required: false, section: 'additionalInfo', editable: true, labelKey: 'form.docType', validationSchema: { rules: [] } },
        { key: 'taxInvoiceDoc', apiField: 'taxInvoiceDoc', type: 'text', required: false, section: 'additionalInfo', editable: true, labelKey: 'form.taxInvoiceDoc', validationSchema: { rules: [] } },
      ],
    },
    { id: 'itemDetails', labelKey: 'form.itemDetails', fields: [] },
  ],
};

export const MOCK_SYSTEM_DEFAULTS: SystemDefaultsResponse = {
  currency: 'THB',
  searchLimit: 20,
  itemSearchLimit: 30,
  minSearchChars: 2,
  debounceMs: 0,
};
