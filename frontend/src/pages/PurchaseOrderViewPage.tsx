import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { TranslationMap } from '../types/i18n';
import {
  getPoViewPageActions,
  getVisiblePoViewActions,
  type POViewActionId,
} from '../constants/poViewActions';
import { DEFAULT_USER_PERMISSIONS } from '../constants/permissions';
import { approvePO, POActionError } from '../services/purchaseOrderService';
import { usePODetail } from '../hooks/usePODetail';
import PageToolbar from '../components/PageToolbar';
import PODetailForm from '../components/PODetailForm';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface PurchaseOrderViewPageProps {
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

function actionButtonClass(variant: 'primary' | 'default' | 'success'): string {
  if (variant === 'success') return 'btn btn-success';
  if (variant === 'primary') return 'btn btn-primary';
  return 'btn btn-default';
}

function PurchaseOrderViewPage({ t, lang, setLang }: PurchaseOrderViewPageProps) {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const { order, setOrder, loading, error } = usePODetail(orderNo, {
    notFound: t.pages.notFound,
    loadError: t.pages.loadError,
  });
  const [actionLoading, setActionLoading] = useState<POViewActionId | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const viewActions = useMemo(() => getPoViewPageActions(t), [t]);
  const visibleActions = useMemo(
    () => (order ? getVisiblePoViewActions(viewActions, order, DEFAULT_USER_PERMISSIONS) : []),
    [viewActions, order],
  );

  const handleBack = () => navigate('/po/list');

  const handleAction = useCallback(async (actionId: POViewActionId) => {
    if (!order) return;

    if (actionId === 'edit') {
      navigate(`/purchase-orders/${order.orderNo}/edit`);
      return;
    }

    if (actionId === 'approve') {
      setActionLoading('approve');
      setActionError(null);
      try {
        const updated = await approvePO(order.orderNo);
        setOrder(updated);
      } catch (err: unknown) {
        if (err instanceof POActionError) {
          setActionError(err.message);
        } else if (err instanceof Error && err.name !== 'AbortError') {
          setActionError(t.pages.approveError);
        }
      } finally {
        setActionLoading(null);
      }
    }
  }, [order, navigate, setOrder, t.pages.approveError]);

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
            {actionError && (
              <div className="po-detail-error po-detail-action-error" role="alert">{actionError}</div>
            )}
            {visibleActions.length > 0 && (
              <div className="po-detail-actions">
                {visibleActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className={actionButtonClass(action.variant)}
                    disabled={actionLoading !== null}
                    onClick={() => void handleAction(action.id)}
                  >
                    {actionLoading === action.id && action.id === 'approve'
                      ? t.actions.approving
                      : action.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderViewPage;
