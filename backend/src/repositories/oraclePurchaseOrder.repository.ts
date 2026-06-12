import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  PurchaseOrderListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import type { PurchaseOrderRepository } from './purchaseOrder.repository';
import * as oracleService from '../services/oraclePurchaseOrder.service';

export const oraclePurchaseOrderRepository: PurchaseOrderRepository = {
  async getList(params: POListQueryParams, conn: Connection): Promise<POListResponse> {
    return oracleService.getPOList(params, conn);
  },

  async getDetail(orderNo: string, conn: Connection): Promise<PODetailResponse | null> {
    return oracleService.getPODetail(orderNo, conn);
  },

  async update(_orderNo: string, _payload: Partial<PurchaseOrderListItem>, _conn: Connection): Promise<PurchaseOrderListItem | null> {
    return null;
  },

  async approve(_orderNo: string, _conn: Connection): Promise<PurchaseOrderListItem | null> {
    return null;
  },
};
