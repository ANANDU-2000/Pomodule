import type { TranslationMap } from '../../types/i18n';

interface ValidationSummaryProps {
  errors: Record<string, string[]>;
  fieldLabels?: Record<string, string>;
  t: TranslationMap;
}

export default function ValidationSummary({ errors, fieldLabels, t }: ValidationSummaryProps) {
  const entries = Object.entries(errors).filter(([, msgs]) => msgs.length > 0);
  if (entries.length === 0) return null;

  return (
    <div className="erp-validation-summary" role="alert">
      <p className="erp-validation-title">{t.form.validationTitle}</p>
      <ul>
        {entries.map(([field, msgs]) =>
          msgs.map((msg) => (
            <li key={`${field}-${msg}`}>
              <strong>{fieldLabels?.[field] ?? field}</strong>: {msg}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
