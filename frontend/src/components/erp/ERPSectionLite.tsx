import { memo, type ReactNode } from 'react';

interface ERPSectionLiteProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
}

function ERPSectionLiteInner({
  title,
  children,
  className = '',
  icon,
  headerActions,
}: ERPSectionLiteProps) {
  return (
    <section className={`erp-section-lite ${className}`.trim()}>
      <div className={`erp-section-lite-header${headerActions ? ' erp-section-lite-header-actions' : ''}`}>
        {icon && <span className="erp-section-lite-icon">{icon}</span>}
        <h2 className="erp-section-lite-title">{title}</h2>
        {headerActions}
      </div>
      <div className="erp-section-lite-divider" aria-hidden="true" />
      <div className="erp-section-lite-body">{children}</div>
    </section>
  );
}

const ERPSectionLite = memo(ERPSectionLiteInner);
export default ERPSectionLite;
