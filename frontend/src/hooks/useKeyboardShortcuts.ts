import { useEffect } from 'react';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export interface KeyboardShortcutHandlers {
  onFocusSearch?: () => void;
  onToggleSidebar?: () => void;
  onOpenFilter?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const inEditable = isEditableTarget(e.target);

      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handlers.onFocusSearch?.();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handlers.onToggleSidebar?.();
        return;
      }

      if (e.altKey && e.key.toLowerCase() === 'f' && !inEditable) {
        e.preventDefault();
        handlers.onOpenFilter?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
