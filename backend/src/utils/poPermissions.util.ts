import type { POActionPermissions, PurchaseOrderListItem } from '../types/purchaseOrder.types';

const APPROVED_STATUSES = new Set(['Approved', 'APPROVED']);
const EDITABLE_STATUSES = new Set(['Draft', 'Pending', 'DRAFT', 'PENDING']);
const APPROVABLE_STATUSES = new Set(['Pending', 'Draft', 'PENDING', 'DRAFT']);

const DEFAULT_DEV_PERMISSIONS = ['PO_CREATE', 'PO_EDIT', 'PO_APPROVE'];

export function resolvePOPermissions(
  order: PurchaseOrderListItem | null,
  userPermissions: string[] = DEFAULT_DEV_PERMISSIONS,
): POActionPermissions {
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
