import { memo, type CSSProperties } from 'react';
import type { ColumnConfig, PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { formatDate, formatCurrency } from '../utils/formatters';
import { TABLE_MIN_WIDTH } from '../data/poColumns';
import IconButton from './IconButton';

interface DataTableProps {
  columns: ColumnConfig[];
  data: PurchaseOrder[];
  loading: boolean;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  onView: (row: PurchaseOrder) => void;
  onEdit: (row: PurchaseOrder) => void;
  t: TranslationMap;
  fillHeight?: boolean;
  skeletonRowCount?: number;
}

const STATUS_CLASS: Record<PurchaseOrder['status'], string> = {
  Pending: 'status-pending',
  Approved: 'status-approved',
  Rejected: 'status-rejected',
  Draft: 'status-draft',
};

const TOOLTIP_COLUMNS = new Set(['supplierName', 'remarks']);

function getStatusLabel(status: PurchaseOrder['status'], t: TranslationMap): string {
  const map: Record<PurchaseOrder['status'], string> = {
    Pending: t.status.pending,
    Approved: t.status.approved,
    Rejected: t.status.rejected,
    Draft: t.status.draft,
  };
  return map[status];
}

function SortIndicator({ columnKey, sortBy, sortDirection }: {
  columnKey: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}) {
  if (sortBy !== columnKey) return <span className="sort-icon sort-neutral">↕</span>;
  return <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
}

function TruncatedCell({ text, showTooltip }: { text: string; showTooltip: boolean }) {
  if (!showTooltip || !text) return <>{text}</>;
  return <span className="truncated-cell" title={text}>{text}</span>;
}

function SkeletonRows({ colCount, rowCount }: { colCount: number; rowCount: number }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr key={i} className="skeleton-row">
          {Array.from({ length: colCount }).map((__, j) => (
            <td key={j}><div className="skeleton-cell" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ActionCell({
  row,
  onView,
  onEdit,
  t,
}: {
  row: PurchaseOrder;
  onView: (row: PurchaseOrder) => void;
  onEdit: (row: PurchaseOrder) => void;
  t: TranslationMap;
}) {
  return (
    <div className="action-buttons">
      <IconButton
        variant="ghost"
        title={`${t.actions.view} ${row.orderNo}`}
        aria-label={`${t.actions.view} ${row.orderNo}`}
        onClick={() => onView(row)}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      />
      <IconButton
        variant="ghost"
        title={`${t.actions.edit} ${row.orderNo}`}
        aria-label={`${t.actions.edit} ${row.orderNo}`}
        onClick={() => onEdit(row)}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        }
      />
    </div>
  );
}

function renderCell(
  col: ColumnConfig,
  row: PurchaseOrder,
  onView: (row: PurchaseOrder) => void,
  onEdit: (row: PurchaseOrder) => void,
  t: TranslationMap,
) {
  if (col.key === 'actions') {
    return <ActionCell row={row} onView={onView} onEdit={onEdit} t={t} />;
  }
  if (col.key === 'orderValue') return formatCurrency(row.orderValue);
  if (col.key === 'documentDate' || col.key === 'deliveryDate') return formatDate(row[col.key]);
  if (col.key === 'status') {
    return (
      <span className={`status-badge ${STATUS_CLASS[row.status]}`}>
        {getStatusLabel(row.status, t)}
      </span>
    );
  }
  const text = row[col.key as keyof PurchaseOrder] as string;
  const showTooltip = TOOLTIP_COLUMNS.has(col.key) || text.length > 24;
  return <TruncatedCell text={text} showTooltip={showTooltip} />;
}

function DataTableInner({
  columns,
  data,
  loading,
  sortBy,
  sortDirection,
  onSort,
  onView,
  onEdit,
  t,
  fillHeight = false,
  skeletonRowCount = 10,
}: DataTableProps) {
  const wrapperClass = `data-table-wrapper${fillHeight ? ' po-table-fill' : ''}`;
  const tableStyle = { '--table-min-width': `${TABLE_MIN_WIDTH}px` } as CSSProperties;

  return (
    <div className={wrapperClass} style={tableStyle}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${col.sortable ? 'sortable' : ''}${col.align ? ` align-${col.align}` : ''}`}
                style={{ width: col.width }}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
                aria-sort={sortBy === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span className="th-content">
                  {col.label}
                  {col.sortable && (
                    <SortIndicator columnKey={col.key} sortBy={sortBy} sortDirection={sortDirection} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows colCount={columns.length} rowCount={skeletonRowCount} />
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty-state">{t.empty.noResults}</div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.orderNo}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      col.align ? `align-${col.align}` : '',
                      col.key === 'orderValue' ? 'col-numeric' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ maxWidth: col.width }}
                  >
                    {renderCell(col, row, onView, onEdit, t)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const DataTable = memo(DataTableInner);
export default DataTable;
