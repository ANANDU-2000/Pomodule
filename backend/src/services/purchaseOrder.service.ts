import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  POListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import { env } from '../config/env';
import type { PurchaseOrderRepository } from '../repositories/purchaseOrder.repository';
import { mockPurchaseOrderRepository } from '../repositories/mockPurchaseOrder.repository';
import { oraclePurchaseOrderRepository } from '../repositories/oraclePurchaseOrder.repository';

const repository: PurchaseOrderRepository =
  env.DATA_SOURCE === 'oracle' ? oraclePurchaseOrderRepository : mockPurchaseOrderRepository;

export async function getPOList(
  params: POListQueryParams,
  conn?: Connection,
): Promise<POListResponse> {
  return repository.getList(params, conn);
}

export async function getPODetail(
  id: string,
  conn?: Connection,
): Promise<PODetailResponse | null> {
  return repository.getDetail(id, conn);
}

export async function updatePO(
  id: string,
  payload: Partial<POListItem>,
  conn?: Connection,
): Promise<POListItem | null> {
  return repository.update(id, payload, conn);
}

export async function approvePO(
  id: string,
  conn?: Connection,
): Promise<POListItem | null> {
  return repository.approve(id, conn);
}

export function isApprovableStatus(status: string): boolean {
  return repository.isApprovableStatus(status);
}
