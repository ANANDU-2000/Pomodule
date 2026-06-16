import { validateItem } from '../../services/itemValidateService';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { POLineItem } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import { calcLineItem } from '../../schemas/poForm.schema';
import { useLineItemGridNavigation } from '../../hooks/useLineItemGridNavigation';
import { NumberInput, CurrencyInput, SearchSelect, TextField } from '../erp';
import { AppIcon, ChevronLeft, ChevronRight, Plus, Trash2 } from '../icons';

export const LINE_PAGE_SIZE = 10;
export const DEFAULT_ITEM_ROWS = 3;

interface POLineItemsTableProps {
  items: POLineItem[];
  readOnly?: boolean;
  supplierCode?: string;
  locationCode?: string;
  onChange: (items: POLineItem[]) => void;
  itemErrors?: string;
  t: TranslationMap;
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

export default function POLineItemsTable({
  items,
  readOnly,
  supplierCode,
  locationCode,
  onChange,
  itemErrors,
  t,
}: POLineItemsTableProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / LINE_PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  useEffect(() => {
    if (pageIndex > pageCount - 1) {
      setPageIndex(Math.max(0, pageCount - 1));
    }
  }, [pageCount, pageIndex]);

  const pageStart = safePageIndex * LINE_PAGE_SIZE;
  const pageItems = useMemo(
    () => items.slice(pageStart, pageStart + LINE_PAGE_SIZE),
    [items, pageStart],
  );

  const supplierSelected = Boolean(supplierCode?.trim());

  const { handleGridKeyDown, focusNext, focusCell, addLineRef } = useLineItemGridNavigation(items.length, {
    pageSize: LINE_PAGE_SIZE,
    pageIndex: safePageIndex,
    setPageIndex,
  });

  const updateRow = useCallback((index: number, patch: Partial<POLineItem>) => {
    onChange(
      items.map((row, i) => {
        if (i !== index) return row;
        const merged = { ...row, ...patch };
        const { discAmt, netValue } = calcLineItem(merged);
        return { ...merged, discAmt, netValue };
      }),
    );
  }, [items, onChange]);

  const handleItemSelect = useCallback(
    async (index: number, item: { code: string; name: string; uom?: string }) => {
      try {
        const validated = await validateItem({
          itemCode: item.code,
          locnCode: locationCode,
          compCode: 'YSG',
          txnCode: 'PO',
          langCode: 'EN',
        });
        updateRow(index, {
          itemCode: validated.itemCode,
          itemName: validated.itemName,
          uom: validated.uom,
          rate: validated.suggestedRate,
        });
      } catch {
        updateRow(index, {
          itemCode: item.code,
          itemName: item.name,
          uom: item.uom ?? '',
        });
      }
    },
    [locationCode, updateRow],
  );

  const addRow = () => {
    const next = [...items, emptyLine()];
    onChange(next);
    const newIndex = next.length - 1;
    setPageIndex(Math.ceil(next.length / LINE_PAGE_SIZE) - 1);
    requestAnimationFrame(() => focusCell(newIndex, 'itemCode'));
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) return;
    const next = items.filter((_, i) => i !== index);
    onChange(next);
    const nextPageCount = Math.max(1, Math.ceil(next.length / LINE_PAGE_SIZE));
    if (safePageIndex >= nextPageCount) {
      setPageIndex(nextPageCount - 1);
    }
  };

  const pageLabel = t.form.linePageOf
    .replace('{page}', String(safePageIndex + 1))
    .replace('{total}', String(pageCount));

