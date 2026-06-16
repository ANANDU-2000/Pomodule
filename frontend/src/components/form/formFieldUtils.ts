import type { FormFieldDef } from '../../types/formConfig';

type FormValues = Record<string, string | number | boolean>;

export function isFieldDisabled(field: FormFieldDef, values: FormValues, readOnly?: boolean): boolean {
  if (readOnly || field.readOnly) return true;
  if (!field.editable) return true;
  if (field.dependsOn && !values[field.dependsOn === 'supplier' ? 'supplierCode' : field.dependsOn]) {
    return true;
  }
  return false;
}

export function getFieldDisplayValue(field: FormFieldDef, values: FormValues): string | number | boolean {
  if (field.apiField === 'supplierCode') return String(values.supplierName ?? values.supplierCode ?? '');
  if (field.apiField === 'locationCode') return String(values.location ?? values.locationCode ?? '');
  return values[field.apiField] as string | number | boolean;
}

export function buildFieldByKey(fields: FormFieldDef[]): Map<string, FormFieldDef> {
  return new Map(fields.map((field) => [field.key, field]));
}
