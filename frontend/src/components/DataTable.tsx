import { memo, type CSSProperties, type KeyboardEvent } from 'react';
import type { ColumnConfig, PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { formatDate, formatCurrency, getStatusLabel } from '../utils/formatters';
import { TABLE_MIN_WIDTH } from '../data/poColumns';
import IconButton from './IconButton';
import {
  AppIcon,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  ICON_SIZE_ACTION,
  ICON_SIZE_SORT,
  Pencil,
} from './icons';

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
  lang?: 'en' | 'th';
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

function SortIndicator({ columnKey, sortBy, sortDirection }: {
  columnKey: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}) {
  if (sortBy !== columnKey) {
    return (
      <span className="sort-icon sort-neutral">
        <AppIcon icon={ArrowUpDown} size={ICON_SIZE_SORT} />
      </span>
    );
  }
  return (
    <span className="sort-icon">
      <AppIcon icon={sortDirection === 'asc' ? ArrowUp : ArrowDown} size={ICON_SIZE_SORT} />
    </span>
  );
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
    <div className="action-buttons" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <IconButton
        variant="ghost"
        title={`${t.actions.view} ${row.orderNo}`}
        aria-label={`${t.actions.view} ${row.orderNo}`}
        onClick={(e) => {
          e.stopPropagation();
          onView(row);
        }}
        icon={<AppIcon icon={Eye} size={ICON_SIZE_ACTION} />}
      />
      {row.status !== 'Approved' && (
        <IconButton
          variant="ghost"
          title={`${t.actions.edit} ${row.orderNo}`}
          aria-label={`${t.actions.edit} ${row.orderNo}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
          icon={<AppIcon icon={Pencil} size={ICON_SIZE_ACTION} />}
        />
      )}
    </div>
  );
}

function renderCell(
  col: ColumnConfig,
  row: PurchaseOrder,
  onView: (row: PurchaseOrder) => void,
  onEdit: (row: PurchaseOrder) => void,
  t: TranslationMap,
  lang: 'en' | 'th',
) {
  if (col.key === 'actions') {
    return <ActionCell row={row} onView={onView} onEdit={onEdit} t={t} />;
  }
  if (col.key === 'orderValue') return formatCurrency(row.orderValue, lang);
  if (col.key === 'documentDate' || col.key === 'deliveryDate') return formatDate(row[col.key], lang);
  if (col.key === 'status') {
    return (
      <span className={`status-badge ${STATUS_CLASS[row.status]}`} role="status">
        {getStatusLabel(row.status, t)}
      </span>
    );
  }
  const text = row[col.key as keyof PurchaseOrder] as string;
  const showTooltip = TOOLTIP_COLUMNS.has(col.key) || text.length > 24;
  return <TruncatedCell text={text} showTooltip={showTooltip} />;
}

function getCellClassName(col: ColumnConfig): string {
  return [
    col.align ? `align-${col.align}` : '',
    col.key === 'orderValue' ? 'col-numeric' : '',
    col.key === 'orderNo' ? 'col-order-no' : '',
    col.key === 'actions' ? 'col-sticky-end' : '',
  ].filter(Boolean).join(' ');
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
  lang = 'en',
  fillHeight = false,
  skeletonRowCount = 10,
}: DataTableProps) {
  const wrapperClass = `data-table-wrapper${fillHeight ? ' po-table-fill' : ''}`;
  const tableStyle = { '--table-min-width': `${TABLE_MIN_WIDTH}px` } as CSSProperties;

  const handleSortKeyDown = (e: KeyboardEvent, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSort(key);
    }
  };

  const handleRowKeyDown = (e: KeyboardEvent, row: PurchaseOrder) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onView(row);
    }
  };

  return (
    <div className={wrapperClass} style={tableStyle}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${col.sortable ? 'sortable' : ''}${col.align ? ` align-${col.align}` : ''}${col.key === 'actions' ? ' col-sticky-end' : ''}`}
                style={{ width: col.width }}
                scope="col"
                aria-sort={
                  col.sortable && sortBy === col.key
                    ? (sortDirection === 'asc' ? 'ascending' : 'descending')
                    : col.sortable
                      ? 'none'
                      : undefined
                }
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="th-sort-btn"
                    onClick={() => onSort(col.key)}
                    onKeyDown={(e) => handleSortKeyDown(e, col.key)}
                  >
                    <span className="th-content">
                      {col.label}
                      <SortIndicator columnKey={col.key} sortBy={sortBy} sortDirection={sortDirection} />
                    </span>
                  </button>
                ) : (
                  <span className="th-content">{col.label}</span>
                )}
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
              <tr
                key={row.orderNo}
                className="data-row"
                onClick={() => onView(row)}
                tabIndex={0}
                onKeyDown={(e) => handleRowKeyDown(e, row)}
                aria-label={`${t.actions.view} ${row.orderNo}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={getCellClassName(col)}
                    style={{ maxWidth: col.width }}
                  >
                    {renderCell(col, row, onView, onEdit, t, lang)}
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
