import { useNavigate, useParams } from 'react-router-dom';
import type { TranslationMap } from '../types/i18n';
import { usePODetail } from '../hooks/usePODetail';
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
  const { order, loading, error } = usePODetail(orderNo, {
    notFound: t.pages.notFound,
    loadError: t.pages.loadError,
  });

  const handleBack = () => navigate('/po/list');

  return (
    <div className="po-detail-page">
      <PageToolbar
        title={t.pages.viewTitle}
        onBack={handleBack}
        t={t}
        actions={<LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />}
      />
      <div className="po-detail-body">
        {loading && <div className="po-detail-skeleton" />}
        {error && <div className="po-detail-error">{error}</div>}
        {!loading && !error && order && (
          <>
            <PODetailForm value={order} readOnly t={t} lang={lang} />
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
