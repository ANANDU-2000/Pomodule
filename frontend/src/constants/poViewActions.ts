import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';

export type POViewActionId = 'approve' | 'edit';

export interface POViewActionConfig {
  id: POViewActionId;
  label: string;
  permission?: string;
  variant: 'primary' | 'default' | 'success';
  visible: (order: PurchaseOrder) => boolean;
}

export function getPoViewPageActions(t: TranslationMap): POViewActionConfig[] {
  return [
    {
      id: 'approve',
      label: t.actions.approve,
      permission: 'PO_APPROVE',
      variant: 'success',
      visible: (order) => order.status === 'Pending' || order.status === 'Draft',
    },
    {
      id: 'edit',
      label: t.form.edit,
      variant: 'default',
      visible: (order) => order.status !== 'Approved',
    },
  ];
}

export function getVisiblePoViewActions(
  actions: POViewActionConfig[],
  order: PurchaseOrder,
  permissions: string[],
): POViewActionConfig[] {
  return actions.filter((action) => {
    if (action.permission && !permissions.includes(action.permission)) return false;
    return action.visible(order);
  });
}
