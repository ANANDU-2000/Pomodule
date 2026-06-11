import { useState, useRef, useEffect, useCallback } from 'react';
import type { FilterPeriod, FilterOption } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { KEYBOARD_SHORTCUTS } from '../constants/keyboardShortcuts';
import IconButton from './IconButton';

interface FilterPopupProps {
  activeFilter: FilterPeriod;
  onSelect: (f: FilterPeriod) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  filterOptions: FilterOption[];
  t: TranslationMap;
}

function FilterPopup({
  activeFilter,
  onSelect,
  open: controlledOpen,
  onOpenChange,
  filterOptions,
  t,
}: FilterPopupProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  const handleSelect = (value: FilterPeriod) => {
    onSelect(value);
    setOpen(false);
  };

  const isFilterActive = activeFilter !== 'all';

  return (
    <div className="filter-popup" ref={containerRef}>
      <IconButton
        iconOnly
        active={isFilterActive}
        title={`${t.actions.filter} (${KEYBOARD_SHORTCUTS.openFilter.label})`}
        aria-label={t.actions.filter}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-keyshortcuts={KEYBOARD_SHORTCUTS.openFilter.label}
        onClick={() => setOpen(!open)}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        }
      />
      {open && (
        <div className="filter-dropdown" role="listbox" aria-label={t.actions.filter}>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={activeFilter === opt.value}
              className={`filter-option${activeFilter === opt.value ? ' selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterPopup;
