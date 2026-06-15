import type { FormSectionDef, FormFieldDef, LookupItem } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import DynamicFormRenderer from './DynamicFormRenderer';
import { ERPFormSection, ERPInfoCard } from '../erp';
import { getSectionIcon } from '../../constants/sectionIcons';

type FormValues = Record<string, string | number | boolean>;

interface POHeaderSectionsProps {
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

export default function POHeaderSections({
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
}: POHeaderSectionsProps) {
  return (
    <div className="erp-sections-stack">
      {sections.map((section) => {
        const title = getLabel(section.labelKey);
        const icon = getSectionIcon(section.id);
        if (readOnly) {
          return (
            <ERPInfoCard key={section.id} title={title} icon={icon}>
              <DynamicFormRenderer
                fields={section.fields}
                values={values}
                readOnly
                onChange={onChange}
                t={t}
                getLabel={getLabel}
                lang={lang}
              />
            </ERPInfoCard>
          );
        }
        return (
          <ERPFormSection key={section.id} title={title} icon={icon}>
            <DynamicFormRenderer
              fields={section.fields}
              values={values}
              errors={errors}
              onChange={onChange}
              onLookupSelect={onLookupSelect}
              onFieldBlur={onFieldBlur}
              t={t}
              getLabel={getLabel}
              lang={lang}
            />
          </ERPFormSection>
        );
      })}
    </div>
  );
}
