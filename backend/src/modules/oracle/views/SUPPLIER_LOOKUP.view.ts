/*
 * YSG PO MODULE - ORACLE VIEW CONTRACT
 * Feature    : Supplier Lookup (auto-fill on supplier select)
 * Env key    : ORACLE_SUPPLIER_VIEW
 * Status     : PENDING - DB team to deliver view name
 *
 * Query the app runs:
 *   SELECT SUPP_CODE, SUPP_NAME, SUPP_ADDR, SHIP_MODE, PAY_TERM, DOC_LOCN
 *   FROM   <ORACLE_SUPPLIER_VIEW>
 *   WHERE  (UPPER(SUPP_CODE) LIKE :search OR UPPER(SUPP_NAME) LIKE :search)
 *   AND    ROWNUM <= 20
 *
 * Required columns:
 *   SUPP_CODE  VARCHAR2   - supplier code (env: ORACLE_SUPPLIER_CODE_COL)
 *   SUPP_NAME  VARCHAR2   - supplier name (env: ORACLE_SUPPLIER_NAME_COL)
 *   SUPP_ADDR  VARCHAR2   - address       (env: ORACLE_SUPPLIER_ADDR_COL)
 *   SHIP_MODE  VARCHAR2   - shipment mode (env: ORACLE_SUPPLIER_SHIP_MODE_COL)
 *   PAY_TERM   VARCHAR2   - payment term  (env: ORACLE_SUPPLIER_PAY_TERM_COL)
 *   DOC_LOCN   VARCHAR2   - doc location  (env: ORACLE_SUPPLIER_DOC_LOCN_COL)
 *
 * When supplier is selected, the frontend auto-fills:
 *   Address, Shipment Mode, Payment Term, Document Location
 *
 * Activation: set ORACLE_SUPPLIER_VIEW=<view_name> in backend/.env
 */
export const SUPPLIER_LOOKUP_VIEW_DOC = 'SUPPLIER_LOOKUP - see comments above';
