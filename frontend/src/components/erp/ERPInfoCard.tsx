import { memo, type ReactNode } from 'react';

interface ERPInfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: ReactNode;
}

function ERPInfoCardInner({ title, children, className = '', icon }: ERPInfoCardProps) {
  return (
    <article className={`erp-info-card erp-section-card ${className}`.trim()}>
      <div className="erp-section-card-header">
        {icon && <span className="erp-section-card-icon">{icon}</span>}
        <h2 className="erp-section-card-title">{title}</h2>
      </div>
      <div className="erp-section-card-divider" aria-hidden="true" />
      <div className="erp-section-body">{children}</div>
    </article>
  );
}

const ERPInfoCard = memo(ERPInfoCardInner);
export default ERPInfoCard;
