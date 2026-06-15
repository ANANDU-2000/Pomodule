import type { POAuditFields } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import { formatDate } from '../../utils/formatters';
import { ERPInfoCard } from '../erp';
import { getSectionIcon } from '../../constants/sectionIcons';

interface AuditTimelineProps {
  audit: POAuditFields;
  t: TranslationMap;
  lang: 'en' | 'th';
}

interface TimelineEntry {
  label: string;
  user: string;
  date: string;
}

function buildEntries(audit: POAuditFields, t: TranslationMap): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    { label: t.form.createdDate, user: audit.createdBy, date: audit.createdDate },
  ];
  if (audit.updatedBy || audit.updatedDate) {
    entries.push({ label: t.form.updatedDate, user: audit.updatedBy, date: audit.updatedDate });
  }
  if (audit.approvedBy || audit.approvedDate) {
    entries.push({ label: t.form.approvedDate, user: audit.approvedBy, date: audit.approvedDate });
  }
  return entries;
}

export default function AuditTimeline({ audit, t, lang }: AuditTimelineProps) {
  const entries = buildEntries(audit, t);

  return (
    <ERPInfoCard title={t.form.auditInfo} icon={getSectionIcon('additionalInfo')}>
      <ol className="audit-timeline">
        {entries.map((entry, index) => (
          <li key={entry.label} className="audit-timeline-item">
            <div className="audit-timeline-marker" aria-hidden="true">
              <span className={`audit-timeline-dot${index === entries.length - 1 ? ' audit-timeline-dot-last' : ''}`} />
              {index < entries.length - 1 && <span className="audit-timeline-line" />}
            </div>
            <div className="audit-timeline-content">
              <span className="audit-timeline-label">{entry.label}</span>
              {entry.user && (
                <span className="audit-timeline-user">
                  {entry.label === t.form.createdDate ? t.form.createdBy : entry.label === t.form.updatedDate ? t.form.updatedBy : t.form.approvedBy}: {entry.user}
                </span>
              )}
              {entry.date && (
                <time className="audit-timeline-date" dateTime={entry.date}>
                  {formatDate(entry.date, lang)}
                </time>
              )}
            </div>
          </li>
        ))}
      </ol>
    </ERPInfoCard>
  );
}
