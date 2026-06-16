/** Role-based permissions until real auth API provides them. */
import type { UserRole } from '../types/auth';

export type Permission = 'PO_CREATE' | 'PO_EDIT' | 'PO_APPROVE';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: ['PO_CREATE', 'PO_EDIT', 'PO_APPROVE'],
  PURCHASE: ['PO_CREATE', 'PO_EDIT', 'PO_APPROVE'],
  VIEWER: [],
};

export function getPermissionsForRole(role: UserRole | undefined): Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

/** @deprecated Use getPermissionsForRole(session.role) */
export const DEFAULT_USER_PERMISSIONS: Permission[] = ['PO_CREATE', 'PO_EDIT', 'PO_APPROVE'];
