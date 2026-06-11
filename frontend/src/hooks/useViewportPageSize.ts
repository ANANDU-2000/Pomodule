import { useState, useEffect, type RefObject } from 'react';
import { PAGE_SIZE_MAX, PAGE_SIZE_MIN } from '../constants/pageSizeOptions';

const DEBOUNCE_MS = 150;

interface UseViewportPageSizeOptions {
  rowHeight?: number;
  headerHeight?: number;
}

export function useViewportPageSize(
  containerRef: RefObject<HTMLElement | null>,
  options: UseViewportPageSizeOptions = {},
) {
  const rowHeight = options.rowHeight ?? 34;
  const headerHeight = options.headerHeight ?? 36;
  const [pageSize, setPageSize] = useState(PAGE_SIZE_MIN);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const calculate = () => {
      const available = el.clientHeight - headerHeight;
      const rows = Math.floor(available / rowHeight);
      const clamped = Math.max(PAGE_SIZE_MIN, Math.min(PAGE_SIZE_MAX, rows));
      setPageSize(clamped > 0 ? clamped : PAGE_SIZE_MIN);
    };

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(calculate, DEBOUNCE_MS);
    };

    calculate();

    const observer = new ResizeObserver(schedule);
    observer.observe(el);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [containerRef, rowHeight, headerHeight]);

  return pageSize;
}