  return (
    <div className="po-item-details-card">
      {!readOnly && (
        <div className="po-item-details-toolbar">
          <button
            type="button"
            ref={addLineRef}
            className="btn btn-dark btn-sm po-item-add-btn"
            onClick={addRow}
          >
            <AppIcon icon={Plus} size={14} />
            {t.form.addItem}
          </button>
        </div>
      )}

      {itemErrors && (
        <span className="erp-field-error po-line-error" role="alert" data-field-error="true">
          {itemErrors}
        </span>
      )}

      {!readOnly && !supplierSelected && (
        <p className="po-line-supplier-hint" role="status">
          {t.form.selectSupplierFirst}
        </p>
      )}

      <div className="erp-line-table-wrapper po-item-table-wrapper">
        <table className="erp-line-table po-item-table data-table">
          <colgroup>
            <col className="po-item-col-code" />
            <col className="po-item-col-name" />
            <col className="po-item-col-grade" />
            <col className="po-item-col-grade" />
            <col className="po-item-col-stock" />
            <col className="po-item-col-uom" />
            <col className="po-item-col-qty" />
            <col className="po-item-col-rate" />
            <col className="po-item-col-disc" />
            <col className="po-item-col-disc" />
            <col className="po-item-col-total" />
            <col className="po-item-col-tol" />
            <col className="po-item-col-tol" />
            {!readOnly && <col className="po-item-col-actions" />}
          </colgroup>
          <thead>
            <tr>
              <th>{t.form.itemCodeBarcode}</th>
              <th>Item Name</th>
              <th>Grade 1</th>
              <th>Grade 2</th>
              <th className="align-right">Free Stock</th>
              <th className="align-center">{t.form.uom}</th>
              <th className="align-right">{t.form.quantity}</th>
              <th className="align-right">{t.form.rate}</th>
              <th className="align-right">Disc %</th>
              <th className="align-right">Disc Amt</th>
              <th className="align-right">Net Value</th>
              <th className="align-right">Tol +</th>
              <th className="align-right">Tol -</th>
              {!readOnly && <th className="po-item-col-actions-th" aria-label={t.columns.actions} />}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((row, pageRowIndex) => {
              const index = pageStart + pageRowIndex;
              return (
                <tr key={row.itemCode ? `${row.itemCode}-${index}` : `row-${index}`} className="po-item-row">
                  <td className="po-line-item-code-cell">
                    {readOnly ? (
                      <div className="po-line-item-readonly">
                        <span className="po-line-item-code">{row.itemCode}</span>
                        {row.itemName && <span className="po-line-item-name">{row.itemName}</span>}
                      </div>
                    ) : (
                      <div className="po-line-item-input-stack">
                        <SearchSelect
                          type="item"
                          value={row.itemCode}
                          displayValue={row.itemCode}
                          supplierCode={supplierCode}
                          disabled={!supplierSelected}
                          placeholder={
                            supplierSelected
                              ? t.form.itemCodeBarcodePlaceholder
                              : t.form.selectSupplierFirst
                          }
                          t={t}
                          onSelect={(item) => {
                            void handleItemSelect(index, item);
                          }}
                          onQueryCommit={(q) => {
                            void handleItemSelect(index, { code: q, name: '' });
                          }}
                          onAfterSelect={() => focusNext(index, 'itemCode')}
                          gridInputProps={{
                            'data-grid-row': index,
                            'data-grid-col': 'itemCode',
                            'aria-label': `${t.form.itemCodeBarcode} ${index + 1}`,
                            onKeyDown: (e) => handleGridKeyDown(e, index, 'itemCode'),
                          }}
                        />
                        {row.itemName && (
                          <span className="po-line-item-name">{row.itemName}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="po-item-readonly-value po-item-name-strong">{row.itemName || '-'}</span>
                  </td>
                  <td>
                    <span className="po-item-readonly-value">{row.grade1 ?? '-'}</span>
                  </td>
                  <td>
                    <span className="po-item-readonly-value">{row.grade2 ?? '-'}</span>
                  </td>
                  <td className="align-right">
                    <span className="po-item-readonly-value">{Number(row.freeStock ?? 0).toFixed(2)}</span>
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="po-item-readonly-value align-center">{row.uom}</span>
                    ) : (
                      <div className="po-item-uom-wrap">
                        <TextField
                          className="erp-line-input po-item-field po-line-uom-input"
                          value={row.uom}
                          placeholder={t.form.selectUom}
                          data-grid-row={index}
                          data-grid-col="uom"
                          aria-label={`${t.form.uom} ${index + 1}`}
                          onChange={(e) => updateRow(index, { uom: e.target.value })}
                          onKeyDown={(e) => handleGridKeyDown(e, index, 'uom')}
                        />
                      </div>
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      <span className="po-item-readonly-value">{row.quantity}</span>
                    ) : (
                      <NumberInput
                        className="erp-line-input po-item-field"
                        value={row.quantity}
                        min={0.001}
                        step="any"
                        data-grid-row={index}
                        data-grid-col="quantity"
                        aria-label={`${t.form.quantity} ${index + 1}`}
                        onChange={(e) => updateRow(index, { quantity: Number(e.target.value) })}
                        onKeyDown={(e) => handleGridKeyDown(e, index, 'quantity')}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      <span className="po-item-readonly-value">{row.rate.toFixed(2)}</span>
                    ) : (
                      <CurrencyInput
                        className="erp-line-input po-item-field"
                        value={row.rate}
                        min={0}
                        data-grid-row={index}
                        data-grid-col="rate"
                        aria-label={`${t.form.rate} ${index + 1}`}
                        onChange={(e) => updateRow(index, { rate: Number(e.target.value) })}
                        onKeyDown={(e) => handleGridKeyDown(e, index, 'rate')}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      <span className="po-item-readonly-value">{row.discPercent.toFixed(2)}</span>
                    ) : (
                      <NumberInput
                        className="erp-line-input po-item-field"
                        value={row.discPercent}
                        min={0}
                        data-grid-row={index}
                        data-grid-col="rate"
                        aria-label={`Disc % ${index + 1}`}
                        onChange={(e) => updateRow(index, { discPercent: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    <span className="po-item-readonly-value">{row.discAmt.toFixed(2)}</span>
                  </td>
                  <td className="po-line-total-cell align-right">
                    <span className="po-item-total-value">{row.netValue.toFixed(2)}</span>
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      <span className="po-item-readonly-value">{row.tolPlus.toFixed(2)}</span>
                    ) : (
                      <NumberInput
                        className="erp-line-input po-item-field"
                        value={row.tolPlus}
                        min={0}
                        data-grid-row={index}
                        data-grid-col="rate"
                        aria-label={`Tol + ${index + 1}`}
                        onChange={(e) => updateRow(index, { tolPlus: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      <span className="po-item-readonly-value">{row.tolMinus.toFixed(2)}</span>
                    ) : (
                      <NumberInput
                        className="erp-line-input po-item-field"
                        value={row.tolMinus}
                        min={0}
                        data-grid-row={index}
                        data-grid-col="rate"
                        aria-label={`Tol - ${index + 1}`}
                        onChange={(e) => updateRow(index, { tolMinus: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  {!readOnly && (
                    <td className="po-item-actions-cell">
                      <button
                        type="button"
                        className="btn btn-icon btn-danger-ghost po-item-delete-btn"
                        onClick={() => removeRow(index)}
                        disabled={items.length <= 1}
                        aria-label={t.form.removeLineAria}
                      >
                        <AppIcon icon={Trash2} size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length > LINE_PAGE_SIZE && (
        <div className="erp-line-pager no-print">
          <span className="erp-line-pager-label">{pageLabel}</span>
          <div className="erp-line-pager-actions">
            <button
              type="button"
              className="btn btn-icon btn-default"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={safePageIndex === 0}
              aria-label={t.pagination.previousPage}
            >
              <AppIcon icon={ChevronLeft} size={16} />
            </button>
            <button
              type="button"
              className="btn btn-icon btn-default"
              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePageIndex >= pageCount - 1}
              aria-label={t.pagination.nextPage}
            >
              <AppIcon icon={ChevronRight} size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
