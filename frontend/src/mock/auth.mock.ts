// MOCK DATA — remove imports from services when real API is live
import { delay } from './delay';
import type { AuthSession, UserRole } from '../types/auth';

interface MockUserRecord {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  compCode: string;
}

const MOCK_USERS: MockUserRecord[] = [
  { username: 'admin', password: 'admin123', role: 'ADMIN', name: 'Admin User', compCode: 'YSG' },
  { username: 'purchase', password: 'purchase123', role: 'PURCHASE', name: 'Purchase User', compCode: 'YSG' },
  { username: 'viewer', password: 'viewer123', role: 'VIEWER', name: 'Viewer User', compCode: 'YSG' },
];

export async function mockLogin(username: string, password: string): Promise<AuthSession | null> {
  await delay(600);
  const user = MOCK_USERS.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password,
  );
  if (!user) return null;
  return {
    username: user.username,
    role: user.role,
    name: user.name,
    compCode: user.compCode,
    token: 'mock-token',
  };
}
