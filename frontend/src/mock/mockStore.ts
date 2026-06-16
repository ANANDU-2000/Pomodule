// MOCK DATA — in-memory store resets on page refresh
import type { POFormPayload, POListParams, PurchaseOrder } from '../types/PurchaseOrder';
import type { POLineItem } from '../types/formConfig';
import type { PODetailResponse } from '../services/purchaseOrderService';
import { AUTH_STORAGE_KEY } from '../types/auth';
import type { AuthSession } from '../types/auth';
import { buildInitialMockOrders, filterAndPaginateMockOrders } from './purchaseOrders.mock';
import { MOCK_ITEMS } from './items.mock';
import { MOCK_SUPPLIERS } from './suppliers.mock';

export interface MockPORecord extends PurchaseOrder {
  address: string;
  shipmentMode: string;
  paymentTerm: string;
  docLocation: string;
  exchangeRate: number;
  discount: number;
  inclusiveVat: boolean;
  docType: string;
  taxInvoiceDoc: string;
  items: POLineItem[];
}

let orderCounter = 1000;
const records: MockPORecord[] = buildInitialMockOrders().map((po, i) => {
  const supplier = MOCK_SUPPLIERS.find((s) => s.suppCode === po.supplierCode) ?? MOCK_SUPPLIERS[0];
  const items = buildDefaultLineItems(i + 1, po.lineItemCount);
  return {
    ...po,
    address: supplier.address,
    shipmentMode: supplier.shipMode,
    paymentTerm: supplier.payTerm,
    docLocation: supplier.docLocn,
    exchangeRate: po.currency === 'THB' ? 1 : 35.5,
    discount: i % 4 === 0 ? 5 : 0,
    inclusiveVat: i % 2 === 0,
    docType: 'PO',
    taxInvoiceDoc: '',
    items,
  };
});

