import { env } from '../../config/env';

export type DbObjectType = 'view' | 'stored_procedure' | 'table' | 'function';

export interface IntegrationEntry {
  featureId: string;
  envKey: keyof typeof env & string;
  endpoint: string;
  method: string;
  sourceFile: string;
  dbObjectType: DbObjectType;
  dbReference: string;
  frontendFile: string;
  dbTeamOwner: string;
}

export const ORACLE_INTEGRATION_REGISTRY: IntegrationEntry[] = [
  {
    featureId: 'poList',
    envKey: 'ORACLE_VIEW_NAME',
    endpoint: '/api/purchase-orders',
    method: 'GET',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'view',
    dbReference: 'OV_PO_SEARCH_VIEW_YSG',
    frontendFile: 'src/pages/PurchaseOrderListPage.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'poDetail',
    envKey: 'ORACLE_VIEW_NAME',
    endpoint: '/api/purchase-orders/:id',
    method: 'GET',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'view',
    dbReference: 'OV_PO_SEARCH_VIEW_YSG',
    frontendFile: 'src/pages/PurchaseOrderViewPage.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'poLineItems',
    envKey: 'ORACLE_PO_LINE_VIEW',
    endpoint: '/api/purchase-orders/:id/items',
    method: 'GET',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'view',
    dbReference: 'PO line view by DOC_NO',
    frontendFile: 'src/pages/PurchaseOrderForm.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'poCreate',
    envKey: 'ORACLE_PO_CREATE_SP',
    endpoint: '/api/purchase-orders',
    method: 'POST',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'stored_procedure',
    dbReference: 'OT_PO_HEAD + OT_PO_ITEM',
    frontendFile: 'src/pages/PurchaseOrderForm.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'poUpdate',
    envKey: 'ORACLE_PO_UPDATE_SP',
    endpoint: '/api/purchase-orders/:id',
    method: 'PUT',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'stored_procedure',
    dbReference: 'OT_PO_HEAD + OT_PO_ITEM',
    frontendFile: 'src/pages/PurchaseOrderForm.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'poApprove',
    envKey: 'ORACLE_PO_APPROVE_SP',
    endpoint: '/api/purchase-orders/:id/approve',
    method: 'POST',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'stored_procedure',
    dbReference: 'Approve by DOC_NO',
    frontendFile: 'src/pages/PurchaseOrderForm.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'poDuplicate',
    envKey: 'ORACLE_PO_DUPLICATE_SP',
    endpoint: '/api/purchase-orders/:id/duplicate',
    method: 'POST',
    sourceFile: 'src/services/purchaseOrder.service.ts',
    dbObjectType: 'stored_procedure',
    dbReference: 'Duplicate PO (future)',
    frontendFile: 'src/pages/PurchaseOrderViewPage.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'supplierLookup',
    envKey: 'ORACLE_SUPPLIER_VIEW',
    endpoint: '/api/lookups?type=supplier',
    method: 'GET',
    sourceFile: 'src/repositories/lookup.repository.ts',
    dbObjectType: 'view',
    dbReference: 'SUPP_CODE, SUPP_NAME, SUPP_ADDR, SHIP_MODE, PAY_TERM, DOC_LOCN',
    frontendFile: 'src/components/erp/ERPLookup.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'itemLookup',
    envKey: 'ORACLE_ITEM_VIEW',
    endpoint: '/api/lookups?type=item',
    method: 'GET',
    sourceFile: 'src/repositories/lookup.repository.ts',
    dbObjectType: 'view',
    dbReference: 'OM_ITEM: ITEM_CODE, ITEM_NAME (NVL(ITEM_FRZ_FLAG_NUM,2)=2); SP ref: o_dval_item_11j',
    frontendFile: 'src/components/form/POLineItemsTable.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'itemValidate',
    envKey: 'ORACLE_ITEM_VALIDATE_SP',
    endpoint: '/api/items/:itemCode/validate',
    method: 'GET',
    sourceFile: 'src/services/itemValidate.service.ts',
    dbObjectType: 'stored_procedure',
    dbReference: 'o_dval_item_11j',
    frontendFile: 'src/services/itemValidateService.ts',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'locationLookup',
    envKey: 'ORACLE_LOCATION_VIEW',
    endpoint: '/api/lookups?type=location',
    method: 'GET',
    sourceFile: 'src/repositories/lookup.repository.ts',
    dbObjectType: 'view',
    dbReference: 'LOCN_CODE, LOCN_NAME',
    frontendFile: 'src/components/erp/ERPLookup.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'paymentTermLookup',
    envKey: 'ORACLE_PAYMENT_TERM_VIEW',
    endpoint: '/api/lookups?type=paymentTerm',
    method: 'GET',
    sourceFile: 'src/repositories/lookup.repository.ts',
    dbObjectType: 'view',
    dbReference: 'TERM_CODE, TERM_NAME, SUPP_CODE',
    frontendFile: 'src/components/erp/ERPLookup.tsx',
    dbTeamOwner: 'DB team',
  },
  {
    featureId: 'formConfig',
    envKey: 'ORACLE_FORM_CONFIG_VIEW',
    endpoint: '/api/po/form-config',
    method: 'GET',
    sourceFile: 'src/services/formConfig.service.ts',
    dbObjectType: 'view',
    dbReference: 'Form field config per role',
    frontendFile: 'src/hooks/usePOFormConfig.ts',
    dbTeamOwner: 'DB team',
  },
];

export function getRegistryEntry(featureId: string): IntegrationEntry | undefined {
  return ORACLE_INTEGRATION_REGISTRY.find((e) => e.featureId === featureId);
}

export function getEnvValueForKey(envKey: string): string {
  const record = env as Record<string, string | number | boolean>;
  const value = record[envKey];
  return typeof value === 'string' ? value : String(value ?? '');
}
