import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/useLanguage';
import gurvistaLogo from '../../assets/images/gurvista-logo.jpg';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { t } = useLanguage();
  const year = CURRENT_YEAR;

  const footerNav = [
    {
      heading: t('footer.colMarketplace'),
      links: [
        { label: t('footer.browseJaggery'), to: '/jaggery' },
        { label: t('footer.browseBagasse'), to: '/bagasse' },
        { label: t('footer.allProducts'), to: '/products' },
        { label: t('footer.findProducers'), to: '/producers' },
      ],
    },
    {
      heading: t('footer.colCompany'),
      links: [
        { label: t('footer.aboutGurvista'), to: '/about' },
        { label: t('footer.ourStory'), to: '/about' },
        { label: t('footer.howItWorks'), to: '/#how-it-works' },
        { label: t('footer.becomeSeller'), to: '/register?role=seller' },
      ],
    },
    {
      heading: t('footer.colSupport'),
      links: [
        { label: t('footer.contactUs'), to: '/contact' },
        { label: t('footer.forBuyers'), to: '/contact' },
        { label: t('footer.forSellers'), to: '/register?role=seller' },
        { label: t('footer.demoOrders'), to: '/orders' },
      ],
    },
  ];

  return (
    <footer className="site-footer" role="contentinfo">
      {/* ── Main footer body ───────────────────────────────── */}
      <div className="footer__body">
        <div className="container footer__inner">
          {/* Brand column */}
          <div className="footer__brand">
            <Link to="/" className="footer__wordmark" aria-label="Gurvista — home">
              <img src={gurvistaLogo} alt="GurVista" className="footer__logo-img" />
            </Link>

            <p className="footer__tagline">{t('footer.tagline')}</p>

            <address className="footer__address">{t('footer.address')}</address>

            <Link to="/contact" className="footer__contact-cta">
              {t('footer.contactCta')}
            </Link>
          </div>

          {/* Nav columns */}
          {footerNav.map(({ heading, links }) => (
            <nav key={heading} className="footer__col" aria-label={heading}>
              <h3 className="footer__col-heading">{heading}</h3>
              <ul className="footer__col-list">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer__col-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            &copy; {year} Gurvista. {t('footer.rights')}
          </p>
          <p className="footer__copy footer__copy--muted">
            {t('footer.bottomNote')}
          </p>
        </div>
      </div>
    </footer>
  );
}
