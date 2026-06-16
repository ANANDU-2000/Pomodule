/*
 * YSG PO MODULE - ORACLE VIEW CONTRACT
 * Feature    : Location Lookup
 * Env key    : ORACLE_LOCATION_VIEW
 * Status     : PENDING - DB team to deliver view name
 *
 * Query the app runs:
 *   SELECT LOCN_CODE, LOCN_NAME
 *   FROM   <ORACLE_LOCATION_VIEW>
 *   WHERE  (UPPER(LOCN_CODE) LIKE :search OR UPPER(LOCN_NAME) LIKE :search)
 *   AND    ROWNUM <= 20
 *
 * Required columns:
 *   LOCN_CODE  VARCHAR2   - env: ORACLE_LOCATION_CODE_COL
 *   LOCN_NAME  VARCHAR2   - env: ORACLE_LOCATION_NAME_COL
 *
 * Activation: set ORACLE_LOCATION_VIEW=<view_name> in backend/.env
 */
export const LOCATION_LOOKUP_VIEW_DOC = 'LOCATION_LOOKUP - see comments above';
