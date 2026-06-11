/** Date filter periods — must match frontend FilterPeriod and validateQuery enum. */
export type FilterPeriod =
  | 'today'
  | 'yesterday'
  | 'last_week'
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'all'
  | 'none';

export interface ResolvedFilterDates {
  fromDate: string;
  toDate: string;
}
