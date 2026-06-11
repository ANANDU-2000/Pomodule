import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { createPO } from '../services/purchaseOrderService';
import PageToolbar from '../components/PageToolbar';
import PODetailForm from '../components/PODetailForm';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface PurchaseOrderNewPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

const EMPTY_ORDER: PurchaseOrder = {
  orderNo: '',
  documentDate: new Date().toISOString().slice(0, 10),
  supplierCode: '',
  supplierName: '',
  location: '',
  orderValue: 0,
  status: 'Draft',
  deliveryDate: '',
  remarks: '',
  userId: '',
};

function PurchaseOrderNewPage({ t, lang, setLang }: PurchaseOrderNewPageProps) {
  const navigate = useNavigate();
  const [order, setOrder] = useState<PurchaseOrder>({ ...EMPTY_ORDER });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((field: keyof PurchaseOrder, val: string | number) => {
    setOrder((prev) => ({ ...prev, [field]: val }));
  }, []);

  const isValid = Boolean(
    order.supplierCode.trim() &&
    order.supplierName.trim() &&
    order.location.trim() &&
    order.orderValue > 0 &&
    order.deliveryDate,
  );

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      const payload: Omit<PurchaseOrder, 'orderNo'> = {
        documentDate: order.documentDate,
        supplierCode: order.supplierCode,
        supplierName: order.supplierName,
        location: order.location,
        orderValue: order.orderValue,
        status: order.status,
        deliveryDate: order.deliveryDate,
        remarks: order.remarks,
        userId: order.userId,
      };
      const created = await createPO(payload);
      navigate(`/purchase-orders/${created.orderNo}/view`);
    } catch {
      setError(t.pages.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="po-detail-page">
      <PageToolbar
        title={t.pages.newTitle}
        onBack={() => navigate('/po/list')}
        t={t}
        actions={<LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />}
      />
      <div className="po-detail-body">
        {error && <div className="po-detail-error">{error}</div>}
        <PODetailForm value={order} onChange={handleChange} t={t} lang={lang} />
        <div className="po-detail-actions">
          <button type="button" className="btn btn-default" onClick={() => navigate('/po/list')} disabled={saving}>
            {t.form.cancel}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => { void handleSave(); }}
            disabled={saving || !isValid}
          >
            {saving ? t.form.saving : t.form.save}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderNewPage;
