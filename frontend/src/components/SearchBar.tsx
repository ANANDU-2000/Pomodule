import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { KEYBOARD_SHORTCUTS } from '../constants/keyboardShortcuts';
import { AppIcon, Search, X } from './icons';

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
        <AppIcon icon={Search} />
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
          <AppIcon icon={X} />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
