import type { TranslationMap } from '../types/i18n';

export interface PageActionConfig {
  id: string;
  label: string;
  permission?: string;
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
