import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  POListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import type { PurchaseOrderRepository } from './purchaseOrder.repository';
import * as oracleService from '../services/oraclePurchaseOrder.service';

export const oraclePurchaseOrderRepository: PurchaseOrderRepository = {
  async getList(params: POListQueryParams, conn?: Connection): Promise<POListResponse> {
    if (!conn) {
      throw new Error('Oracle connection required for list query');
    }
    return oracleService.getPOList(params, conn);
  },

  async getDetail(orderNo: string, conn?: Connection): Promise<PODetailResponse | null> {
    if (!conn) {
      throw new Error('Oracle connection required for detail query');
    }
    return oracleService.getPODetail(orderNo, conn);
  },

  async update(_orderNo: string, _payload: Partial<POListItem>, _conn?: Connection): Promise<POListItem | null> {
    return null;
  },

  async approve(_orderNo: string, _conn?: Connection): Promise<POListItem | null> {
    return null;
  },

  isApprovableStatus(_status: string): boolean {
    return false;
  },
};
