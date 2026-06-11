import type { FilterOption } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';

export function getFilterOptions(t: TranslationMap): FilterOption[] {
  return [
    { value: 'today', label: t.filters.today },
    { value: 'yesterday', label: t.filters.yesterday },
    { value: 'last_week', label: t.filters.lastWeek },
    { value: 'this_week', label: t.filters.thisWeek },
    { value: 'this_month', label: t.filters.thisMonth },
    { value: 'last_month', label: t.filters.lastMonth },
    { value: 'all', label: t.filters.all },
    { value: 'none', label: t.filters.none },
  ];
}
