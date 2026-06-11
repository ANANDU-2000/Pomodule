import {
  AUTO_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../constants/pageSizeOptions';
import type { TranslationMap } from '../types/i18n';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  isAutoPageSize: boolean;
  viewportPageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  t: TranslationMap;
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  isAutoPageSize,
  viewportPageSize,
  onPageChange,
  onPageSizeChange,
  t,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const selectValue = isAutoPageSize ? AUTO_PAGE_SIZE : pageSize;

  return (
    <div className="pagination">
      <span className="pagination-info">
        {t.pagination.showing} {start}–{end} {t.pagination.of} {total} {t.pagination.records}
      </span>
      <div className="pagination-right">
        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label={t.pagination.previousPage}
          >
            ‹
          </button>
          <span className="pagination-page-indicator" aria-live="polite">
            {totalPages === 0 ? '0/0' : `${page}/${totalPages}`}
          </span>
          <button
            type="button"
            className="pagination-btn"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            aria-label={t.pagination.nextPage}
          >
            ›
          </button>
        </div>
        <label className="pagination-size">
          <span>{t.pagination.rowsPerPage}</span>
          <select
            value={selectValue}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label={t.pagination.rowsPerPage}
          >
            <option value={AUTO_PAGE_SIZE}>
              {t.pagination.auto} ({viewportPageSize})
            </option>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default Pagination;
