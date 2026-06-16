import type { TranslationMap } from '../types/i18n';
import type { Permission } from './permissions';

export interface PageActionConfig {
  id: string;
  label: string;
  permission?: Permission;
  variant?: 'primary' | 'default';
}

export function getPoListPageActions(t: TranslationMap): PageActionConfig[] {
  return [
    {
      id: 'new-purchase-order',
      label: t.actions.addPurchaseOrder,
      permission: 'PO_CREATE',
      variant: 'primary',
    },
  ];
}
