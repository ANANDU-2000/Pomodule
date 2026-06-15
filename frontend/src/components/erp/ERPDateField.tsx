import { memo } from 'react';
import { formatDate } from '../../utils/formatters';
import ERPInput from './ERPInput';

interface ERPDateFieldProps {
  id: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  disabled?: boolean;
  error?: boolean;
  lang?: 'en' | 'th';
}

function ERPDateFieldInner({
  id,
  value,
  onChange,
  onBlur,
  readOnly,
  disabled,
  error,
  lang = 'en',
}: ERPDateFieldProps) {
  if (readOnly) {
    return <div className="erp-field-value">{formatDate(value, lang)}</div>;
  }

  return (
    <div className="erp-date-field">
      <ERPInput
        id={id}
        type="date"
        value={value}
        disabled={disabled}
        error={error}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
}

const ERPDateField = memo(ERPDateFieldInner);
export default ERPDateField;
