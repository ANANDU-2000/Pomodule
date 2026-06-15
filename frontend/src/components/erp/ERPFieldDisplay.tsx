import { memo } from 'react';
import { formatDate } from '../../utils/formatters';

interface ERPFieldDisplayProps {
  label: string;
  value?: string | number | boolean | null;
  lang?: 'en' | 'th';
  isDate?: boolean;
}

function displayValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function ERPFieldDisplayInner({ label, value, isDate, lang = 'en' }: ERPFieldDisplayProps) {
  let text = displayValue(value);
  if (isDate && value && typeof value === 'string') {
    text = formatDate(value, lang);
  }

  return (
    <div className="erp-field-display">
      <dt className="erp-field-label">{label}</dt>
      <dd className="erp-field-value">{text}</dd>
    </div>
  );
}

const ERPFieldDisplay = memo(ERPFieldDisplayInner);
export default ERPFieldDisplay;
