import { useMemo } from 'react';
import type { PageActionConfig } from '../constants/pageActions';
import { MOCK_USER_PERMISSIONS } from '../constants/permissions';

/**
 * Filters page actions by the current user's permissions.
 * Swap MOCK_USER_PERMISSIONS for a real auth context later.
 */
export function usePageActions(actions: PageActionConfig[]) {
  return useMemo(
    () => actions.filter(
      (action) => !action.permission || MOCK_USER_PERMISSIONS.includes(action.permission),
    ),
    [actions],
  );
}
