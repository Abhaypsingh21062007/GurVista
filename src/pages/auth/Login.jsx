import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, DEMO_CREDENTIALS } from '../../utils/authStorage';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import authPanelImg from '../../assets/images/jaggery-boiling.jpg';
import gurvistaLogo from '../../assets/images/gurvista-logo.jpg';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultRole = params.get('role') === 'seller' ? 'seller' : 'buyer';

  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleDemoFill(demo) {
    setRole(demo.role);
    setEmail(demo.email);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please enter your email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = loginUser(email.trim(), role);
      setLoading(false);
      if (result.success) {
        login(result.user);
        navigate(role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer');
      } else {
        setError(
          lang === 'hi'
            ? 'इस ईमेल और भूमिका के लिए कोई खाता नहीं मिला। कृपया पहले पंजीकरण करें या डेमो खाता चुनें।'
            : result.error
        );
      }
    }, 250);
  }

  return (
    <div className="auth-page">
      {/* Left regional trade panel */}
      <div className="auth-brand">
        <Link to="/" className="auth-brand__wordmark" aria-label="Gurvista Home">
          <img src={gurvistaLogo} alt="GurVista" className="auth-brand__logo" />
        </Link>

        <div className="auth-brand__plate">
          <img
            src={authPanelImg}
            alt="Traditional jaggery preparation in Muzaffarnagar"
            className="auth-brand__img"
          />
          <span className="auth-brand__plate-label">
            {lang === 'hi' ? 'मुज़फ्फरनगर · उत्तर प्रदेश' : 'Muzaffarnagar · Uttar Pradesh'}
          </span>
        </div>

        <p className="auth-brand__quote">{t('auth.brandQuote')}</p>
        <p className="auth-brand__sub">{t('auth.brandSub')}</p>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-topbar">
            <Link to="/" className="auth-back-link">{t('dashboard.backHome')}</Link>
            <div className="auth-lang-switch" role="group" aria-label={t('nav.languageLabel')}>
              <button
                type="button"
                className={`auth-lang-btn${lang === 'en' ? ' auth-lang-btn--active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`auth-lang-btn${lang === 'hi' ? ' auth-lang-btn--active' : ''}`}
                onClick={() => setLang('hi')}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="auth-demo-notice">{t('auth.demoLoginNotice')}</div>

          <h1 className="auth-heading">{t('auth.signInHeading')}</h1>

          {/* Role selector */}
          <div className="auth-role-tabs" role="tablist" aria-label="Account type">
            <button
              role="tab"
              aria-selected={role === 'buyer'}
              className={`auth-role-tab${role === 'buyer' ? ' auth-role-tab--active' : ''}`}
              onClick={() => { setRole('buyer'); setError(''); }}
              type="button"
            >
              {t('auth.buyerTab')}
            </button>
            <button
              role="tab"
              aria-selected={role === 'seller'}
              className={`auth-role-tab${role === 'seller' ? ' auth-role-tab--active' : ''}`}
              onClick={() => { setRole('seller'); setError(''); }}
              type="button"
            >
              {t('auth.sellerTab')}
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">{t('auth.emailLabel')}</label>
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                required
              />
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="btn btn--primary auth-submit"
              disabled={loading}
            >
              {loading
                ? t('auth.signingIn')
                : role === 'seller'
                  ? t('auth.signInAsSeller')
                  : t('auth.signInAsBuyer')}
            </button>
          </form>

          <p className="auth-switch">
            {t('auth.newUserPrompt')}{' '}
            <Link to={`/register?role=${role}`} className="auth-switch__link">
              {t('auth.createLink')}
            </Link>
          </p>

          {/* Quick demo fill */}
          <div className="auth-demo-fills">
            <p className="auth-demo-fills__label">{t('auth.quickFillLabel')}</p>
            <div className="auth-demo-fills__btns">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  className="auth-demo-btn"
                  onClick={() => handleDemoFill(demo)}
                >
                  {demo.role === 'buyer' ? t('auth.demoBuyerBtn') : t('auth.demoSellerBtn')} ({demo.email})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
