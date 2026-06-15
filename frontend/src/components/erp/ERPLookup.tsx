import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { LookupItem, LookupType } from '../../types/formConfig';
import type { TranslationMap } from '../../types/i18n';
import { useLookupSearch } from '../../hooks/useLookupSearch';
import { usePOFormConfig } from '../../hooks/usePOFormConfig';
import { AppIcon, ChevronDown, ICON_SIZE_FORM } from '../icons';

export interface ERPLookupProps {
  type: LookupType;
  value: string;
  displayValue?: string;
  onSelect: (item: LookupItem) => void;
  onClear?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  supplierCode?: string;
  placeholder?: string;
  id?: string;
  error?: boolean;
  t: TranslationMap;
}

export default function ERPLookup({
  type,
  value,
  displayValue,
  onSelect,
  onClear,
  disabled,
  readOnly,
  supplierCode,
  placeholder,
  id,
  error,
  t,
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
    },
    [onSelect],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, Math.max(0, options.length - 1)));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && options[highlightIndex]) {
      e.preventDefault();
      selectItem(options[highlightIndex]);
    }
  };

  const inputValue = open ? query : (displayValue || value);

  if (readOnly) {
    return <div className="erp-field-value">{displayValue || value || '—'}</div>;
  }

  return (
    <div className="erp-lookup" ref={wrapperRef}>
      <input
        id={id}
        type="text"
        className={`erp-input erp-lookup-input${error ? ' erp-input-error' : ''}`}
        value={inputValue}
        placeholder={placeholder ?? t.form.lookupPlaceholder}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={open && options[highlightIndex] ? `${listId}-opt-${highlightIndex}` : undefined}
      />
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
          {data?.configured && options.length === 0 && query.trim().length >= minChars && (
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
