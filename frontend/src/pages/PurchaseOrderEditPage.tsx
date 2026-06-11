import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { fetchPODetail, updatePO, PONotFoundError } from '../services/purchaseOrderService';
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
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const initialRef = useRef<string>('');

  useEffect(() => {
    if (!orderNo) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchPODetail(orderNo, controller.signal)
      .then((data) => {
        setOrder(data);
        initialRef.current = JSON.stringify(data);
        setDirty(false);
      })
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

  const handleChange = useCallback((field: keyof PurchaseOrder, val: string | number) => {
    setOrder((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: val };
      setDirty(JSON.stringify(next) !== initialRef.current);
      return next;
    });
  }, []);

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
      initialRef.current = JSON.stringify(updated);
      setDirty(false);
      navigate(`/purchase-orders/${orderNo}/view`);
    } catch {
      setError(t.pages.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="po-detail-page">
      <PageToolbar
        title={t.pages.editTitle}
        onBack={handleBack}
        t={t}
        actions={<LanguageSwitcher lang={lang} onSwitch={setLang} />}
      />
      <div className="po-detail-body">
        {loading && <div className="po-detail-skeleton" />}
        {error && <div className="po-detail-error">{error}</div>}
        {!loading && order && (
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
