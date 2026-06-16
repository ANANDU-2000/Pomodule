/** Full frontend mock — no backend required */
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

/**
 * Hybrid dev: real PO list/detail from Oracle; mock lookups, line items,
 * and create/update/approve until DB team delivers views/SPs.
 * Defaults to ON in Vite dev unless explicitly VITE_MOCK_PENDING=false.
 */
const pendingEnv = import.meta.env.VITE_MOCK_PENDING;
export const MOCK_PENDING =
  !MOCK_MODE &&
  pendingEnv !== 'false' &&
  (pendingEnv === 'true' || (pendingEnv === undefined && import.meta.env.DEV));

export const USE_MOCK_LOOKUPS = MOCK_MODE || MOCK_PENDING;
export const USE_MOCK_FORM = MOCK_MODE || MOCK_PENDING;
