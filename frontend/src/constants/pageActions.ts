import type { TranslationMap } from '../types/i18n';

export interface PageActionConfig {
  id: string;
  label: string;
  /** Permission code checked against user roles — omit to always show. */
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
