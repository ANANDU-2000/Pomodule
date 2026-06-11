import type { ReactNode } from 'react';
import type { TranslationMap } from '../types/i18n';
import { AppIcon, ChevronLeft, ICON_SIZE_NAV_BACK } from './icons';

interface PageToolbarProps {
  title: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  actions?: ReactNode;
  t: TranslationMap;
}

function PageToolbar({ title, onBack, backLabel, actions, t }: PageToolbarProps) {
  return (
    <div className="page-toolbar">
      <div className="page-toolbar-left">
        {onBack && (
          <>
            <button type="button" className="page-toolbar-back" onClick={onBack}>
              <AppIcon icon={ChevronLeft} size={ICON_SIZE_NAV_BACK} />
              {backLabel ?? t.form.back}
            </button>
            <div className="page-toolbar-divider" aria-hidden="true" />
          </>
        )}
        <h1 className="page-toolbar-title">{title}</h1>
      </div>
      {actions && <div className="page-toolbar-actions">{actions}</div>}
    </div>
  );
}

export default PageToolbar;
