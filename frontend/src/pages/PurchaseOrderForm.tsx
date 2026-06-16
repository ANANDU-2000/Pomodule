import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TranslationMap } from '../types/i18n';
import type { FormFieldDef, LookupItem, POFormValues, POLineItem } from '../types/formConfig';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import { useInvalidatePurchaseOrders } from '../hooks/usePODetail';
import { usePOFormConfig } from '../hooks/usePOFormConfig';
import { usePOPermissions } from '../hooks/usePOPermissions';
import { usePOFieldValidation } from '../hooks/usePOFieldValidation';
import {
  approvePO,
  createPO,
  fetchPOLineItems,
  PONotImplementedError,
  updatePO,
} from '../services/purchaseOrderService';
import { DEFAULT_ITEM_ROWS } from '../components/form/POLineItemsTable';
import POFormPageLayout, { type POFormTab } from '../components/form/POFormPageLayout';
import POBasicFormGrid from '../components/form/POBasicFormGrid';
import POLineItemsTable from '../components/form/POLineItemsTable';
import POItemDetailsLayout from '../components/form/POItemDetailsLayout';
import StickyActionBar from '../components/form/StickyActionBar';
import AuditTimeline from '../components/form/AuditTimeline';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { ERPStatusBadge } from '../components/erp';
import { useERPToast } from '../hooks/useERPToast';
import { formatDate } from '../utils/formatters';

export type POFormMode = 'create' | 'edit' | 'view';

interface PurchaseOrderFormProps {
  mode: POFormMode;
  order?: PurchaseOrder | null;
  orderNo?: string;
  loading?: boolean;
  error?: string | null;
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
  onOrderUpdated?: (order: PurchaseOrder) => void;
}

function emptyLine(): POLineItem {
  return {
    itemCode: '',
    itemName: '',
    uom: '',
    quantity: 1,
    rate: 0,
    discPercent: 0,
    discAmt: 0,
    netValue: 0,
    tolPlus: 0,
    tolMinus: 0,
  };
}

function buildInitialValues(defaults?: { currency: string }): POFormValues {
  return {
    supplierCode: '',
    supplierName: '',
    address: '',
    shipmentMode: '',
    paymentTerm: '',
    docLocation: '',
    locationCode: '',
    location: '',
    documentDate: new Date().toISOString().slice(0, 10),
    deliveryDate: new Date().toISOString().slice(0, 10),
    currency: defaults?.currency ?? 'THB',
    exchangeRate: 1,
    discount: 0,
    remarks: '',
    inclusiveVat: false,
    docType: 'PO',
    taxInvoiceDoc: '',
    items: Array.from({ length: DEFAULT_ITEM_ROWS }, emptyLine),
  };
}

function orderToFormValues(order: PurchaseOrder, items: POLineItem[]): POFormValues {
  return {
    supplierCode: order.supplierCode,
    supplierName: order.supplierName,
    address: order.address ?? '',
    shipmentMode: order.shipmentMode ?? '',
    paymentTerm: order.paymentTerm ?? order.terms,
    docLocation: order.docLocation ?? '',
    locationCode: order.locationCode,
    location: order.location,
    documentDate: order.documentDate,
    deliveryDate: order.deliveryDate,
    currency: order.currency,
    exchangeRate: order.exchangeRate ?? 1,
    discount: order.discount ?? 0,
    remarks: order.remarks,
    inclusiveVat: order.inclusiveVat ?? false,
    docType: order.docType ?? '',
    taxInvoiceDoc: order.taxInvoiceDoc ?? '',
    items: items.length > 0 ? items : [emptyLine()],
  };
}

function resolveLabel(t: TranslationMap, labelKey: string): string {
  const parts = labelKey.split('.');
  let current: unknown = t;
  for (const part of parts) {
    current = (current as Record<string, unknown>)?.[part];
  }
  return typeof current === 'string' ? current : labelKey;
}

