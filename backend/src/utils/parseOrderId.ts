import type { Request } from 'express';

export function parseOrderId(req: Request): string | null {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id || id.trim() === '') return null;
  return id;
}
