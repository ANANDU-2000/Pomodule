import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'erp.sidebar.expanded';
const DEFAULT_EXPANDED = ['purchase-order', 'po-transaction'];

function readExpanded(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return new Set(parsed);
      }
    }
  } catch {
    // ignore
  }
  return new Set(DEFAULT_EXPANDED);
}

export function useSidebarExpanded() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(readExpanded);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...expandedIds]));
    } catch {
      // ignore
    }
  }, [expandedIds]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback((id: string) => expandedIds.has(id), [expandedIds]);

  return { expandedIds, toggleExpand, isExpanded };
}
