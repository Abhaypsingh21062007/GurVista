import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { registerUser } from '../../utils/authStorage';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import authPanelImg from '../../assets/images/sugarcane-field-up.jpg';
import gurvistaLogo from '../../assets/images/gurvista-logo.jpg';
import './Login.css';

function initialState(role) {
  if (role === 'seller') {
    return { name: '', businessName: '', email: '', phone: '', city: '', state: 'Uttar Pradesh', address: '', gst: '' };
  }
  return { name: '', email: '', phone: '', city: '', state: 'Uttar Pradesh' };
}

export default function Register() {
  const { login } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultRole = params.get('role') === 'seller' ? 'seller' : 'buyer';

  const [role, setRole] = useState(defaultRole);
  const [form, setForm] = useState(() => initialState(defaultRole));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchRole(r) {
    setRole(r);
    setForm(initialState(r));
    setError('');
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function validate() {
    if (!form.name.trim()) return lang === 'hi' ? 'पूरा नाम आवश्यक है।' : 'Full name is required.';
    if (!form.email.trim()) return lang === 'hi' ? 'ईमेल पता आवश्यक है।' : 'Email address is required.';
    if (!form.email.includes('@')) return lang === 'hi' ? 'सही ईमेल पता दर्ज करें।' : 'Enter a valid email address.';
    if (!form.phone.trim()) return lang === 'hi' ? 'मोबाइल नंबर आवश्यक है।' : 'Phone number is required.';
    if (!form.city.trim()) return lang === 'hi' ? 'शहर / कस्बा आवश्यक है।' : 'City is required.';
    if (role === 'seller' && !form.businessName.trim()) {
      return lang === 'hi' ? 'कोल्हू या व्यापार का नाम आवश्यक है।' : 'Business or farm name is required.';
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setTimeout(() => {
      const result = registerUser({ ...form, role });
      setLoading(false);
      if (result.success) {
        login(result.user);
        navigate(role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer');
      } else {
        setError(result.error);
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
            alt="Sugarcane fields in Muzaffarnagar district"
            className="auth-brand__img"
          />
          <span className="auth-brand__plate-label">
            {lang === 'hi' ? 'गन्ना व गुड़ व्यापार पोर्टल' : 'Direct Agri-Trade Portal'}
          </span>
        </div>

        <p className="auth-brand__quote">{t('auth.regQuote')}</p>
        <p className="auth-brand__sub">{t('auth.regSub')}</p>
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

          <div className="auth-demo-notice">{t('auth.demoRegNotice')}</div>

          <h1 className="auth-heading">{t('auth.createHeading')}</h1>

          {/* Role selector */}
          <div className="auth-role-tabs" role="tablist" aria-label="Account type">
            <button
              role="tab"
              aria-selected={role === 'buyer'}
              className={`auth-role-tab${role === 'buyer' ? ' auth-role-tab--active' : ''}`}
              onClick={() => switchRole('buyer')}
              type="button"
            >
              {t('auth.buyerTab')}
            </button>
            <button
              role="tab"
              aria-selected={role === 'seller'}
              className={`auth-role-tab${role === 'seller' ? ' auth-role-tab--active' : ''}`}
              onClick={() => switchRole('seller')}
              type="button"
            >
              {t('auth.sellerTab')}
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className={role === 'seller' ? 'auth-form-grid' : ''}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-name">{t('auth.fullName')}</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className="auth-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {role === 'seller' && (
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-bname">{t('auth.businessName')}</label>
                  <input
                    id="reg-bname"
                    name="businessName"
                    type="text"
                    className="auth-input"
                    value={form.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            <div className="auth-form-grid">
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-email">{t('auth.emailLabel')}</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder={t('auth.emailPlaceholder')}
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-phone">{t('auth.phone')}</label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  className="auth-input"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-form-grid">
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-city">{t('auth.city')}</label>
                <input
                  id="reg-city"
                  name="city"
                  type="text"
                  className="auth-input"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-state">{t('auth.state')}</label>
                <input
                  id="reg-state"
                  name="state"
                  type="text"
                  className="auth-input"
                  value={form.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            {role === 'seller' && (
              <>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-address">{t('auth.address')}</label>
                  <input
                    id="reg-address"
                    name="address"
                    type="text"
                    className="auth-input"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-gst">
                    {t('auth.gst')}{' '}
                    <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                      {t('auth.optional')}
                    </span>
                  </label>
                  <input
                    id="reg-gst"
                    name="gst"
                    type="text"
                    className="auth-input"
                    value={form.gst}
                    onChange={handleChange}
                  />
                  <p className="auth-hint">{t('auth.gstHint')}</p>
                </div>
              </>
            )}

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="btn btn--primary auth-submit"
              disabled={loading}
            >
              {loading
                ? t('auth.creatingAccount')
                : role === 'seller'
                  ? t('auth.createSellerBtn')
                  : t('auth.createBuyerBtn')}
            </button>
          </form>

          <p className="auth-switch">
            {t('auth.alreadyHave')}{' '}
            <Link to={`/login?role=${role}`} className="auth-switch__link">
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
