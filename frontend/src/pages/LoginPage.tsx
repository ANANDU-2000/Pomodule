import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import { MOCK_MODE } from '../config/mock.config';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { lang, t, setLang } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/po/list', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await login(username, password);
      if (!ok) {
        setError(t.login.invalidCredentials);
        return;
      }
      navigate('/po/list', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
    if (e.key === 'Enter') {
      void handleSubmit();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <h1 className="login-title">{t.login.title}</h1>
          <p className="login-subtitle">{t.login.subtitle}</p>
          <LanguageSwitcher
            lang={lang}
            onSwitch={setLang}
            ariaLabel={t.accessibility.language}
          />
        </div>

        <form className="login-form" onSubmit={(e) => void handleSubmit(e)} noValidate>
          <div className="login-field">
            <label htmlFor="login-username">{t.login.userId}</label>
            <input
              id="login-username"
              type="text"
              className="erp-input login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">{t.login.password}</label>
            <div className="login-password-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="erp-input login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyEvent}
                onKeyUp={handlePasswordKeyEvent}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
                disabled={loading}
              >
                {showPassword ? t.login.hidePassword : t.login.showPassword}
              </button>
            </div>
            {capsLockOn && (
              <p className="login-caps-warning" role="status">
                {t.login.capsLockOn}
              </p>
            )}
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading ? t.login.signingIn : t.login.signIn}
          </button>
        </form>

        {import.meta.env.DEV && MOCK_MODE && (
          <div className="login-mock-hint" role="note">
            <p className="login-mock-hint-title">{t.login.mockHintTitle}</p>
            <ul className="login-mock-hint-list">
              <li>admin / admin123</li>
              <li>purchase / purchase123</li>
              <li>viewer / viewer123</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
