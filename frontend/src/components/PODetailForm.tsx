import { useMemo, type ReactNode } from 'react';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { formatDate, getStatusLabel } from '../utils/formatters';

const STATUS_CLASS: Record<PurchaseOrder['status'], string> = {
  Pending: 'status-pending',
  Approved: 'status-approved',
  Rejected: 'status-rejected',
  Draft: 'status-draft',
};

const STATUS_OPTIONS: PurchaseOrder['status'][] = ['Draft', 'Pending', 'Approved', 'Rejected'];

const SYSTEM_FIELDS = new Set<keyof PurchaseOrder>(['orderNo', 'userId']);

const REQUIRED_FIELDS = new Set<keyof PurchaseOrder>([
  'supplierCode',
  'supplierName',
  'location',
  'orderValue',
  'deliveryDate',
]);

interface FieldDef {
  key: keyof PurchaseOrder;
  label: string;
  type?: 'text' | 'date' | 'number';
  fullWidth?: boolean;
}

interface PODetailFormProps {
  value: PurchaseOrder;
  onChange?: (field: keyof PurchaseOrder, val: string | number) => void;
  readOnly?: boolean;
  t: TranslationMap;
  lang?: 'en' | 'th';
}

function renderReadOnlyValue(
  field: FieldDef,
  value: PurchaseOrder,
  t: TranslationMap,
  lang: 'en' | 'th',
) {
  if (field.key === 'status') {
    return (
      <span className={`status-badge ${STATUS_CLASS[value.status]}`} role="status">
        {getStatusLabel(value.status, t)}
      </span>
    );
  }
  if (field.key === 'documentDate' || field.key === 'deliveryDate') {
    return formatDate(String(value[field.key]), lang);
  }
  if (field.key === 'orderValue') {
    return value.orderValue.toLocaleString('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return String(value[field.key]) || '—';
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="po-form-section">
      <h3 className="po-form-section-title">{title}</h3>
      <div className="po-detail-form">{children}</div>
    </div>
  );
}

function PODetailForm({
  value,
  onChange,
  readOnly = false,
  t,
  lang = 'en',
}: PODetailFormProps) {
  const orderFields: FieldDef[] = useMemo(() => [
    { key: 'orderNo', label: t.columns.orderNo },
    { key: 'documentDate', label: t.columns.documentDate, type: 'date' },
    { key: 'supplierCode', label: t.columns.supplierCode },
    { key: 'supplierName', label: t.columns.supplierName },
    { key: 'location', label: t.columns.location },
    { key: 'orderValue', label: t.columns.orderValue, type: 'number' },
  ], [t]);

  const deliveryFields: FieldDef[] = useMemo(() => [
    { key: 'status', label: t.columns.status },
    { key: 'deliveryDate', label: t.columns.deliveryDate, type: 'date' },
    { key: 'userId', label: t.columns.userId },
    { key: 'remarks', label: t.columns.remarks, fullWidth: true },
  ], [t]);

  const renderField = (field: FieldDef) => {
    const isRequired = REQUIRED_FIELDS.has(field.key);
    const isSystemField = SYSTEM_FIELDS.has(field.key);
    const effectiveReadOnly = readOnly || isSystemField;

    return (
      <div key={field.key} className={`po-detail-field${field.fullWidth ? ' po-detail-field-full' : ''}`}>
        <label className="po-detail-label" htmlFor={`po-${field.key}`}>
          {field.label}
          {!readOnly && isRequired && (
            <span className="po-field-required" aria-label="required"> *</span>
          )}
        </label>

        {effectiveReadOnly ? (
          <div className="po-detail-value" id={`po-${field.key}`}>
            {renderReadOnlyValue(field, value, t, lang)}
          </div>
        ) : field.key === 'status' ? (
          <select
            id={`po-${field.key}`}
            className="po-detail-input form-select"
            value={value.status}
            onChange={(e) => onChange?.(field.key, e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{getStatusLabel(s, t)}</option>
            ))}
          </select>
        ) : (
          <input
            id={`po-${field.key}`}
            className="po-detail-input"
            type={field.type ?? 'text'}
            value={field.key === 'orderValue' ? value.orderValue : String(value[field.key])}
            readOnly={isSystemField}
            required={isRequired}
            onChange={(e) => {
              const rawValue = e.target.value;
              onChange?.(field.key, field.type === 'number' ? Number(rawValue) : rawValue);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="po-detail-card">
      <FormSection title="Order Details">
        {orderFields.map(renderField)}
      </FormSection>
      <FormSection title="Delivery & Notes">
        {deliveryFields.map(renderField)}
      </FormSection>
    </div>
  );
}

export default PODetailForm;
