import type { FormFieldDef } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import type { LookupItem } from '../../types/formConfig';
import {
  ERPInput,
  ERPTextarea,
  ERPCheckbox,
  ERPDateField,
  ERPLookup,
  ERPFieldDisplay,
} from '../erp';

type FormValues = Record<string, string | number | boolean>;

interface DynamicFormRendererProps {
  fields: FormFieldDef[];
  values: FormValues;
  errors?: Record<string, string[]>;
  readOnly?: boolean;
  onChange: (apiField: string, value: string | number | boolean) => void;
  onLookupSelect?: (field: FormFieldDef, item: LookupItem) => void;
  onFieldBlur?: (apiField: string) => void;
  t: TranslationMap;
  getLabel: (labelKey: string) => string;
  lang?: 'en' | 'th';
}

function isFieldDisabled(field: FormFieldDef, values: FormValues, readOnly?: boolean): boolean {
  if (readOnly || field.readOnly) return true;
  if (!field.editable) return true;
  if (field.dependsOn && !values[field.dependsOn === 'supplier' ? 'supplierCode' : field.dependsOn]) {
    return true;
  }
  return false;
}

function getDisplayValue(field: FormFieldDef, values: FormValues): string | number | boolean {
  if (field.apiField === 'supplierCode') return String(values.supplierName ?? values.supplierCode ?? '');
  if (field.apiField === 'locationCode') return String(values.location ?? values.locationCode ?? '');
  return values[field.apiField] as string | number | boolean;
}

export default function DynamicFormRenderer({
  fields,
  values,
  errors,
  readOnly,
  onChange,
  onLookupSelect,
  onFieldBlur,
  t,
  getLabel,
  lang = 'en',
}: DynamicFormRendererProps) {
  return (
    <div className={readOnly ? 'erp-info-grid' : 'erp-field-grid'}>
      {fields.map((field) => {
        const disabled = isFieldDisabled(field, values, readOnly);
        const fieldError = errors?.[field.apiField]?.[0];
        const label = getLabel(field.labelKey);
        const isFullWidth = field.type === 'textarea';

        if (readOnly) {
          return (
            <ERPFieldDisplay
              key={field.key}
              label={label}
              value={getDisplayValue(field, values)}
              isDate={field.type === 'date'}
              lang={lang}
            />
          );
        }

        if (field.type === 'lookup') {
          return (
            <div
              key={field.key}
              className={`erp-form-field${isFullWidth ? ' erp-form-field-full' : ''}`}
              data-field-error={fieldError ? 'true' : undefined}
            >
              <label className="erp-form-label" htmlFor={field.key}>
                {label}
                {field.required && <span className="erp-required">*</span>}
              </label>
              <ERPLookup
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
                t={t}
                onSelect={(item) => onLookupSelect?.(field, item)}
                onClear={() => {
                  if (field.apiField === 'supplierCode') {
                    onChange('supplierCode', '');
                    onChange('supplierName', '');
                  } else if (field.apiField === 'locationCode') {
                    onChange('locationCode', '');
                    onChange('location', '');
                  } else {
                    onChange(field.apiField, '');
                  }
                }}
              />
              {fieldError && (
                <span className="erp-field-error" id={`${field.key}-error`} role="alert">{fieldError}</span>
              )}
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div
              key={field.key}
              className="erp-form-field erp-form-field-full"
              data-field-error={fieldError ? 'true' : undefined}
            >
              <label className="erp-form-label" htmlFor={field.key}>
                {label}
                {field.required && <span className="erp-required">*</span>}
              </label>
              <ERPTextarea
                id={field.key}
                value={String(values[field.apiField] ?? '')}
                disabled={disabled}
                error={Boolean(fieldError)}
                onChange={(e) => onChange(field.apiField, e.target.value)}
                onBlur={() => onFieldBlur?.(field.apiField)}
                aria-describedby={fieldError ? `${field.key}-error` : undefined}
              />
              {fieldError && (
                <span className="erp-field-error" id={`${field.key}-error`} role="alert">{fieldError}</span>
              )}
            </div>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <div key={field.key} className="erp-form-field erp-form-field-checkbox">
              <ERPCheckbox
                id={field.key}
                label={label}
                checked={Boolean(values[field.apiField])}
                disabled={disabled}
                onChange={(e) => onChange(field.apiField, e.target.checked)}
              />
              {fieldError && (
                <span className="erp-field-error" id={`${field.key}-error`} role="alert">{fieldError}</span>
              )}
            </div>
          );
        }

        if (field.type === 'date') {
          return (
            <div key={field.key} className="erp-form-field" data-field-error={fieldError ? 'true' : undefined}>
              <label className="erp-form-label" htmlFor={field.key}>
                {label}
                {field.required && <span className="erp-required">*</span>}
              </label>
              <ERPDateField
                id={field.key}
                value={String(values[field.apiField] ?? '')}
                disabled={disabled}
                error={Boolean(fieldError)}
                lang={lang}
                onChange={(v) => onChange(field.apiField, v)}
                onBlur={() => onFieldBlur?.(field.apiField)}
              />
              {fieldError && (
                <span className="erp-field-error" id={`${field.key}-error`} role="alert">{fieldError}</span>
              )}
            </div>
          );
        }

        return (
          <div key={field.key} className="erp-form-field" data-field-error={fieldError ? 'true' : undefined}>
            <label className="erp-form-label" htmlFor={field.key}>
              {label}
              {field.required && <span className="erp-required">*</span>}
            </label>
            <ERPInput
              id={field.key}
              type={field.type === 'number' ? 'number' : 'text'}
              value={field.type === 'number' ? Number(values[field.apiField] ?? 0) : String(values[field.apiField] ?? '')}
              disabled={disabled}
              error={Boolean(fieldError)}
              onChange={(e) =>
                onChange(
                  field.apiField,
                  field.type === 'number' ? Number(e.target.value) : e.target.value,
                )
              }
              onBlur={() => onFieldBlur?.(field.apiField)}
              aria-describedby={fieldError ? `${field.key}-error` : undefined}
            />
            {fieldError && (
              <span className="erp-field-error" id={`${field.key}-error`} role="alert">{fieldError}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
