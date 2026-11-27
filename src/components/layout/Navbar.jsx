import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import gurvistaLogo from '../../assets/images/gurvista-logo.jpg';
import './Navbar.css';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'HI', full: 'हिंदी' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.jaggery'), to: '/jaggery' },
    { label: t('nav.bagasse'), to: '/bagasse' },
    { label: t('nav.about'), to: '/about' },
  ];

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close dropdowns on outside click or Escape ── */
  useEffect(() => {
    if (!langOpen && !userOpen && !menuOpen) return;
    const onClick = () => {
      setLangOpen(false);
      setUserOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setLangOpen(false);
        setUserOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen, userOpen, menuOpen]);

  /* ── lock body scroll when mobile drawer open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  function handleLogout() {
    logout();
    closeMenu();
    setUserOpen(false);
    navigate('/');
  }

  const dashboardPath = user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`} role="banner">
      {/* ── Announcement strip ─────────────────────────── */}
      <div className="announce-strip" aria-label="Announcement">
        <span className="announce-strip__text">{t('nav.announce')}</span>
      </div>

      {/* ── Main navigation bar ────────────────────────── */}
      <div className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Wordmark */}
          <Link to="/" className="navbar__wordmark" onClick={closeMenu} aria-label="Gurvista — home">
            <img src={gurvistaLogo} alt="GurVista" className="navbar__logo-img" />
          </Link>

          {/* Primary links — desktop */}
          <nav className="navbar__links" aria-label="Primary navigation">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' navbar__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right-side controls */}
          <div className="navbar__controls">
            {/* Language selector (available at all screen widths) */}
            <div className={`lang-select${langOpen ? ' lang-select--open' : ''}`}>
              <button
                type="button"
                className="lang-select__current"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen((v) => !v);
                  setUserOpen(false);
                }}
                aria-label={t('nav.languageLabel')}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <span>{LANGUAGES.find((l) => l.code === lang)?.label}</span>
                <svg className="lang-select__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {langOpen && (
                <ul className="lang-select__dropdown" role="listbox" aria-label={t('nav.languageLabel')}>
                  {LANGUAGES.map(({ code, label, full }) => (
                    <li key={code} role="option" aria-selected={lang === code}>
                      <button
                        type="button"
                        className={`lang-select__option${lang === code ? ' lang-select__option--active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLang(code);
                          setLangOpen(false);
                        }}
                      >
                        <span className="lang-select__code">{label}</span>
                        <span className="lang-select__full">{full}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Auth: logged-out state ── */}
            {!user && (
              <>
                <Link to="/login" className="navbar__auth-link" onClick={closeMenu}>
                  {t('nav.login')}
                </Link>
                <Link to="/register?role=seller" className="btn btn--primary btn--sm navbar__seller-btn" onClick={closeMenu}>
                  {t('nav.becomeSeller')}
                </Link>
              </>
            )}

            {/* ── Auth: logged-in state ── */}
            {user && (
              <div className={`navbar__user-menu${userOpen ? ' navbar__user-menu--open' : ''}`}>
                <button
                  type="button"
                  className="navbar__user-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserOpen((v) => !v);
                    setLangOpen(false);
                  }}
                  aria-label="Account menu"
                  aria-expanded={userOpen}
                >
                  <span className="navbar__user-avatar" aria-hidden="true">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="navbar__user-name">{user.name?.split(' ')[0]}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className="lang-select__chevron">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {userOpen && (
                  <ul className="navbar__user-dropdown">
                    <li className="navbar__user-info">
                      <span>{user.name}</span>
                      <span className="navbar__user-role">
                        {user.role === 'seller' ? t('nav.sellerRole') : t('nav.buyerRole')}
                      </span>
                    </li>
                    <li>
                      <Link to={dashboardPath} className="navbar__user-item" onClick={() => setUserOpen(false)}>
                        {t('nav.myDashboard')}
                      </Link>
                    </li>
                    <li>
                      <button type="button" className="navbar__user-item navbar__user-item--logout" onClick={handleLogout}>
                        {t('nav.signOut')}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              type="button"
              className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
              aria-label={menuOpen ? t('nav.closeNav') : t('nav.openNav')}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────── */}
      <div
        id="mobile-drawer"
        className={`navbar__drawer${menuOpen ? ' navbar__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="navbar__drawer-nav" aria-label="Mobile navigation">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__drawer-link${isActive ? ' navbar__drawer-link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <Link to={dashboardPath} className="navbar__drawer-link" onClick={closeMenu}>
              {t('nav.myDashboard')}
            </Link>
          )}
        </nav>

        <div className="navbar__drawer-footer">
          {/* Language toggle in drawer */}
          <div className="navbar__drawer-langs">
            {LANGUAGES.map(({ code, label, full }) => (
              <button
                key={code}
                type="button"
                className={`drawer-lang-btn${lang === code ? ' drawer-lang-btn--active' : ''}`}
                onClick={() => setLang(code)}
              >
                {label} — {full}
              </button>
            ))}
          </div>

          {!user ? (
            <>
              <Link to="/login" className="btn btn--ghost-ivory" onClick={closeMenu}>
                {t('nav.login')}
              </Link>
              <Link to="/register?role=seller" className="btn btn--primary" onClick={closeMenu}>
                {t('nav.becomeSeller')}
              </Link>
            </>
          ) : (
            <button type="button" className="btn btn--ghost-ivory" onClick={handleLogout}>
              {t('nav.signOut')} ({user.name?.split(' ')[0]})
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="navbar__overlay"
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
