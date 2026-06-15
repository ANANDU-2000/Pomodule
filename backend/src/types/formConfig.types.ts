export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'lookup';

export interface FormFieldValidationSchema {
  rules: string[];
}

export interface FormFieldDef {
  key: string;
  apiField: string;
  type: FormFieldType;
  lookupType?: string;
  required: boolean;
  section: string;
  editable: boolean;
  labelKey: string;
  validationSchema: FormFieldValidationSchema;
  dependsOn?: string;
  readOnly?: boolean;
  defaultFrom?: string;
}

export interface FormSectionDef {
  id: string;
  labelKey: string;
  fields: FormFieldDef[];
}

export type FormConfigSource = 'oracle' | 'temporary-fallback';

export interface FormConfigResponse {
  source: FormConfigSource;
  sections: FormSectionDef[];
}

export interface SystemDefaultsResponse {
  currency: string;
  searchLimit: number;
  itemSearchLimit: number;
  minSearchChars: number;
  debounceMs: number;
}
