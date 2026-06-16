import type { FormFieldDef, LookupItem } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import FormFieldCell from './FormFieldCell';

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
      {fields.map((field) => (
        <FormFieldCell
          key={field.key}
          field={field}
          values={values}
          errors={errors}
          readOnly={readOnly}
          onChange={onChange}
          onLookupSelect={onLookupSelect}
          onFieldBlur={onFieldBlur}
          t={t}
          getLabel={getLabel}
          lang={lang}
        />
      ))}
    </div>
  );
}