export default function PurchaseOrderForm({
  mode,
  order,
  orderNo,
  loading,
  error: loadError,
  t,
  lang,
  setLang,
  onOrderUpdated,
}: PurchaseOrderFormProps) {
  const navigate = useNavigate();
  const invalidatePurchaseOrders = useInvalidatePurchaseOrders();
  const { showToast, toastNode } = useERPToast();
  const { config, defaults, isLoading: configLoading } = usePOFormConfig();
  const permissions = usePOPermissions(order ?? null);
  const readOnly = mode === 'view';
  const [activeTab, setActiveTab] = useState<POFormTab>('basicInfo');
  const [values, setValues] = useState<POFormValues>(() => buildInitialValues());
  const [baseline, setBaseline] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [lineItemsNotice, setLineItemsNotice] = useState<string | null>(null);
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  const headerSections = useMemo(
    () => config?.sections.filter((s) => s.id !== 'itemDetails' && s.fields.length > 0) ?? [],
    [config],
  );

  const allHeaderFields = useMemo(
    () => headerSections.flatMap((s) => s.fields),
    [headerSections],
  );

  const validationMessages = useMemo(
    () => ({
      deliveryDateAfterDocument: t.form.deliveryDateAfterDocument,
      itemsMinLength: t.form.itemsMinLength,
    }),
    [t],
  );

  const { validateField, validateAll } = usePOFieldValidation({
    fields: allHeaderFields,
    values,
    setErrors,
    setActiveTab,
    messages: validationMessages,
  });

  useEffect(() => {
    if (defaults && mode === 'create') {
      setValues((prev) => ({ ...prev, currency: defaults.currency }));
    }
  }, [defaults, mode]);

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && order) {
      void fetchPOLineItems(order.orderNo).then((res) => {
        if (!res.configured) {
          setLineItemsNotice(res.message ?? t.form.lineItemsNotConfigured);
          setValues(orderToFormValues(order, []));
        } else {
          setValues(orderToFormValues(order, res.data ?? []));
        }
        setBaseline(JSON.stringify(orderToFormValues(order, res.data ?? [])));
      }).catch(() => {
        setValues(orderToFormValues(order, []));
        setBaseline(JSON.stringify(orderToFormValues(order, [])));
      });
    }
  }, [mode, order, t.form.lineItemsNotConfigured]);

  const dirty = mode === 'edit' && JSON.stringify(values) !== baseline;

  const handleBack = () => {
    if (dirty) {
      setLeaveConfirm(true);
      return;
    }
    navigate('/po/list');
  };

  const confirmLeave = () => {
    setLeaveConfirm(false);
    navigate('/po/list');
  };

  const handleFieldChange = useCallback((apiField: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [apiField]: value }));
  }, []);

  const handleLookupSelect = useCallback((field: FormFieldDef, item: LookupItem) => {
    setValues((prev) => {
      const next = { ...prev };
      if (field.apiField === 'supplierCode') {
        next.supplierCode = item.code;
        next.supplierName = item.name;
        if (item.address) next.address = item.address;
        if (item.shipmentMode) next.shipmentMode = item.shipmentMode;
        if (item.paymentTerm) next.paymentTerm = item.paymentTerm;
        if (item.docLocation) next.docLocation = item.docLocation;
        const locCode = item.locationCode ?? item.docLocation;
        if (locCode) {
          next.locationCode = locCode;
          next.location = item.locationName ?? locCode;
        }
        if (!next.docType) next.docType = 'PO';
        if (!next.deliveryDate && next.documentDate) next.deliveryDate = next.documentDate;
      } else if (field.apiField === 'locationCode') {
        next.locationCode = item.code;
        next.location = item.name;
      } else {
        next[field.apiField as keyof POFormValues] = item.code as never;
        if (field.apiField === 'paymentTerm') next.paymentTerm = item.name;
      }
      return next;
    });
  }, []);

  const handlePrint = () => {
    // TODO: Replace with PDF template or GET /purchase-orders/:id/print API
    window.print();
  };

  const handleSave = async () => {
    if (!validateAll()) return;
    setSaving(true);
    setActionError(null);
    try {
      const payload = {
        supplierCode: values.supplierCode,
        supplierName: values.supplierName,
        address: values.address,
        shipmentMode: values.shipmentMode,
        paymentTerm: values.paymentTerm,
        docLocation: values.docLocation,
        locationCode: values.locationCode,
        location: values.location,
        documentDate: values.documentDate,
        deliveryDate: values.deliveryDate,
        currency: values.currency,
        exchangeRate: values.exchangeRate,
        discount: values.discount,
        remarks: values.remarks,
        inclusiveVat: values.inclusiveVat,
        docType: values.docType,
        taxInvoiceDoc: values.taxInvoiceDoc,
        items: values.items,
      };
      if (mode === 'create') {
        const created = await createPO(payload);
        invalidatePurchaseOrders();
        showToast(t.form.saveSuccess);
        window.setTimeout(() => {
          navigate(`/purchase-orders/${created.orderNo}/view`);
        }, 400);
      } else if (mode === 'edit' && orderNo) {
        await updatePO(orderNo, payload);
        invalidatePurchaseOrders();
        showToast(t.form.saveSuccess);
        window.setTimeout(() => {
          navigate(`/purchase-orders/${orderNo}/view`);
        }, 400);
      }
    } catch (err) {
      if (err instanceof PONotImplementedError) {
        setActionError(err.blocker ? `${err.message} (${err.blocker})` : err.message);
      } else {
        setActionError(t.pages.saveError);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!orderNo || !order) return;
    setSaving(true);
    setActionError(null);
    try {
      const updated = await approvePO(orderNo);
      invalidatePurchaseOrders();
      onOrderUpdated?.(updated);
    } catch (err) {
      if (err instanceof PONotImplementedError) {
        setActionError(err.blocker ? `${err.message} (${err.blocker})` : err.message);
      } else {
        setActionError(t.pages.approveError);
      }
    } finally {
      setSaving(false);
    }
  };

  const pageTitle =
    mode === 'create' ? t.pages.newTitle : mode === 'edit' ? t.pages.editTitle : t.pages.viewTitle;

  const titleNode = (
    <>
      {dirty && <span className="dirty-indicator" aria-hidden="true">• </span>}
      {pageTitle}
      {mode === 'view' && orderNo && (
        <span className="page-toolbar-subtitle">{orderNo}</span>
      )}
    </>
  );

  const statusBadge = mode === 'view' && order ? (
    <ERPStatusBadge status={order.status} t={t} />
  ) : undefined;

  const dirtyBanner = (dirty || leaveConfirm) ? (
    <div className="erp-dirty-banner no-print" role="status">
      <span>{t.form.unsavedChanges}</span>
      {leaveConfirm && (
        <div className="erp-dirty-actions">
          <button type="button" className="btn btn-default btn-sm" onClick={() => setLeaveConfirm(false)}>
            {t.form.cancel}
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={confirmLeave}>
            {t.form.leaveAnyway}
          </button>
        </div>
      )}
    </div>
  ) : null;

  const headerActions = (
    <StickyActionBar
      readOnly={readOnly}
      isEditMode={mode === 'edit'}
      saving={saving}
      canPrint={readOnly ? permissions.canPrint : true}
      canEdit={permissions.canEdit}
      canApprove={permissions.canApprove}
      onCancel={handleBack}
      onPrint={handlePrint}
      onSave={() => void handleSave()}
      onEdit={() => orderNo && navigate(`/purchase-orders/${orderNo}/edit`)}
      onApprove={() => void handleApprove()}
      cancelLabel={t.form.cancel}
      printLabel={t.form.print}
      saveLabel={t.form.saveOrder}
      savingLabel={t.form.saving}
      updateLabel={t.form.updateOrder}
      editLabel={t.form.edit}
      approveLabel={t.actions.approve}
      approvingLabel={t.actions.approving}
    />
  );

  const printHeader = (
    <div className="po-print-header print-only">
      <h2>{pageTitle}</h2>
      {orderNo && <p>{t.columns.orderNo}: {orderNo}</p>}
      {values.supplierName && <p>{t.form.supplier}: {values.supplierName}</p>}
      {values.documentDate && <p>{t.form.documentDate}: {formatDate(values.documentDate, lang)}</p>}
      {values.deliveryDate && <p>{t.form.deliveryDate}: {formatDate(values.deliveryDate, lang)}</p>}
    </div>
  );

  const itemErrors = errors.items?.[0];

  if (loading || configLoading) {
    return (
      <POFormPageLayout
        title={pageTitle}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={handleBack}
        t={t}
        toolbarActions={
          <LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />
        }
      >
        <div className="po-detail-skeleton" />
      </POFormPageLayout>
    );
  }

  return (
    <>
      {toastNode}
      <POFormPageLayout
      title={titleNode}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={handleBack}
      t={t}
      statusBadge={statusBadge}
      dirtyBanner={dirtyBanner}
      showAuditTab={mode !== 'create' && Boolean(order?.audit)}
      headerActions={headerActions}
      printHeader={printHeader}
      toolbarActions={
        <LanguageSwitcher lang={lang} onSwitch={setLang} ariaLabel={t.accessibility.language} />
      }
    >
      {loadError && <div className="po-detail-error">{loadError}</div>}
      {actionError && <div className="po-detail-error" role="alert">{actionError}</div>}

      {activeTab === 'basicInfo' && (
        <POBasicFormGrid
          sections={headerSections}
          values={values as unknown as Record<string, string | number | boolean>}
          errors={errors}
          readOnly={readOnly}
          onChange={handleFieldChange}
          onLookupSelect={handleLookupSelect}
          onFieldBlur={validateField}
          t={t}
          getLabel={(key) => resolveLabel(t, key)}
          lang={lang}
        />
      )}

      {activeTab === 'itemDetails' && (
        <div className="po-item-tab-content">
          {lineItemsNotice && (
            <div className="po-form-notice" role="status">{lineItemsNotice}</div>
          )}
          <POItemDetailsLayout
            table={
              <POLineItemsTable
                items={values.items}
                readOnly={readOnly}
                supplierCode={values.supplierCode}
                locationCode={values.locationCode}
                onChange={(items) => {
                  setValues((prev) => ({ ...prev, items }));
                  setErrors((prev) => {
                    if (!prev.items) return prev;
                    const next = { ...prev };
                    delete next.items;
                    return next;
                  });
                }}
                itemErrors={itemErrors}
                t={t}
              />
            }
            items={values.items}
            discount={values.discount}
            inclusiveVat={values.inclusiveVat}
            t={t}
          />
        </div>
      )}

      {activeTab === 'audit' && order?.audit && (
        <AuditTimeline audit={order.audit} t={t} lang={lang} />
      )}
    </POFormPageLayout>
    </>
  );
}
