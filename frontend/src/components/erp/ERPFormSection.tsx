import { memo, type ReactNode } from 'react';

interface ERPFormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

function ERPFormSectionInner({ title, children, className = '', icon }: ERPFormSectionProps) {
  return (
    <section className={`erp-form-section erp-section-card ${className}`.trim()}>
      <div className="erp-section-card-header">
        {icon && <span className="erp-section-card-icon">{icon}</span>}
        <h2 className="erp-section-card-title">{title}</h2>
      </div>
      <div className="erp-section-body">{children}</div>
    </section>
  );
}

const ERPFormSection = memo(ERPFormSectionInner);
export default ERPFormSection;
