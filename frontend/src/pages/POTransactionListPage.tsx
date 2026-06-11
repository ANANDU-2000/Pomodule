import PurchaseOrderListPage from './PurchaseOrderListPage';
import type { TranslationMap } from '../types/i18n';

export type POModuleCode = 'po-gh' | 'po-all' | 'po-exp' | 'po-ast' | 'po-gr';

interface POTransactionListPageProps {
  moduleCode: POModuleCode;
  onToggleSidebar: () => void;
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

function getModuleTitle(moduleCode: POModuleCode, t: TranslationMap): string {
  const titles: Record<POModuleCode, string> = {
    'po-gh': t.moduleTitles.poGh,
    'po-all': t.moduleTitles.poAll,
    'po-exp': t.moduleTitles.poExp,
    'po-ast': t.moduleTitles.poAst,
    'po-gr': t.moduleTitles.poGr,
  };
  return titles[moduleCode];
}

function POTransactionListPage(props: POTransactionListPageProps) {
  const { moduleCode, ...rest } = props;
  return (
    <PurchaseOrderListPage
      {...rest}
      pageTitle={getModuleTitle(moduleCode, props.t)}
    />
  );
}

export default POTransactionListPage;
