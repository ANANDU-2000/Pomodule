import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';

const DATE_LOCALES: Record<string, string> = { en: 'en-GB', th: 'th-TH' };
const NUMBER_LOCALES: Record<string, string> = { en: 'en-AE', th: 'th-TH' };

export function formatDate(dateStr: string, lang: 'en' | 'th' = 'en'): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(DATE_LOCALES[lang] ?? 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(value: number, lang: 'en' | 'th' = 'en'): string {
  return new Intl.NumberFormat(NUMBER_LOCALES[lang] ?? 'en-AE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getStatusLabel(status: PurchaseOrder['status'], t: TranslationMap): string {
  const map: Record<PurchaseOrder['status'], string> = {
    Pending: t.status.pending,
    Approved: t.status.approved,
    Rejected: t.status.rejected,
    Draft: t.status.draft,
  };
  return map[status];
}
