import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  POListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';

export interface PurchaseOrderRepository {
  getList(params: POListQueryParams, conn?: Connection): Promise<POListResponse>;
  getDetail(orderNo: string, conn?: Connection): Promise<PODetailResponse | null>;
  update(orderNo: string, payload: Partial<POListItem>, conn?: Connection): Promise<POListItem | null>;
  approve(orderNo: string, conn?: Connection): Promise<POListItem | null>;
  isApprovableStatus(status: string): boolean;
}
