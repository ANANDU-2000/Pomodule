import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import type { FilterPeriod, FilterOption } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { KEYBOARD_SHORTCUTS } from '../constants/keyboardShortcuts';
import IconButton from './IconButton';
import { AppIcon, Filter, ICON_SIZE_HEADER } from './icons';

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    }
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (open && focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [open, focusedIndex]);

  const handleSelect = (value: FilterPeriod) => {
    onSelect(value);
    setOpen(false);
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filterOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(filterOptions[index].value);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const isFilterActive = activeFilter !== 'all';

  return (
    <div className="filter-popup" ref={containerRef}>
      <IconButton
        ref={triggerRef}
        iconOnly
        active={isFilterActive}
        title={`${t.actions.filter} (${KEYBOARD_SHORTCUTS.openFilter.label})`}
        aria-label={t.actions.filter}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-keyshortcuts={KEYBOARD_SHORTCUTS.openFilter.label}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) {
            const activeIdx = filterOptions.findIndex((o) => o.value === activeFilter);
            setFocusedIndex(activeIdx >= 0 ? activeIdx : 0);
          }
        }}
        icon={<AppIcon icon={Filter} size={ICON_SIZE_HEADER} />}
      />
      {open && (
        <div className="filter-dropdown" role="listbox" aria-label={t.actions.filter}>
          {filterOptions.map((opt, index) => (
            <button
              key={opt.value}
              ref={(el) => { optionRefs.current[index] = el; }}
              type="button"
              role="option"
              aria-selected={activeFilter === opt.value}
              className={`filter-option${activeFilter === opt.value ? ' selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
              onKeyDown={(e) => handleOptionKeyDown(e, index)}
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
