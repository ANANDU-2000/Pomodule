import { useCallback, useRef, type KeyboardEvent } from 'react';

export const LINE_GRID_COLS = ['itemCode', 'uom', 'quantity', 'rate'] as const;

export type LineGridCol = (typeof LINE_GRID_COLS)[number];

interface LineGridNavigationOptions {
  pageSize?: number;
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
}

function cellSelector(row: number, col: LineGridCol): string {
  return `[data-grid-row="${row}"][data-grid-col="${col}"]`;
}

export function useLineItemGridNavigation(rowCount: number, options?: LineGridNavigationOptions) {
  const addLineRef = useRef<HTMLButtonElement>(null);

  const focusCellElement = useCallback((row: number, col: LineGridCol) => {
    const el = document.querySelector<HTMLElement>(cellSelector(row, col));
    if (el) {
      el.focus();
      if (el instanceof HTMLInputElement) {
        el.select();
      }
    }
  }, []);

  const focusCell = useCallback(
    (row: number, col: LineGridCol) => {
      const { pageSize, pageIndex, setPageIndex } = options ?? {};
      if (pageSize && setPageIndex !== undefined && pageIndex !== undefined) {
        const targetPage = Math.floor(row / pageSize);
        if (targetPage !== pageIndex) {
          setPageIndex(targetPage);
          requestAnimationFrame(() => focusCellElement(row, col));
          return;
        }
      }
      focusCellElement(row, col);
    },
    [focusCellElement, options],
  );

  const getNextPosition = useCallback(
    (row: number, col: LineGridCol, direction: 1 | -1): { row: number; col: LineGridCol } | null => {
      const colIndex = LINE_GRID_COLS.indexOf(col);
      let nextCol = colIndex + direction;
      let nextRow = row;

      if (nextCol >= LINE_GRID_COLS.length) {
        nextCol = 0;
        nextRow += 1;
      } else if (nextCol < 0) {
        nextCol = LINE_GRID_COLS.length - 1;
        nextRow -= 1;
      }

      if (nextRow < 0 || nextRow >= rowCount) return null;
      return { row: nextRow, col: LINE_GRID_COLS[nextCol] };
    },
    [rowCount],
  );

  const focusNext = useCallback(
    (row: number, col: LineGridCol) => {
      const next = getNextPosition(row, col, 1);
      if (next) {
        focusCell(next.row, next.col);
      } else if (row === rowCount - 1 && col === LINE_GRID_COLS[LINE_GRID_COLS.length - 1]) {
        addLineRef.current?.focus();
      }
    },
    [focusCell, getNextPosition, rowCount],
  );

  const handleGridKeyDown = useCallback(
    (e: KeyboardEvent, row: number, col: LineGridCol) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const next = getNextPosition(row, col, e.shiftKey ? -1 : 1);
        if (next) focusCell(next.row, next.col);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        focusNext(row, col);
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = getNextPosition(row, col, 1);
        if (next && next.row === row) focusCell(next.row, next.col);
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = getNextPosition(row, col, -1);
        if (next && next.row === row) focusCell(next.row, next.col);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (row + 1 < rowCount) focusCell(row + 1, col);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (row > 0) focusCell(row - 1, col);
      }
    },
    [focusCell, focusNext, getNextPosition, rowCount],
  );

  return { handleGridKeyDown, focusNext, focusCell, addLineRef };
}
