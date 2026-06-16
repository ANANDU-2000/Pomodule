import type { ReactNode } from 'react';
import OrderTotals from './OrderTotals';
import type { TranslationMap } from '../../types/i18n';

interface POItemDetailsLayoutProps {
  table: ReactNode;
  items: { netValue: number }[];
  discount: number;
  inclusiveVat: boolean;
  t: TranslationMap;
}

export default function POItemDetailsLayout({
  table,
  items,
  discount,
  inclusiveVat,
  t,
}: POItemDetailsLayoutProps) {
  return (
    <div className="po-item-layout po-item-layout-fit">
      <div className="po-item-layout-main">{table}</div>
      <footer className="po-item-totals-footer no-print" aria-label={t.form.orderTotal}>
        <OrderTotals items={items} discount={discount} inclusiveVat={inclusiveVat} t={t} />
      </footer>
    </div>
  );
}
