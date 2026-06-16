import { useCallback, useState, type KeyboardEvent, type ReactNode } from 'react';
import PageToolbar from '../PageToolbar';
import type { TranslationMap } from '../../types/i18n';

export type POFormTab = 'basicInfo' | 'itemDetails' | 'audit';

interface POFormPageLayoutProps {
  title: ReactNode;
  activeTab: POFormTab;
  onTabChange: (tab: POFormTab) => void;
  onBack: () => void;
  toolbarActions?: ReactNode;
  headerActions?: ReactNode;
  statusBadge?: ReactNode;
  children: ReactNode;
  dirtyBanner?: ReactNode;
  printHeader?: ReactNode;
  t: TranslationMap;
  showAuditTab?: boolean;
  viewMode?: boolean;
  auditHoverCard?: ReactNode;
}

export default function POFormPageLayout({
  title,
  activeTab,
  onTabChange,
  onBack,
  toolbarActions,
  headerActions,
  statusBadge,
  children,
  dirtyBanner,
  printHeader,
  t,
  showAuditTab,
  viewMode,
  auditHoverCard,
}: POFormPageLayoutProps) {
  const [showAuditHover, setShowAuditHover] = useState(false);
  const tabs: { id: POFormTab; label: string }[] = [
    { id: 'basicInfo', label: t.form.basicInfo },
    { id: 'itemDetails', label: t.form.itemDetails },
  ];
  if (showAuditTab) {
    tabs.push({ id: 'audit', label: t.form.auditInfo });
  }

  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onTabChange(tabs[(index + 1) % tabs.length].id);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onTabChange(tabs[(index - 1 + tabs.length) % tabs.length].id);
      }
    },
    [onTabChange, tabs],
  );

  const toolbarRight = (
    <>
      {headerActions}
      {toolbarActions}
    </>
  );

  return (
    <div className="po-detail-page po-form-page">
      <div className="po-form-sticky-chrome no-print">
        <div className="erp-content-shell">
          <PageToolbar
            title={title}
            onBack={onBack}
            backLabel={t.form.back}
            t={t}
            actions={toolbarRight}
            statusBadge={statusBadge}
          />
          <div className="po-form-tabs" role="tablist" aria-label={t.form.basicInfo}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`po-form-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                onMouseEnter={() => {
                  if (viewMode && tab.id === 'itemDetails' && auditHoverCard) setShowAuditHover(true);
                }}
                onMouseLeave={() => {
                  if (viewMode && tab.id === 'itemDetails' && auditHoverCard) setShowAuditHover(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {viewMode && showAuditHover && auditHoverCard && (
            <div className="po-audit-hover-panel" onMouseEnter={() => setShowAuditHover(true)} onMouseLeave={() => setShowAuditHover(false)}>
              {auditHoverCard}
            </div>
          )}
        </div>
      </div>
      {printHeader}
      <div className={`po-detail-body po-form-body erp-page-content${viewMode ? ' po-view-mode-body' : ''}`}>
        {dirtyBanner}
        <div
          className={`po-form-tabpanel${
            activeTab === 'basicInfo'
              ? ' po-form-tabpanel-basic'
              : activeTab === 'itemDetails'
                ? ' po-form-tabpanel-items'
                : ''
          }`}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
