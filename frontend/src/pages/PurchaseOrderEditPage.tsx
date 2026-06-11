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

interface EditOrderFormProps {
  order: PurchaseOrder;
  orderNo: string;
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
  setError: (error: string | null) => void;
}

function EditOrderForm({ order, orderNo, t, lang, setLang, setError }: EditOrderFormProps) {
  const navigate = useNavigate();
  const [formOrder, setFormOrder] = useState(order);
  const [baseline] = useState(() => JSON.stringify(order));
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(formOrder) !== baseline;

  const handleChange = useCallback((field: keyof PurchaseOrder, val: string | number) => {
    setFormOrder((prev) => ({ ...prev, [field]: val }));
  }, []);

  const handleBack = () => {
    if (dirty && !window.confirm(t.pages.unsavedChanges)) return;
    navigate('/po/list');
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updatePO(orderNo, formOrder);
      navigate(`/purchase-orders/${orderNo}/view`);
    } catch {
      setError(t.pages.saveError);
    } finally {
      setSaving(false);
    }
  };

  const toolbarTitle = dirty ? (
    <>
      {t.pages.editTitle}
      <span className="dirty-indicator" aria-hidden="true"> •</span>
    </>
  ) : (
    t.pages.editTitle
  );

  return (
    <>
      <PageToolbar
        title={toolbarTitle}
        onBack={handleBack}
        t={t}
        actions={<LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />}
      />
      <div className="po-detail-body">
        <PODetailForm value={formOrder} onChange={handleChange} t={t} lang={lang} />
        <div className="po-detail-actions">
          <button type="button" className="btn btn-default" onClick={handleBack} disabled={saving}>
            {t.form.cancel}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => { void handleSave(); }}
            disabled={saving || !dirty}
          >
            {saving ? t.form.saving : t.form.save}
          </button>
        </div>
      </div>
    </>
  );
}

function PurchaseOrderEditPage({ t, lang, setLang }: PurchaseOrderEditPageProps) {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const { order, loading, error, setError } = usePODetail(orderNo, {
    notFound: t.pages.notFound,
    loadError: t.pages.loadError,
  });

  const handleBack = () => {
    navigate('/po/list');
  };

  return (
    <div className="po-detail-page">
      {loading && (
        <>
          <PageToolbar
            title={t.pages.editTitle}
            onBack={handleBack}
            t={t}
            actions={<LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />}
          />
          <div className="po-detail-body">
            <div className="po-detail-skeleton" />
          </div>
        </>
      )}
      {error && (
        <>
          <PageToolbar
            title={t.pages.editTitle}
            onBack={handleBack}
            t={t}
            actions={<LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />}
          />
          <div className="po-detail-body">
            <div className="po-detail-error">{error}</div>
          </div>
        </>
      )}
      {!loading && order && orderNo && (
        <EditOrderForm
          key={orderNo}
          order={order}
          orderNo={orderNo}
          t={t}
          lang={lang}
          setLang={setLang}
          setError={setError}
        />
      )}
    </div>
  );
}

export default PurchaseOrderEditPage;
