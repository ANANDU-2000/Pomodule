import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { resolvePOPermissions } from '../hooks/usePOPermissions';
import { DEFAULT_USER_PERMISSIONS } from './permissions';

export type POViewActionId = 'approve' | 'edit' | 'print';

export interface POViewActionConfig {
  id: POViewActionId;
  label: string;
  permission?: keyof ReturnType<typeof resolvePOPermissions>;
  variant: 'primary' | 'default' | 'success';
}

export function getPoViewPageActions(t: TranslationMap): POViewActionConfig[] {
  return [
    {
      id: 'approve',
      label: t.actions.approve,
      permission: 'canApprove',
      variant: 'success',
    },
    {
      id: 'edit',
      label: t.form.edit,
      permission: 'canEdit',
      variant: 'default',
    },
    {
      id: 'print',
      label: t.form.print,
      permission: 'canPrint',
      variant: 'default',
    },
  ];
}

export function getVisiblePoViewActions(
  actions: POViewActionConfig[],
  order: PurchaseOrder,
  permissions: string[] = DEFAULT_USER_PERMISSIONS,
): POViewActionConfig[] {
  const flags = resolvePOPermissions(order, permissions);
  return actions.filter((action) => {
    if (!action.permission) return true;
    return flags[action.permission];
  });
}
