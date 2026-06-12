import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  POListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import type { PurchaseOrderRepository } from './purchaseOrder.repository';
import { applyListParams } from '../utils/applyListParams';

const SEED_ORDERS: POListItem[] = [
  { orderNo: '2026060001', documentDate: '2026-06-10', supplierCode: 'SUP001', supplierName: 'ABC Supplier LLC', location: 'Warehouse A', orderValue: 15000, status: 'Pending', deliveryDate: '2026-06-20', remarks: 'Urgent Order', userId: 'ANANDU' },
  { orderNo: '2026060002', documentDate: '2026-06-09', supplierCode: 'SUP002', supplierName: 'XYZ Trading Co', location: 'Warehouse B', orderValue: 25000, status: 'Approved', deliveryDate: '2026-06-22', remarks: 'Monthly Stock', userId: 'SURAG' },
  { orderNo: '2026060003', documentDate: '2026-06-08', supplierCode: 'SUP003', supplierName: 'PQR Industries', location: 'Warehouse C', orderValue: 18000, status: 'Pending', deliveryDate: '2026-06-25', remarks: 'Maintenance Items', userId: 'USER01' },
  { orderNo: '2026060004', documentDate: '2026-06-07', supplierCode: 'SUP004', supplierName: 'Gulf Materials Ltd', location: 'Dubai', orderValue: 42000, status: 'Approved', deliveryDate: '2026-06-18', remarks: 'Bulk procurement', userId: 'ADMIN' },
  { orderNo: '2026060005', documentDate: '2026-06-06', supplierCode: 'SUP005', supplierName: 'Emirates Parts FZE', location: 'Abu Dhabi', orderValue: 8750, status: 'Draft', deliveryDate: '2026-06-28', remarks: 'Spare parts order', userId: 'USER02' },
  { orderNo: '2026060006', documentDate: '2026-06-05', supplierCode: 'SUP006', supplierName: 'Desert Logistics LLC', location: 'Warehouse A', orderValue: 31200, status: 'Rejected', deliveryDate: '2026-06-15', remarks: 'Budget exceeded', userId: 'ANANDU' },
  { orderNo: '2026060007', documentDate: '2026-06-04', supplierCode: 'SUP001', supplierName: 'ABC Supplier LLC', location: 'Warehouse B', orderValue: 5600, status: 'Approved', deliveryDate: '2026-06-14', remarks: 'Office supplies', userId: 'SURAG' },
  { orderNo: '2026060008', documentDate: '2026-06-03', supplierCode: 'SUP002', supplierName: 'XYZ Trading Co', location: 'Dubai', orderValue: 19800, status: 'Pending', deliveryDate: '2026-06-19', remarks: 'IT equipment', userId: 'ADMIN' },
  { orderNo: '2026050009', documentDate: '2026-06-02', supplierCode: 'SUP003', supplierName: 'PQR Industries', location: 'Warehouse C', orderValue: 7300, status: 'Draft', deliveryDate: '2026-06-12', remarks: 'Pending approval', userId: 'USER01' },
  { orderNo: '2026050010', documentDate: '2026-06-01', supplierCode: 'SUP004', supplierName: 'Gulf Materials Ltd', location: 'Abu Dhabi', orderValue: 44500, status: 'Approved', deliveryDate: '2026-06-11', remarks: 'Construction materials', userId: 'USER02' },
  { orderNo: '2026050011', documentDate: '2026-05-28', supplierCode: 'SUP005', supplierName: 'Emirates Parts FZE', location: 'Warehouse A', orderValue: 12200, status: 'Pending', deliveryDate: '2026-06-08', remarks: 'Hydraulic components', userId: 'ANANDU' },
  { orderNo: '2026050012', documentDate: '2026-05-25', supplierCode: 'SUP006', supplierName: 'Desert Logistics LLC', location: 'Dubai', orderValue: 28900, status: 'Approved', deliveryDate: '2026-06-05', remarks: 'Fleet maintenance', userId: 'SURAG' },
  { orderNo: '2026050013', documentDate: '2026-05-20', supplierCode: 'SUP001', supplierName: 'ABC Supplier LLC', location: 'Warehouse B', orderValue: 6700, status: 'Rejected', deliveryDate: '2026-05-30', remarks: 'Duplicate order', userId: 'ADMIN' },
  { orderNo: '2026050014', documentDate: '2026-05-15', supplierCode: 'SUP002', supplierName: 'XYZ Trading Co', location: 'Warehouse C', orderValue: 33400, status: 'Approved', deliveryDate: '2026-05-28', remarks: 'Quarterly restock', userId: 'USER01' },
  { orderNo: '2026050015', documentDate: '2026-05-10', supplierCode: 'SUP003', supplierName: 'PQR Industries', location: 'Abu Dhabi', orderValue: 9100, status: 'Draft', deliveryDate: '2026-05-25', remarks: 'Awaiting vendor quote', userId: 'USER02' },
  { orderNo: '2026040016', documentDate: '2026-04-28', supplierCode: 'SUP004', supplierName: 'Gulf Materials Ltd', location: 'Dubai', orderValue: 51200, status: 'Approved', deliveryDate: '2026-05-10', remarks: 'April bulk order', userId: 'ANANDU' },
  { orderNo: '2026040017', documentDate: '2026-04-15', supplierCode: 'SUP005', supplierName: 'Emirates Parts FZE', location: 'Warehouse A', orderValue: 14800, status: 'Pending', deliveryDate: '2026-04-30', remarks: 'Safety equipment', userId: 'SURAG' },
  { orderNo: '2026040018', documentDate: '2026-04-05', supplierCode: 'SUP006', supplierName: 'Desert Logistics LLC', location: 'Warehouse B', orderValue: 22300, status: 'Rejected', deliveryDate: '2026-04-20', remarks: 'Quality issues reported', userId: 'ADMIN' },
  { orderNo: '2026040019', documentDate: '2026-04-01', supplierCode: 'SUP001', supplierName: 'ABC Supplier LLC', location: 'Warehouse C', orderValue: 8900, status: 'Approved', deliveryDate: '2026-04-15', remarks: 'Q1 closing order', userId: 'USER01' },
  { orderNo: '2026030020', documentDate: '2026-03-20', supplierCode: 'SUP002', supplierName: 'XYZ Trading Co', location: 'Abu Dhabi', orderValue: 37600, status: 'Approved', deliveryDate: '2026-04-05', remarks: 'Legacy system migration', userId: 'USER02' },
];

