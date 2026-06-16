import type { LookupType } from '../types/formConfig';
import type { TranslationMap } from '../types/i18n';

const PLACEHOLDER_KEYS: Record<LookupType, keyof TranslationMap['form']> = {
  supplier: 'searchSupplier',
  item: 'searchItem',
  location: 'searchLocation',
  paymentTerm: 'searchPaymentTerm',
};

export function getLookupPlaceholder(type: LookupType, t: TranslationMap): string {
  const key = PLACEHOLDER_KEYS[type];
  return t.form[key] ?? t.form.lookupPlaceholder;
}
