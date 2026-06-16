// MOCK DATA — remove imports from services when real API is live
import type { FilterPeriod, POListParams, PurchaseOrder } from '../types/PurchaseOrder';
import { MOCK_SUPPLIERS } from './suppliers.mock';
import { MOCK_LOCATIONS } from './locations.mock';

const STATUSES = ['OPEN', 'APPROVED', 'CLOSED', 'CANCELLED'] as const;
const CURRENCIES = ['THB', 'USD', 'AED'] as const;

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export function buildInitialMockOrders(): PurchaseOrder[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const orders: PurchaseOrder[] = [];

  for (let i = 0; i < 20; i += 1) {
    const supplier = MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length];
    const location = MOCK_LOCATIONS[i % MOCK_LOCATIONS.length];
    const docDate = addDays(today, -((i * 4) % 90));
    const deliveryDate = addDays(docDate, 7 + (i % 14));
    const lineCount = 2 + (i % 5);
    const orderQty = lineCount * (10 + (i % 20));
    const orderValue = 5000 + (i * 23750) % 495000;
    const status = STATUSES[i % STATUSES.length];
    const dateStr = formatDate(docDate);
    const orderNo = `PO-YSG-${dateStr.replace(/-/g, '')}-${String(i + 1).padStart(4, '0')}`;

    orders.push({
      orderNo,
      documentDate: dateStr,
      supplierCode: supplier.suppCode,
      supplierName: supplier.suppName,
      locationCode: location.code,
      location: location.name,
      deliveryDate: formatDate(deliveryDate),
      orderQty,
      currency: CURRENCIES[i % CURRENCIES.length],
      orderValue,
      lineItemCount: lineCount,
      terms: supplier.payTerm,
      status,
      remarks: i % 3 === 0 ? `Mock PO remark ${i + 1}` : '',
      userId: i % 2 === 0 ? 'admin' : 'purchase',
      userName: i % 2 === 0 ? 'Admin User' : 'Purchase User',
      rowId: `mock-row-${i + 1}`,
      permissions: {
        canCreate: true,
        canEdit: status === 'OPEN',
        canView: true,
        canApprove: status === 'OPEN',
        canPrint: true,
      },
    });
  }

  return orders;
}

export function getDateRange(filter: FilterPeriod): { from: string; to: string } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fmt = formatDate;

  switch (filter) {
    case 'today':
      return { from: fmt(today), to: fmt(today) };
    case 'yesterday': {
      const y = addDays(today, -1);
      return { from: fmt(y), to: fmt(y) };
    }
    case 'this_week': {
      const from = addDays(today, -today.getDay());
      return { from: fmt(from), to: fmt(today) };
    }
    case 'last_week': {
      const from = addDays(today, -today.getDay() - 7);
      const to = addDays(from, 6);
      return { from: fmt(from), to: fmt(to) };
    }
    case 'this_month': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: fmt(from), to: fmt(today) };
    }
    case 'last_month': {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: fmt(from), to: fmt(to) };
    }
    default:
      return null;
  }
}

export function filterAndPaginateMockOrders(
  orders: PurchaseOrder[],
  params: POListParams,
): { data: PurchaseOrder[]; total: number; page: number; pageSize: number; totalPages: number } {
  let filtered = [...orders];

  if (params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter((po) =>
      po.orderNo.toLowerCase().includes(q)
      || po.supplierCode.toLowerCase().includes(q)
      || po.supplierName.toLowerCase().includes(q)
      || po.location.toLowerCase().includes(q)
      || po.status.toLowerCase().includes(q)
      || po.remarks.toLowerCase().includes(q),
    );
  }

  if (params.filter && params.filter !== 'all' && params.filter !== 'none') {
    const range = getDateRange(params.filter);
    if (range) {
      filtered = filtered.filter(
        (po) => po.documentDate >= range.from && po.documentDate <= range.to,
      );
    }
  }

  if (params.sortBy) {
    const key = params.sortBy;
    const dir = params.sortDirection === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  } else {
    filtered.sort((a, b) => b.documentDate.localeCompare(a.documentDate));
  }

  const total = filtered.length;
  const pageSize = params.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * pageSize;

  return {
    data: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}
