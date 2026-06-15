import { useParams } from 'react-router-dom';
import PurchaseOrderForm from './PurchaseOrderForm';
import type { TranslationMap } from '../types/i18n';
import { usePODetail } from '../hooks/usePODetail';

interface PurchaseOrderViewPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

export default function PurchaseOrderViewPage({ t, lang, setLang }: PurchaseOrderViewPageProps) {
  const { orderNo } = useParams<{ orderNo: string }>();
  const { order, loading, error, setOrder } = usePODetail(orderNo, {
    notFound: t.pages.notFound,
    loadError: t.pages.loadError,
  });

  return (
    <PurchaseOrderForm
      mode="view"
      order={order}
      orderNo={orderNo}
      loading={loading}
      error={error}
      t={t}
      lang={lang}
      setLang={setLang}
      onOrderUpdated={setOrder}
    />
  );
}
