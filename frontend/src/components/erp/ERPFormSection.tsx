import { memo, type ReactNode } from 'react';

interface ERPFormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
}

function ERPFormSectionInner({
  title,
  children,
  className = '',
  icon,
  headerActions,
}: ERPFormSectionProps) {
  return (
    <section className={`erp-form-section erp-section-card ${className}`.trim()}>
      <div className={`erp-section-card-header${headerActions ? ' erp-section-card-header-actions' : ''}`}>
        {icon && <span className="erp-section-card-icon">{icon}</span>}
        <h2 className="erp-section-card-title">{title}</h2>
        {headerActions}
      </div>
      <div className="erp-section-card-divider" aria-hidden="true" />
      <div className="erp-section-body">{children}</div>
    </section>
  );
}

const ERPFormSection = memo(ERPFormSectionInner);
export default ERPFormSection;
