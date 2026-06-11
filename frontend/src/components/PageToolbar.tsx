import type { ReactNode } from 'react';
import type { TranslationMap } from '../types/i18n';

interface PageToolbarProps {
  title: string;
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
          <button type="button" className="page-toolbar-back" onClick={onBack}>
            ← {backLabel ?? t.form.back}
          </button>
        )}
        <h1 className="page-toolbar-title">{title}</h1>
      </div>
      {actions && <div className="page-toolbar-actions">{actions}</div>}
    </div>
  );
}

export default PageToolbar;
