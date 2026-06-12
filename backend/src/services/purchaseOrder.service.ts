import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  PurchaseOrderListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import { oraclePurchaseOrderRepository } from '../repositories/oraclePurchaseOrder.repository';

export async function getPOList(
  params: POListQueryParams,
  conn: Connection,
): Promise<POListResponse> {
  return oraclePurchaseOrderRepository.getList(params, conn);
}

export async function getPODetail(
  id: string,
  conn: Connection,
): Promise<PODetailResponse | null> {
  return oraclePurchaseOrderRepository.getDetail(id, conn);
}

export async function updatePO(
  id: string,
  payload: Partial<PurchaseOrderListItem>,
  conn: Connection,
): Promise<PurchaseOrderListItem | null> {
  return oraclePurchaseOrderRepository.update(id, payload, conn);
}

export async function approvePO(
  id: string,
  conn: Connection,
): Promise<PurchaseOrderListItem | null> {
  return oraclePurchaseOrderRepository.approve(id, conn);
}
