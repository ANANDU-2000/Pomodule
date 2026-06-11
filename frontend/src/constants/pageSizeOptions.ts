export const PAGE_SIZE_MIN = 10;
export const PAGE_SIZE_MAX = 100;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export const AUTO_PAGE_SIZE = 0;

export const DEFAULT_PAGE_SIZE: PageSize = 10;
