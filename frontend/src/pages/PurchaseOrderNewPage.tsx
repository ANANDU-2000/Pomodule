import PurchaseOrderForm from './PurchaseOrderForm';
import type { TranslationMap } from '../types/i18n';

interface PurchaseOrderNewPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

export default function PurchaseOrderNewPage({ t, lang, setLang }: PurchaseOrderNewPageProps) {
  return <PurchaseOrderForm mode="create" t={t} lang={lang} setLang={setLang} />;
}
