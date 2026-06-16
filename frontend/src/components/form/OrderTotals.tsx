import type { TranslationMap } from '../../types/i18n';
import { calcOrderTotals } from '../../schemas/poForm.schema';

interface OrderTotalsProps {
  items: { netValue: number }[];
  discount: number;
  inclusiveVat: boolean;
  t: TranslationMap;
  sticky?: boolean;
}

export default function OrderTotals({ items, discount, inclusiveVat, t, sticky }: OrderTotalsProps) {
  const { subtotal, headerDiscount, vat, total } = calcOrderTotals(items, discount, inclusiveVat);

  return (
    <div className={`order-totals${sticky ? ' order-totals-panel' : ''}`}>
      <div className="order-totals-row">
        <span>{t.form.subtotal}</span>
        <span className="order-totals-value">{subtotal.toFixed(2)}</span>
      </div>
      <div className="order-totals-row">
        <span>{t.form.headerDiscount} ({discount}%)</span>
        <span className="order-totals-value order-totals-discount">
          {headerDiscount > 0 ? `-${headerDiscount.toFixed(2)}` : '-0.00'}
        </span>
      </div>
      <div className="order-totals-row">
        <span>{t.form.vat}</span>
        <span className="order-totals-value">{vat.toFixed(2)}</span>
      </div>
      <div className="order-totals-divider" />
      <div className="order-totals-row order-totals-total">
        <span>{t.form.orderTotal}</span>
        <span className="order-totals-value">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
