export type UserRole = 'ADMIN' | 'PURCHASE' | 'VIEWER';

export interface AuthUser {
  username: string;
  role: UserRole;
  name: string;
  compCode: string;
}

export interface AuthSession extends AuthUser {
  token: string;
}

export const AUTH_STORAGE_KEY = 'po_auth_token';
