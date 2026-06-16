import type { FormFieldDef, LookupItem } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import {
  TextField,
  NumberInput,
  ERPTextarea,
  Checkbox,
  DatePicker,
  SearchSelect,
  ERPFieldDisplay,
} from '../erp';
import { getLookupPlaceholder } from '../../utils/lookupPlaceholders';
import { getFieldDisplayValue, isFieldDisabled } from './formFieldUtils';

type FormValues = Record<string, string | number | boolean>;

interface FormFieldCellProps {
  field: FormFieldDef;
  values: FormValues;
  errors?: Record<string, string[]>;
  readOnly?: boolean;
  onChange: (apiField: string, value: string | number | boolean) => void;
  onLookupSelect?: (field: FormFieldDef, item: LookupItem) => void;
  onFieldBlur?: (apiField: string) => void;
  t: TranslationMap;
  getLabel: (labelKey: string) => string;
  lang?: 'en' | 'th';
  labelTone?: 'primary' | 'secondary' | 'default';
  className?: string;
}

export default function FormFieldCell({
  field,
  values,
  errors,
  readOnly,
  onChange,
  onLookupSelect,
  onFieldBlur,
  t,
  getLabel,
  lang = 'en',
  labelTone = 'default',
  className = '',
}: FormFieldCellProps) {
  const disabled = isFieldDisabled(field, values, readOnly);
  const fieldError = errors?.[field.apiField]?.[0];
  const label = getLabel(field.labelKey);
  const isFullWidth = field.type === 'textarea' || field.type === 'checkbox';
  const labelClass = `erp-form-label erp-form-label-${labelTone}`;
  const fieldClass = `erp-form-field${isFullWidth ? ' erp-form-field-full' : ''}${field.type === 'checkbox' ? ' erp-form-field-checkbox' : ''} ${className}`.trim();

  if (readOnly) {
    return (
      <ERPFieldDisplay
        label={label}
        value={getFieldDisplayValue(field, values)}
        isDate={field.type === 'date'}
        lang={lang}
      />
    );
  }

  if (field.type === 'lookup') {
    return (
      <div className={fieldClass} data-field-error={fieldError ? 'true' : undefined}>
        <label className={labelClass} htmlFor={field.key}>
          {label}
          {field.required && <span className="erp-required">*</span>}
        </label>
        <SearchSelect
          id={field.key}
          type={(field.lookupType ?? 'supplier') as 'supplier' | 'item' | 'location' | 'paymentTerm'}
          value={String(values[field.apiField] ?? '')}
          displayValue={
            field.apiField === 'supplierCode'
              ? String(values.supplierName ?? '')
              : field.apiField === 'locationCode'
                ? String(values.location ?? '')
                : String(values[field.apiField] ?? '')
          }
          disabled={disabled}
          error={Boolean(fieldError)}
          supplierCode={field.lookupType === 'paymentTerm' ? String(values.supplierCode ?? '') : undefined}
          placeholder={getLookupPlaceholder(
            (field.lookupType ?? 'supplier') as 'supplier' | 'item' | 'location' | 'paymentTerm',
            t,
          )}
          t={t}
          onSelect={(item) => onLookupSelect?.(field, item)}
          onClear={() => {
            if (field.apiField === 'supplierCode') {
              onChange('supplierCode', '');
              onChange('supplierName', '');
              onChange('address', '');
              onChange('shipmentMode', '');
              onChange('paymentTerm', '');
              onChange('docLocation', '');
              onChange('locationCode', '');
              onChange('location', '');
            } else if (field.apiField === 'locationCode') {
              onChange('locationCode', '');
              onChange('location', '');
            } else {
              onChange(field.apiField, '');
            }
          }}
        />
        {fieldError && (
          <span className="erp-field-error" id={`${field.key}-error`} role="alert">
            {fieldError}
          </span>
        )}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className={fieldClass} data-field-error={fieldError ? 'true' : undefined}>
        <label className={labelClass} htmlFor={field.key}>
          {label}
          {field.required && <span className="erp-required">*</span>}
        </label>
        <ERPTextarea
          id={field.key}
          value={String(values[field.apiField] ?? '')}
          disabled={disabled}
          error={Boolean(fieldError)}
          rows={field.apiField === 'address' || field.apiField === 'remarks' ? 1 : 2}
          className={
            field.apiField === 'address'
              ? 'erp-textarea-address'
              : field.apiField === 'remarks'
                ? 'erp-textarea-remarks'
                : undefined
          }
          onChange={(e) => onChange(field.apiField, e.target.value)}
          onBlur={() => onFieldBlur?.(field.apiField)}
          aria-describedby={fieldError ? `${field.key}-error` : undefined}
        />
        {fieldError && (
          <span className="erp-field-error" id={`${field.key}-error`} role="alert">
            {fieldError}
          </span>
        )}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div className={fieldClass}>
        <Checkbox
          id={field.key}
          label={label}
          checked={Boolean(values[field.apiField])}
          disabled={disabled}
          onChange={(e) => onChange(field.apiField, e.target.checked)}
        />
        {fieldError && (
          <span className="erp-field-error" id={`${field.key}-error`} role="alert">
            {fieldError}
          </span>
        )}
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div className={fieldClass} data-field-error={fieldError ? 'true' : undefined}>
        <label className={labelClass} htmlFor={field.key}>
          {label}
          {field.required && <span className="erp-required">*</span>}
        </label>
        <DatePicker
          id={field.key}
          value={String(values[field.apiField] ?? '')}
          disabled={disabled}
          error={Boolean(fieldError)}
          lang={lang}
          onChange={(v) => onChange(field.apiField, v)}
          onBlur={() => onFieldBlur?.(field.apiField)}
        />
        {fieldError && (
          <span className="erp-field-error" id={`${field.key}-error`} role="alert">
            {fieldError}
          </span>
        )}
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div className={fieldClass} data-field-error={fieldError ? 'true' : undefined}>
        <label className={labelClass} htmlFor={field.key}>
          {label}
          {field.required && <span className="erp-required">*</span>}
        </label>
        <NumberInput
          id={field.key}
          value={Number(values[field.apiField] ?? 0)}
          disabled={disabled}
          error={Boolean(fieldError)}
          onChange={(e) => onChange(field.apiField, Number(e.target.value))}
          onBlur={() => onFieldBlur?.(field.apiField)}
          aria-describedby={fieldError ? `${field.key}-error` : undefined}
        />
        {fieldError && (
          <span className="erp-field-error" id={`${field.key}-error`} role="alert">
            {fieldError}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={fieldClass} data-field-error={fieldError ? 'true' : undefined}>
      <label className={labelClass} htmlFor={field.key}>
        {label}
        {field.required && <span className="erp-required">*</span>}
      </label>
      <TextField
        id={field.key}
        value={String(values[field.apiField] ?? '')}
        disabled={disabled}
        error={Boolean(fieldError)}
        onChange={(e) => onChange(field.apiField, e.target.value)}
        onBlur={() => onFieldBlur?.(field.apiField)}
        aria-describedby={fieldError ? `${field.key}-error` : undefined}
      />
      {fieldError && (
        <span className="erp-field-error" id={`${field.key}-error`} role="alert">
          {fieldError}
        </span>
      )}
    </div>
  );
}
