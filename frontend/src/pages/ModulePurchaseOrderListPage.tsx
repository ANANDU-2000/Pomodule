import PurchaseOrderListPage from './PurchaseOrderListPage';
import type { TranslationMap } from '../types/i18n';

export type PurchaseOrderModule = 'po-gh' | 'po-all' | 'po-exp' | 'po-ast' | 'po-gr';

interface ModulePurchaseOrderListPageProps {
  moduleCode: PurchaseOrderModule;
  onToggleSidebar: () => void;
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

function getModuleTitle(moduleCode: PurchaseOrderModule, t: TranslationMap): string {
  const titles: Record<PurchaseOrderModule, string> = {
    'po-gh': t.moduleTitles.poGh,
    'po-all': t.moduleTitles.poAll,
    'po-exp': t.moduleTitles.poExp,
    'po-ast': t.moduleTitles.poAst,
    'po-gr': t.moduleTitles.poGr,
  };
  return titles[moduleCode];
}

// moduleCode filters list data when Oracle module procs are available; title-only for now.
function ModulePurchaseOrderListPage(props: ModulePurchaseOrderListPageProps) {
  const { moduleCode, ...rest } = props;
  return (
    <PurchaseOrderListPage
      {...rest}
      pageTitle={getModuleTitle(moduleCode, props.t)}
    />
  );
}

export default ModulePurchaseOrderListPage;
