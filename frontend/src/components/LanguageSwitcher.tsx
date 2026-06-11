interface LanguageSwitcherProps {
  lang: 'en' | 'th';
  onSwitch: (lang: 'en' | 'th') => void;
  ariaLabel: string;
}

function LanguageSwitcher({ lang, onSwitch, ariaLabel }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className={`language-switcher-btn${lang === 'en' ? ' active' : ''}`}
        onClick={() => onSwitch('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={`language-switcher-btn${lang === 'th' ? ' active' : ''}`}
        onClick={() => onSwitch('th')}
        aria-pressed={lang === 'th'}
      >
        TH
      </button>
    </div>
  );
}

export default LanguageSwitcher;
