import { useCallback, useEffect, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from 'react';
import type { LookupItem, LookupType } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import { useLookupSearch } from '../../hooks/useLookupSearch';
import { usePOFormConfig } from '../../hooks/usePOFormConfig';
import { getLookupPlaceholder } from '../../utils/lookupPlaceholders';
import { AppIcon, ChevronDown, Search, ICON_SIZE_FORM } from '../icons';

export interface ERPLookupProps {
  type: LookupType;
  value: string;
  displayValue?: string;
  onSelect: (item: LookupItem) => void;
  onAfterSelect?: () => void;
  onClear?: () => void;
  onQueryCommit?: (query: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  supplierCode?: string;
  placeholder?: string;
  id?: string;
  error?: boolean;
  t: TranslationMap;
  gridInputProps?: Pick<InputHTMLAttributes<HTMLInputElement>, 'onKeyDown' | 'onFocus' | 'aria-label'> & {
    'data-grid-row': number;
    'data-grid-col': string;
  };
}

export default function ERPLookup({
  type,
  value,
  displayValue,
  onSelect,
  onAfterSelect,
  onClear,
  onQueryCommit,
  disabled,
  readOnly,
  supplierCode,
  placeholder,
  id,
  error,
  t,
  gridInputProps,
}: ERPLookupProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = `${id ?? 'lookup'}-listbox`;
  const { defaults } = usePOFormConfig();
  const minChars = defaults?.minSearchChars ?? 2;

  const { data, isFetching } = useLookupSearch(type, query, {
    supplierCode,
    enabled: !readOnly && !disabled && open,
  });

  const options = data?.configured ? (data.data ?? []) : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [options.length, query]);

  const selectItem = useCallback(
    (item: LookupItem) => {
      onSelect(item);
      setQuery('');
      setOpen(false);
      onAfterSelect?.();
    },
    [onSelect, onAfterSelect],
  );

  const commitQuery = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const exact = options.find((o) => o.code.toLowerCase() === trimmed.toLowerCase());
      if (exact) {
        selectItem(exact);
        return;
      }
      if (type === 'item') {
        onQueryCommit?.(trimmed);
        setQuery('');
        setOpen(false);
      }
    },
    [options, onQueryCommit, selectItem, type],
  );

  const handleBlur = useCallback(() => {
    window.setTimeout(() => {
      if (wrapperRef.current?.contains(document.activeElement)) return;
      if (query.trim()) {
        commitQuery(query);
      }
      setOpen(false);
    }, 120);
  }, [commitQuery, query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) {
      gridInputProps?.onKeyDown?.(e);
      return;
    }

    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, Math.max(0, options.length - 1)));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (options[highlightIndex]) {
        selectItem(options[highlightIndex]);
      } else if (query.trim()) {
        commitQuery(query);
      }
      return;
    }
    gridInputProps?.onKeyDown?.(e);
  };

  const inputValue = open ? query : (displayValue || value);
  const resolvedPlaceholder = placeholder ?? getLookupPlaceholder(type, t);

  if (readOnly) {
    return <div className="erp-field-value">{displayValue || value || '—'}</div>;
  }

  return (
    <div className="erp-lookup" ref={wrapperRef}>
      <input
        id={id}
        type="text"
        data-grid-row={gridInputProps?.['data-grid-row']}
        data-grid-col={gridInputProps?.['data-grid-col']}
        aria-label={gridInputProps?.['aria-label']}
        className={`erp-input erp-lookup-input${error ? ' erp-input-error' : ''}`}
        value={inputValue}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={(e) => {
          setOpen(true);
          gridInputProps?.onFocus?.(e);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={open && options[highlightIndex] ? `${listId}-opt-${highlightIndex}` : undefined}
      />
      <span className="erp-lookup-search" aria-hidden="true">
        <AppIcon icon={Search} size={ICON_SIZE_FORM} />
      </span>
      <span className="erp-lookup-arrow" aria-hidden="true">
        <AppIcon icon={ChevronDown} size={ICON_SIZE_FORM} />
      </span>
      {value && onClear && (
        <button type="button" className="erp-lookup-clear" onClick={onClear} aria-label={t.form.clearLookup}>
          ×
        </button>
      )}
      {open && (
        <div id={listId} className="erp-lookup-dropdown" role="listbox">
          {query.trim().length < minChars && (
            <div className="erp-lookup-hint">{t.form.minSearchChars.replace('{n}', String(minChars))}</div>
          )}
          {isFetching && <div className="erp-lookup-hint">{t.form.searching}</div>}
          {data && !data.configured && (
            <div className="erp-lookup-unconfigured">{data.message ?? t.form.lookupNotConfigured}</div>
          )}
          {data?.configured && options.length === 0 && query.trim().length >= minChars && !isFetching && (
            <div className="erp-lookup-hint">{t.form.noLookupResults}</div>
          )}
          {options.map((item, index) => (
            <button
              key={item.code}
              id={`${listId}-opt-${index}`}
              type="button"
              className={`erp-lookup-option${index === highlightIndex ? ' highlighted' : ''}`}
              role="option"
              aria-selected={index === highlightIndex}
              onMouseEnter={() => setHighlightIndex(index)}
              onClick={() => selectItem(item)}
            >
              <span className="erp-lookup-code">{item.code}</span>
              <span className="erp-lookup-name">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