function buildDefaultLineItems(seed: number, count: number): POLineItem[] {
  return Array.from({ length: Math.max(1, count) }, (_, idx) => {
    const item = MOCK_ITEMS[(seed + idx) % MOCK_ITEMS.length];
    const qty = 10 + idx * 5;
    const rate = 100 + (seed + idx) * 25;
    const discAmt = 0;
    const netValue = qty * rate - discAmt;
    return {
      itemCode: item.code,
      itemName: item.name,
      uom: item.uom ?? 'PCS',
      quantity: qty,
      rate,
      discPercent: 0,
      discAmt,
      netValue,
      tolPlus: 0,
      tolMinus: 0,
    };
  });
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function formatToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function generateOrderNo(compCode: string): string {
  orderCounter += 1;
  const datePart = formatToday().replace(/-/g, '');
  return `PO-${compCode}-${datePart}-${String(orderCounter).padStart(4, '0')}`;
}

function sumLineItems(items: POLineItem[]): { qty: number; value: number } {
  return items.reduce(
    (acc, line) => ({
      qty: acc.qty + line.quantity,
      value: acc.value + line.netValue,
    }),
    { qty: 0, value: 0 },
  );
}

export function mockFetchPurchaseOrders(params: POListParams) {
  return filterAndPaginateMockOrders(records, params);
}

export function mockFetchPODetail(orderNo: string): PODetailResponse | null {
  const record = records.find((r) => r.orderNo === orderNo);
  if (!record) return null;
  const { items: _items, ...rest } = record;
  return {
    ...rest,
    address: record.address,
    shipmentMode: record.shipmentMode,
    paymentTerm: record.paymentTerm,
    docLocation: record.docLocation,
    exchangeRate: record.exchangeRate,
    discount: record.discount,
    inclusiveVat: record.inclusiveVat,
    docType: record.docType,
    taxInvoiceDoc: record.taxInvoiceDoc,
    audit: {
      createdBy: record.userName,
      createdDate: record.documentDate,
      updatedBy: record.userName,
      updatedDate: record.documentDate,
      approvedBy: record.status === 'APPROVED' ? 'Admin User' : '',
      approvedDate: record.status === 'APPROVED' ? record.documentDate : '',
    },
  };
}

/** True when this order only exists in the in-memory mock store (not Oracle). */
export function hasMockPurchaseOrder(orderNo: string): boolean {
  return records.some((r) => r.orderNo === orderNo);
}

export function mockFetchPOLineItems(orderNo: string) {
  const record = records.find((r) => r.orderNo === orderNo);
  if (record?.items.length) {
    return {
      configured: true,
      data: record.items,
    };
  }

  const sample = buildDefaultLineItems(orderNo.length + 1, 3);
  return {
    configured: true,
    data: sample,
  };
}

export function mockCreatePO(payload: POFormPayload): PurchaseOrder {
  const session = readSession();
  const compCode = session?.compCode ?? 'YSG';
  const totals = sumLineItems(payload.items);
  const orderNo = generateOrderNo(compCode);
  const today = formatToday();

  const record: MockPORecord = {
    orderNo,
    documentDate: payload.documentDate || today,
    supplierCode: payload.supplierCode,
    supplierName: payload.supplierName,
    locationCode: payload.locationCode,
    location: payload.location ?? '',
    deliveryDate: payload.deliveryDate,
    orderQty: totals.qty,
    currency: payload.currency,
    orderValue: totals.value,
    lineItemCount: payload.items.length,
    terms: payload.paymentTerm,
    status: 'OPEN',
    remarks: payload.remarks ?? '',
    userId: session?.username ?? 'mock',
    userName: session?.name ?? 'Mock User',
    rowId: `mock-row-${orderNo}`,
    address: payload.address,
    shipmentMode: payload.shipmentMode,
    paymentTerm: payload.paymentTerm,
    docLocation: payload.docLocation,
    exchangeRate: payload.exchangeRate,
    discount: payload.discount ?? 0,
    inclusiveVat: payload.inclusiveVat ?? false,
    docType: payload.docType ?? 'PO',
    taxInvoiceDoc: payload.taxInvoiceDoc ?? '',
    items: payload.items.map((item) => ({ ...item })),
    permissions: {
      canCreate: true,
      canEdit: true,
      canView: true,
      canApprove: true,
      canPrint: true,
    },
  };

  records.unshift(record);
  const { items: _items, ...po } = record;
  return po;
}

export function mockUpdatePO(orderNo: string, payload: POFormPayload): PurchaseOrder | null {
  const index = records.findIndex((r) => r.orderNo === orderNo);
  if (index === -1) return null;
  const totals = sumLineItems(payload.items);
  const existing = records[index];
  const updated: MockPORecord = {
    ...existing,
    supplierCode: payload.supplierCode,
    supplierName: payload.supplierName,
    locationCode: payload.locationCode,
    location: payload.location ?? existing.location,
    deliveryDate: payload.deliveryDate,
    documentDate: payload.documentDate,
    currency: payload.currency,
    orderQty: totals.qty,
    orderValue: totals.value,
    lineItemCount: payload.items.length,
    terms: payload.paymentTerm,
    remarks: payload.remarks ?? '',
    address: payload.address,
    shipmentMode: payload.shipmentMode,
    paymentTerm: payload.paymentTerm,
    docLocation: payload.docLocation,
    exchangeRate: payload.exchangeRate,
    discount: payload.discount ?? 0,
    inclusiveVat: payload.inclusiveVat ?? false,
    docType: payload.docType ?? existing.docType,
    taxInvoiceDoc: payload.taxInvoiceDoc ?? '',
    items: payload.items.map((item) => ({ ...item })),
  };
  records[index] = updated;
  const { items: _items, ...po } = updated;
  return po;
}

export function mockApprovePO(orderNo: string): PurchaseOrder | null {
  const index = records.findIndex((r) => r.orderNo === orderNo);
  if (index === -1) return null;
  records[index] = {
    ...records[index],
    status: 'APPROVED',
    permissions: {
      ...records[index].permissions,
      canEdit: false,
      canApprove: false,
      canCreate: true,
      canView: true,
      canPrint: true,
    },
  };
  const { items: _items, ...po } = records[index];
  return po;
}
