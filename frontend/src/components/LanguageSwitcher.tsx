interface LanguageSwitcherProps {
  lang: 'en' | 'th';
  onSwitch: (lang: 'en' | 'th') => void;
}

function LanguageSwitcher({ lang, onSwitch }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher">
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
