import type { Ref } from 'react';
import type { FilterPeriod, FilterOption } from '../types/PurchaseOrder';
import type { PageActionConfig } from '../constants/pageActions';
import type { TranslationMap } from '../types/i18n';
import type { SearchBarHandle } from './SearchBar';
import SearchBar from './SearchBar';
import FilterPopup from './FilterPopup';
import LanguageSwitcher from './LanguageSwitcher';
import { AppIcon, ICON_SIZE_HEADER, Plus } from './icons';

function parsePageTitle(title: string): { code: string | null; label: string } {
  const sep = title.indexOf(' - ');
  if (sep === -1) return { code: null, label: title };
  return { code: title.slice(0, sep), label: title.slice(sep + 3) };
}

interface PageHeaderProps {
  title: string;
  searchValue: string;
  onSearch: (v: string) => void;
  activeFilter: FilterPeriod;
  onFilter: (f: FilterPeriod) => void;
  pageActions: PageActionConfig[];
  onPageAction?: (actionId: string) => void;
  searchRef?: Ref<SearchBarHandle>;
  filterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  t: TranslationMap;
  lang: 'en' | 'th';
  onLangSwitch: (lang: 'en' | 'th') => void;
  filterOptions: FilterOption[];
}

function PageHeader({
  title,
  searchValue,
  onSearch,
  activeFilter,
  onFilter,
  pageActions,
  onPageAction,
  searchRef,
  filterOpen,
  onFilterOpenChange,
  t,
  lang,
  onLangSwitch,
  filterOptions,
}: PageHeaderProps) {
  const { code, label } = parsePageTitle(title);

  return (
    <header className="page-header">
      <div className="page-header-title-block">
        {code && <span className="page-header-code">{code}</span>}
        <h1 className="page-header-title">{label}</h1>
      </div>
      <div className="page-header-toolbar" role="toolbar" aria-label={t.accessibility.pageActions}>
        <FilterPopup
          activeFilter={activeFilter}
          onSelect={onFilter}
          open={filterOpen}
          onOpenChange={onFilterOpenChange}
          filterOptions={filterOptions}
          t={t}
        />
        <div className="page-header-search">
          <SearchBar
            ref={searchRef}
            value={searchValue}
            onChange={onSearch}
            placeholder={t.actions.search}
            ariaLabel={t.search.ariaLabel}
            clearAriaLabel={t.search.clear}
          />
        </div>
        {pageActions.length > 0 && (
          <div className="page-header-actions">
            {pageActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`btn${action.variant === 'primary' ? ' btn-primary-compact' : ' btn-default'}`}
                onClick={() => onPageAction?.(action.id)}
              >
                {action.variant === 'primary' && <AppIcon icon={Plus} size={ICON_SIZE_HEADER} />}
                {action.label}
              </button>
            ))}
          </div>
        )}
        <LanguageSwitcher lang={lang} onSwitch={onLangSwitch} ariaLabel={t.accessibility.language} />
      </div>
    </header>
  );
}

export default PageHeader;
