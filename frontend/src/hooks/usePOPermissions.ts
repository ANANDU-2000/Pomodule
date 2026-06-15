import type { POActionPermissions } from '../types/formConfig';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import { DEFAULT_USER_PERMISSIONS } from '../constants/permissions';

const APPROVED_STATUSES = new Set(['Approved', 'APPROVED']);
const EDITABLE_STATUSES = new Set(['Draft', 'Pending', 'DRAFT', 'PENDING']);
const APPROVABLE_STATUSES = new Set(['Pending', 'Draft', 'PENDING', 'DRAFT']);

export function resolvePOPermissions(
  order: PurchaseOrder | null,
  userPermissions: string[] = DEFAULT_USER_PERMISSIONS,
): POActionPermissions {
  if (order?.permissions) return order.permissions;

  const canCreate = userPermissions.includes('PO_CREATE');
  const isApproved = order ? APPROVED_STATUSES.has(order.status) : false;
  const canEdit = order
    ? userPermissions.includes('PO_EDIT') && EDITABLE_STATUSES.has(order.status) && !isApproved
    : false;
  const canApprove = order
    ? userPermissions.includes('PO_APPROVE') && APPROVABLE_STATUSES.has(order.status)
    : false;

  return {
    canCreate,
    canEdit,
    canView: true,
    canApprove,
    canPrint: true,
  };
}

export function usePOPermissions(order: PurchaseOrder | null): POActionPermissions {
  return resolvePOPermissions(order);
}
