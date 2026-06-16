/*
 * YSG PO MODULE - ORACLE VIEW CONTRACT
 * Feature    : Payment Term Lookup (filtered by selected supplier)
 * Env key    : ORACLE_PAYMENT_TERM_VIEW
 * Status     : PENDING - DB team to deliver view name
 *
 * Query the app runs:
 *   SELECT TERM_CODE, TERM_NAME
 *   FROM   <ORACLE_PAYMENT_TERM_VIEW>
 *   WHERE  SUPP_CODE = :supplierCode
 *   AND    (UPPER(TERM_CODE) LIKE :search OR UPPER(TERM_NAME) LIKE :search)
 *   AND    ROWNUM <= 20
 *
 * Required columns:
 *   TERM_CODE  VARCHAR2   - env: ORACLE_PAYMENT_TERM_CODE_COL
 *   TERM_NAME  VARCHAR2   - env: ORACLE_PAYMENT_TERM_NAME_COL
 *   SUPP_CODE  VARCHAR2   - env: ORACLE_PAYMENT_TERM_SUPP_COL
 *
 * Activation: set ORACLE_PAYMENT_TERM_VIEW=<view_name> in backend/.env
 * Note: when supplier not yet selected, this lookup returns empty (503 guard in code)
 */
export const PAYMENT_TERM_VIEW_DOC = 'PAYMENT_TERM_LOOKUP - see comments above';
