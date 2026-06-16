import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPermissionsForRole, type Permission } from '../constants/permissions';

export function useUserPermissions(): Permission[] {
  const { session } = useAuth();
  return useMemo(() => getPermissionsForRole(session?.role), [session?.role]);
}

export function useHasPermission(permission: Permission): boolean {
  const permissions = useUserPermissions();
  return permissions.includes(permission);
}
