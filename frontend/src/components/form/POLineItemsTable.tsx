import type { POLineItem } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import { calcLineItem } from '../../schemas/poForm.schema';
import { ERPLookup } from '../erp';
import { AppIcon, Trash2 } from '../icons';

interface POLineItemsTableProps {
  items: POLineItem[];
  readOnly?: boolean;
  supplierCode?: string;
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
  onChange,
  itemErrors,
  t,
}: POLineItemsTableProps) {
  const updateRow = (index: number, patch: Partial<POLineItem>) => {
    const next = items.map((row, i) => {
      if (i !== index) return row;
      const merged = { ...row, ...patch };
      const { discAmt, netValue } = calcLineItem(merged);
      return { ...merged, discAmt, netValue };
    });
    onChange(next);
  };

  const addRow = () => onChange([...items, emptyLine()]);

  const removeRow = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <section className="erp-form-section erp-section-card erp-line-section">
      <div className="erp-section-card-header">
        <h2 className="erp-section-card-title">{t.form.itemDetails}</h2>
        {!readOnly && (
          <button type="button" className="btn btn-default btn-sm" onClick={addRow}>
            {t.form.addLine}
          </button>
        )}
      </div>
      <div className="erp-section-body">
        {itemErrors && (
          <span className="erp-field-error po-line-error" role="alert" data-field-error="true">
            {itemErrors}
          </span>
        )}
        <div className="erp-line-table-wrapper">
          <table className="erp-line-table data-table">
            <thead>
              <tr>
                <th>{t.form.itemCode}</th>
                <th>{t.form.itemName}</th>
                <th>{t.form.uom}</th>
                <th className="align-right">{t.form.quantity}</th>
                <th className="align-right">{t.form.rate}</th>
                <th className="align-right">{t.form.discPercent}</th>
                <th className="align-right">{t.form.discAmt}</th>
                <th className="align-right">{t.form.tolPlus}</th>
                <th className="align-right">{t.form.tolMinus}</th>
                <th className="align-right">{t.form.netValue}</th>
                {!readOnly && <th className="align-center">{t.columns.actions}</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr key={row.itemCode ? `${row.itemCode}-${index}` : `row-${index}`} className="data-row">
                  <td>
                    {readOnly ? (
                      row.itemCode
                    ) : (
                      <ERPLookup
                        type="item"
                        value={row.itemCode}
                        displayValue={row.itemCode}
                        supplierCode={supplierCode}
                        t={t}
                        onSelect={(item) =>
                          updateRow(index, { itemCode: item.code, itemName: item.name, uom: item.uom ?? row.uom })
                        }
                      />
                    )}
                  </td>
                  <td className="po-line-readonly">{row.itemName}</td>
                  <td className="po-line-readonly">{row.uom}</td>
                  <td className="align-right">
                    {readOnly ? (
                      row.quantity
                    ) : (
                      <input
                        type="number"
                        className="erp-input erp-line-input"
                        value={row.quantity}
                        min={0.001}
                        step="any"
                        onChange={(e) => updateRow(index, { quantity: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      row.rate.toFixed(2)
                    ) : (
                      <input
                        type="number"
                        className="erp-input erp-line-input"
                        value={row.rate}
                        min={0}
                        step="any"
                        onChange={(e) => updateRow(index, { rate: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      row.discPercent
                    ) : (
                      <input
                        type="number"
                        className="erp-input erp-line-input"
                        value={row.discPercent}
                        min={0}
                        step="any"
                        onChange={(e) => updateRow(index, { discPercent: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="col-numeric align-right">{row.discAmt.toFixed(2)}</td>
                  <td className="align-right">
                    {readOnly ? (
                      row.tolPlus
                    ) : (
                      <input
                        type="number"
                        className="erp-input erp-line-input"
                        value={row.tolPlus}
                        min={0}
                        step="any"
                        onChange={(e) => updateRow(index, { tolPlus: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="align-right">
                    {readOnly ? (
                      row.tolMinus
                    ) : (
                      <input
                        type="number"
                        className="erp-input erp-line-input"
                        value={row.tolMinus}
                        min={0}
                        step="any"
                        onChange={(e) => updateRow(index, { tolMinus: Number(e.target.value) })}
                      />
                    )}
                  </td>
                  <td className="col-numeric align-right">{row.netValue.toFixed(2)}</td>
                  {!readOnly && (
                    <td className="align-center">
                      <button
                        type="button"
                        className="btn btn-icon btn-danger-ghost"
                        onClick={() => removeRow(index)}
                        disabled={items.length <= 1}
                        aria-label={t.form.removeLineAria}
                      >
                        <AppIcon icon={Trash2} size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