let orders: POListItem[] = [...SEED_ORDERS];

const APPROVABLE_STATUSES = new Set(['Pending', 'Draft']);

export const mockPurchaseOrderRepository: PurchaseOrderRepository = {
  async getList(params: POListQueryParams, _conn?: Connection): Promise<POListResponse> {
    return applyListParams(orders, params);
  },

  async getDetail(orderNo: string, _conn?: Connection): Promise<PODetailResponse | null> {
    const item = orders.find((o) => o.orderNo === orderNo);
    return item ?? null;
  },

  async update(orderNo: string, payload: Partial<POListItem>, _conn?: Connection): Promise<POListItem | null> {
    const index = orders.findIndex((o) => o.orderNo === orderNo);
    if (index < 0) return null;
    orders[index] = { ...orders[index], ...payload, orderNo };
    return orders[index];
  },

  async approve(orderNo: string, _conn?: Connection): Promise<POListItem | null> {
    const index = orders.findIndex((o) => o.orderNo === orderNo);
    if (index < 0) return null;
    const current = orders[index];
    if (!APPROVABLE_STATUSES.has(current.status)) {
      return null;
    }
    orders[index] = { ...current, status: 'Approved' };
    return orders[index];
  },

  isApprovableStatus(status: string): boolean {
    return APPROVABLE_STATUSES.has(status);
  },
};
