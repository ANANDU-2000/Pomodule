import { useParams } from 'react-router-dom';
import PurchaseOrderForm from './PurchaseOrderForm';
import type { TranslationMap } from '../types/i18n';
import { usePODetail } from '../hooks/usePODetail';

interface PurchaseOrderEditPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

export default function PurchaseOrderEditPage({ t, lang, setLang }: PurchaseOrderEditPageProps) {
  const { orderNo } = useParams<{ orderNo: string }>();
  const { order, loading, error } = usePODetail(orderNo, {
    notFound: t.pages.notFound,
    loadError: t.pages.loadError,
  });

  return (
    <PurchaseOrderForm
      mode="edit"
      order={order}
      orderNo={orderNo}
      loading={loading}
      error={error}
      t={t}
      lang={lang}
      setLang={setLang}
    />
  );
}
