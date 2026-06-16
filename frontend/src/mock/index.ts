/**
 * MOCK DATA INDEX - YSG PO Module
 *
 * Purpose: Covers features still pending from DB team.
 * All exports here are used when VITE_MOCK_PENDING=true (default in dev)
 * or VITE_MOCK_MODE=true (full offline mode).
 *
 * To switch a feature to real Oracle:
 *   1. Set the relevant ORACLE_* env key in backend/.env
 *   2. Set VITE_MOCK_PENDING=false in frontend/.env (or remove VITE_MOCK_PENDING)
 *   3. The service files call real API endpoints directly
 *
 * Files in this folder:
 *   auth.mock.ts         - Login mock (always mock until auth module delivered)
 *   suppliers.mock.ts    - Pending: ORACLE_SUPPLIER_VIEW
 *   items.mock.ts        - Pending: ORACLE_ITEM_VIEW
 *   locations.mock.ts    - Pending: ORACLE_LOCATION_VIEW
 *   paymentTerms.mock.ts - Pending: ORACLE_PAYMENT_TERM_VIEW
 *   formConfig.mock.ts   - Pending: ORACLE_FORM_CONFIG_VIEW
 *   mockStore.ts         - Pending: PO line view + write SPs
 *   delay.ts             - Simulated network delay for dev UX
 */
export { delay } from './delay';
export { mockLogin } from './auth.mock';
export { MOCK_SUPPLIERS, toSupplierLookupItem } from './suppliers.mock';
export { MOCK_ITEMS } from './items.mock';
export { MOCK_LOCATIONS } from './locations.mock';
export { MOCK_PAYMENT_TERMS } from './paymentTerms.mock';
export { MOCK_FORM_CONFIG, MOCK_SYSTEM_DEFAULTS } from './formConfig.mock';
export {
  mockFetchPurchaseOrders,
  mockFetchPODetail,
  mockFetchPOLineItems,
  mockCreatePO,
  mockUpdatePO,
  mockApprovePO,
} from './mockStore';
