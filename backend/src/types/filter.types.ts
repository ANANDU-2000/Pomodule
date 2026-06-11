export const FILTER_PERIODS = [
  'today',
  'yesterday',
  'last_week',
  'this_week',
  'this_month',
  'last_month',
  'all',
  'none',
] as const;

export type FilterPeriod = (typeof FILTER_PERIODS)[number];

export interface ResolvedFilterDates {
  fromDate: string;
  toDate: string;
}
