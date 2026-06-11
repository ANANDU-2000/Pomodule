import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
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

  const handleChange = (field: keyof PurchaseOrder, val: string | number) => {
    setOrder((prev) => ({ ...prev, [field]: val }));
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
        <PODetailForm value={order} onChange={handleChange} t={t} />
        <div className="po-detail-actions">
          <button type="button" className="btn btn-default" onClick={() => navigate('/po/list')}>
            {t.form.cancel}
          </button>
          <button type="button" className="btn btn-primary" disabled>
            {t.form.save}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderNewPage;
