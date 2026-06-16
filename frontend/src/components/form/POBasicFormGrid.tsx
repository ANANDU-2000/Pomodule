import { useMemo, type ReactNode } from 'react';
import type { FormSectionDef, FormFieldDef, LookupItem } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import {
  PO_FORM_GRID_ROWS,
  PO_LAYOUT_TO_FIELD_KEY,
  PO_PRIMARY_FIELD_KEYS,
  PO_SECONDARY_FIELD_KEYS,
  type POFormLayoutFieldKey,
  type POFormGridRow,
} from '../../constants/poForm.layout';
import FormFieldCell from './FormFieldCell';
import { buildFieldByKey } from './formFieldUtils';

type FormValues = Record<string, string | number | boolean>;

function getLabelTone(layoutKey: POFormLayoutFieldKey): 'primary' | 'secondary' | 'default' {
  if (PO_PRIMARY_FIELD_KEYS.has(layoutKey)) return 'primary';
  if (PO_SECONDARY_FIELD_KEYS.has(layoutKey)) return 'secondary';
  return 'default';
}

interface POBasicFormGridProps {
  sections: FormSectionDef[];
  values: FormValues;
  errors?: Record<string, string[]>;
  readOnly?: boolean;
  onChange: (apiField: string, value: string | number | boolean) => void;
  onLookupSelect: (field: FormFieldDef, item: LookupItem) => void;
  onFieldBlur?: (apiField: string) => void;
  t: TranslationMap;
  getLabel: (labelKey: string) => string;
  lang?: 'en' | 'th';
}

interface RenderCtx {
  fieldByKey: Map<string, FormFieldDef>;
  values: FormValues;
  errors?: Record<string, string[]>;
  readOnly?: boolean;
  onChange: (apiField: string, value: string | number | boolean) => void;
  onLookupSelect: (field: FormFieldDef, item: LookupItem) => void;
  onFieldBlur?: (apiField: string) => void;
  t: TranslationMap;
  getLabel: (labelKey: string) => string;
  lang: 'en' | 'th';
}

function rowClassName(row: POFormGridRow): string {
  if (row.fullWidth) return 'po-basic-form-row po-basic-form-row-full';
  if (row.checkbox) return 'po-basic-form-row po-basic-form-row-checkbox';
  return 'po-basic-form-row po-basic-form-row-3';
}

function renderRow(row: POFormGridRow, rowIndex: number, ctx: RenderCtx): ReactNode {
  return (
    <div key={`row-${rowIndex}`} className={rowClassName(row)}>
      {row.cols.map((layoutKey) => {
        const fieldKey = PO_LAYOUT_TO_FIELD_KEY[layoutKey];
        const field = ctx.fieldByKey.get(fieldKey);
        if (!field) return null;

        return (
          <div
            key={fieldKey}
            className={row.fullWidth ? 'po-basic-form-cell-full' : 'po-basic-form-cell'}
          >
            <FormFieldCell
              field={field}
              values={ctx.values}
              errors={ctx.errors}
              readOnly={ctx.readOnly}
              onChange={ctx.onChange}
              onLookupSelect={ctx.onLookupSelect}
              onFieldBlur={ctx.onFieldBlur}
              t={ctx.t}
              getLabel={ctx.getLabel}
              lang={ctx.lang}
              labelTone={getLabelTone(layoutKey)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function POBasicFormGrid({
  sections,
  values,
  errors,
  readOnly,
  onChange,
  onLookupSelect,
  onFieldBlur,
  t,
  getLabel,
  lang = 'en',
}: POBasicFormGridProps) {
  const fieldByKey = useMemo(() => {
    const allFields = sections.flatMap((section) => section.fields);
    return buildFieldByKey(allFields);
  }, [sections]);

  const ctx: RenderCtx = {
    fieldByKey,
    values,
    errors,
    readOnly,
    onChange,
    onLookupSelect,
    onFieldBlur,
    t,
    getLabel,
    lang,
  };

  return (
    <div className="po-basic-form-card">
      <div className="po-basic-form-grid-rows">
        {PO_FORM_GRID_ROWS.map((row, rowIndex) => renderRow(row, rowIndex, ctx))}
      </div>
    </div>
  );
}
