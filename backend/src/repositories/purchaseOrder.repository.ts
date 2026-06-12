import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  PurchaseOrderListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';

export interface PurchaseOrderRepository {
  getList(params: POListQueryParams, conn: Connection): Promise<POListResponse>;
  getDetail(orderNo: string, conn: Connection): Promise<PODetailResponse | null>;
  update(orderNo: string, payload: Partial<PurchaseOrderListItem>, conn: Connection): Promise<PurchaseOrderListItem | null>;
  approve(orderNo: string, conn: Connection): Promise<PurchaseOrderListItem | null>;
}
