import { Navigate } from 'react-router-dom';
import PurchaseOrderForm from './PurchaseOrderForm';
import type { TranslationMap } from '../types/i18n';
import { useHasPermission } from '../hooks/useUserPermissions';

interface PurchaseOrderNewPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

export default function PurchaseOrderNewPage({ t, lang, setLang }: PurchaseOrderNewPageProps) {
  const canCreate = useHasPermission('PO_CREATE');
  if (!canCreate) {
    return <Navigate to="/po/list" replace />;
  }
  return <PurchaseOrderForm mode="create" t={t} lang={lang} setLang={setLang} />;
}
