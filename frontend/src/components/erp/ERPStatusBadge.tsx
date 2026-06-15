import { memo } from 'react';
import type { TranslationMap } from '../../types/i18n';
import { getStatusClass, getStatusLabel } from '../../utils/formatters';

interface ERPStatusBadgeProps {
  status: string;
  t: TranslationMap;
}

function ERPStatusBadgeInner({ status, t }: ERPStatusBadgeProps) {
  return (
    <span className={`erp-status-badge status-badge ${getStatusClass(status)}`} role="status">
      {getStatusLabel(status, t)}
    </span>
  );
}

const ERPStatusBadge = memo(ERPStatusBadgeInner);
export default ERPStatusBadge;
