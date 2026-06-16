/*
 * YSG PO MODULE - ORACLE VIEW CONTRACT
 * Feature    : PO Line Items
 * Env key    : ORACLE_PO_LINE_VIEW
 * Status     : PENDING - DB team to deliver view name
 *
 * Query the app runs when env is set:
 *   SELECT ITEM_CODE, ITEM_NAME, UOM, QTY, RATE,
 *          DISC_PCT, DISC_AMT, NET_VALUE, TOL_PLUS, TOL_MINUS
 *   FROM   <ORACLE_PO_LINE_VIEW>
 *   WHERE  <ORACLE_PO_LINE_DOC_COL> = :orderNo
 *
 * Default doc column : DOC_NO (override via ORACLE_PO_LINE_DOC_COL in .env)
 *
 * Required columns in the view:
 *   ITEM_CODE  VARCHAR2   - item code / barcode
 *   ITEM_NAME  VARCHAR2   - display name
 *   UOM        VARCHAR2   - unit of measure
 *   QTY        NUMBER     - ordered quantity
 *   RATE       NUMBER     - unit rate
 *   DISC_PCT   NUMBER     - discount %
 *   DISC_AMT   NUMBER     - discount amount
 *   NET_VALUE  NUMBER     - line net value
 *   TOL_PLUS   NUMBER     - tolerance + %
 *   TOL_MINUS  NUMBER     - tolerance - %
 *
 * Activation: set ORACLE_PO_LINE_VIEW=<view_name> in backend/.env
 */
export const PO_LINE_VIEW_DOC = 'PO_LINE_ITEMS - see comments above';
