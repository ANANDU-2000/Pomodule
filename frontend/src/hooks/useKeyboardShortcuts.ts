import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS } from '../constants/keyboardShortcuts';

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
      const key = e.key.toLowerCase();

      if (e.ctrlKey && key === KEYBOARD_SHORTCUTS.focusSearch.key) {
        e.preventDefault();
        handlers.onFocusSearch?.();
        return;
      }

      if (e.ctrlKey && key === KEYBOARD_SHORTCUTS.toggleSidebar.key) {
        e.preventDefault();
        handlers.onToggleSidebar?.();
        return;
      }

      if (e.altKey && key === KEYBOARD_SHORTCUTS.openFilter.key && !inEditable) {
        e.preventDefault();
        handlers.onOpenFilter?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
