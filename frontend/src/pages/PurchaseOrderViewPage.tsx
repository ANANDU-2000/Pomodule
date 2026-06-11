import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { fetchPODetail, PONotFoundError } from '../services/purchaseOrderService';
import PageToolbar from '../components/PageToolbar';
import PODetailForm from '../components/PODetailForm';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface PurchaseOrderViewPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

function PurchaseOrderViewPage({ t, lang, setLang }: PurchaseOrderViewPageProps) {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNo) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchPODetail(orderNo, controller.signal)
      .then((data) => setOrder(data))
      .catch((err: unknown) => {
        if (err instanceof PONotFoundError) {
          setError(t.pages.notFound);
        } else if (err instanceof Error && err.name !== 'AbortError') {
          setError(t.pages.loadError);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [orderNo, t.pages.notFound, t.pages.loadError]);

  const handleBack = () => navigate('/po/list');

  return (
    <div className="po-detail-page">
      <PageToolbar
        title={t.pages.viewTitle}
        onBack={handleBack}
        t={t}
        actions={<LanguageSwitcher lang={lang} onSwitch={setLang} />}
      />
      <div className="po-detail-body">
        {loading && <div className="po-detail-skeleton" />}
        {error && <div className="po-detail-error">{error}</div>}
        {!loading && !error && order && (
          <>
            <PODetailForm value={order} readOnly t={t} />
            <div className="po-detail-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/purchase-orders/${order.orderNo}/edit`)}
              >
                {t.form.edit}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderViewPage;
