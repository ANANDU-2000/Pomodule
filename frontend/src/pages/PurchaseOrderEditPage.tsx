import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { updatePO } from '../services/purchaseOrderService';
import { usePODetail } from '../hooks/usePODetail';
import PageToolbar from '../components/PageToolbar';
import PODetailForm from '../components/PODetailForm';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface PurchaseOrderEditPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

function PurchaseOrderEditPage({ t, lang, setLang }: PurchaseOrderEditPageProps) {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const { order, setOrder, loading, error, setError } = usePODetail(orderNo, {
    notFound: t.pages.notFound,
    loadError: t.pages.loadError,
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [baseline, setBaseline] = useState('');
  const [trackedOrderNo, setTrackedOrderNo] = useState(orderNo);

  if (orderNo !== trackedOrderNo) {
    setTrackedOrderNo(orderNo);
    setBaseline('');
    setDirty(false);
  }

  if (!loading && order && baseline === '' && order.orderNo === orderNo) {
    setBaseline(JSON.stringify(order));
  }

  const handleChange = useCallback((field: keyof PurchaseOrder, val: string | number) => {
    setOrder((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: val };
      setDirty(JSON.stringify(next) !== baseline);
      return next;
    });
  }, [baseline, setOrder]);

  const handleBack = () => {
    if (dirty && !window.confirm(t.pages.unsavedChanges)) return;
    navigate('/po/list');
  };

  const handleSave = async () => {
    if (!order || !orderNo) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updatePO(orderNo, order);
      setOrder(updated);
      setBaseline(JSON.stringify(updated));
      setDirty(false);
      navigate(`/purchase-orders/${orderNo}/view`);
    } catch {
      setError(t.pages.saveError);
    } finally {
      setSaving(false);
    }
  };

  const showForm = !loading && order;

  return (
    <div className="po-detail-page">
      <PageToolbar
        title={t.pages.editTitle}
        onBack={handleBack}
        t={t}
        actions={<LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />}
      />
      <div className="po-detail-body">
        {loading && <div className="po-detail-skeleton" />}
        {error && <div className="po-detail-error">{error}</div>}
        {showForm && (
          <>
            <PODetailForm value={order} onChange={handleChange} t={t} />
            <div className="po-detail-actions">
              <button type="button" className="btn btn-default" onClick={handleBack} disabled={saving}>
                {t.form.cancel}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => { void handleSave(); }} disabled={saving}>
                {t.form.save}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderEditPage;
