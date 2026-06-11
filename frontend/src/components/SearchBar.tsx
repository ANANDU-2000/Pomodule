import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { KEYBOARD_SHORTCUTS } from '../constants/keyboardShortcuts';

export interface SearchBarHandle {
  focus: () => void;
}

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
  clearAriaLabel?: string;
}

const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(function SearchBar(
  { value, onChange, placeholder, ariaLabel, clearAriaLabel = 'Clear search' },
  ref,
) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className="search-bar">
      <span className="search-bar-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        className="search-bar-input"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label={ariaLabel}
        aria-keyshortcuts={KEYBOARD_SHORTCUTS.focusSearch.label}
      />
      {localValue && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => setLocalValue('')}
          aria-label={clearAriaLabel}
        >
          ×
        </button>
      )}
    </div>
  );
});

export default SearchBar;
