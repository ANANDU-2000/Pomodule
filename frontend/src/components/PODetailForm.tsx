import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';

interface PODetailFormProps {
  value: PurchaseOrder;
  onChange?: (field: keyof PurchaseOrder, val: string | number) => void;
  readOnly?: boolean;
  t: TranslationMap;
}

const STATUS_OPTIONS: PurchaseOrder['status'][] = ['Pending', 'Approved', 'Rejected', 'Draft'];

function getStatusLabel(status: PurchaseOrder['status'], t: TranslationMap): string {
  const map: Record<PurchaseOrder['status'], string> = {
    Pending: t.status.pending,
    Approved: t.status.approved,
    Rejected: t.status.rejected,
    Draft: t.status.draft,
  };
  return map[status];
}

function PODetailForm({ value, onChange, readOnly = false, t }: PODetailFormProps) {
  const fields: { key: keyof PurchaseOrder; label: string; type?: string }[] = [
    { key: 'orderNo', label: t.columns.orderNo },
    { key: 'documentDate', label: t.columns.documentDate, type: 'date' },
    { key: 'supplierCode', label: t.columns.supplierCode },
    { key: 'supplierName', label: t.columns.supplierName },
    { key: 'location', label: t.columns.location },
    { key: 'orderValue', label: t.columns.orderValue, type: 'number' },
    { key: 'status', label: t.columns.status },
    { key: 'deliveryDate', label: t.columns.deliveryDate, type: 'date' },
    { key: 'userId', label: t.columns.userId },
    { key: 'remarks', label: t.columns.remarks },
  ];

  return (
    <div className="po-detail-form">
      {fields.map(({ key, label, type }) => (
        <div key={key} className={`po-detail-field${key === 'remarks' ? ' po-detail-field-full' : ''}`}>
          <label className="po-detail-label" htmlFor={`po-${key}`}>{label}</label>
          {readOnly ? (
            <div className="po-detail-value" id={`po-${key}`}>
              {key === 'status'
                ? getStatusLabel(value.status, t)
                : key === 'orderValue'
                  ? value.orderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : String(value[key])}
            </div>
          ) : key === 'status' ? (
            <select
              id={`po-${key}`}
              className="po-detail-input"
              value={value.status}
              onChange={(e) => onChange?.(key, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{getStatusLabel(s, t)}</option>
              ))}
            </select>
          ) : (
            <input
              id={`po-${key}`}
              className="po-detail-input"
              type={type ?? 'text'}
              value={key === 'orderValue' ? value.orderValue : String(value[key])}
              readOnly={key === 'orderNo'}
              onChange={(e) => {
                const raw = e.target.value;
                onChange?.(key, type === 'number' ? Number(raw) : raw);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default PODetailForm;
