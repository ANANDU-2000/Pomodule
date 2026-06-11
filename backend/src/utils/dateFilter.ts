import type { FilterPeriod, ResolvedFilterDates } from '../types/filter.types';

interface DatedRow {
  documentDate: string;
}

function formatIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDateRange(filter: FilterPeriod): { from: Date | null; to: Date | null } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  switch (filter) {
    case 'today':
      return { from: today, to: todayEnd };
    case 'yesterday': {
      const from = new Date(today);
      from.setDate(from.getDate() - 1);
      const to = new Date(from);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case 'this_week': {
      const from = new Date(today);
      from.setDate(from.getDate() - from.getDay());
      return { from, to: todayEnd };
    }
    case 'last_week': {
      const from = new Date(today);
      from.setDate(from.getDate() - from.getDay() - 7);
      const to = new Date(from);
      to.setDate(to.getDate() + 6);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case 'this_month': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from, to: todayEnd };
    }
    case 'last_month': {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    default:
      return { from: null, to: null };
  }
}

/**
 * Converts filter enum → ISO date strings for Oracle P_FROM_DATE / P_TO_DATE.
 * Single source of truth — frontend sends filter key only.
 */
export function resolveFilterDates(filter: string): ResolvedFilterDates {
  const period = filter as FilterPeriod;
  if (period === 'all' || period === 'none') {
    return { fromDate: '', toDate: '' };
  }
  const { from, to } = getDateRange(period);
  if (!from || !to) {
    return { fromDate: '', toDate: '' };
  }
  return { fromDate: formatIsoDate(from), toDate: formatIsoDate(to) };
}

export function filterByDatePeriod<T extends DatedRow>(data: T[], filter: string): T[] {
  const period = filter as FilterPeriod;
  if (period === 'all') return data;
  if (period === 'none') return [];

  const { from, to } = getDateRange(period);
  if (!from || !to) return data;

  return data.filter((row) => {
    const d = new Date(row.documentDate);
    return d >= from && d <= to;
  });
}
