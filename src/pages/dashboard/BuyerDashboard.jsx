import { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { localizeCategory, localizeStage } from '../../i18n/translations';
import { updateUserProfile } from '../../utils/authStorage';
import {
  ORDER_STAGES,
  advanceDemoOrderStage,
  getDemoOrders,
  getDemoQuotes,
} from '../../utils/demoOrdersStorage';
import { getSavedProductIds, unsaveProduct } from '../../utils/savedProductsStorage';
import { MARKETPLACE_PRODUCTS, formatINR } from '../../data/marketplaceData';
import { getAllSellerProducts } from '../../utils/sellerProductStorage';
import OrderTracker from '../../components/orders/OrderTracker';
import gurvistaLogo from '../../assets/images/gurvista-logo.jpg';
import '../auth/Login.css';
import './BuyerDashboard.css';

const SECTION_IDS = ['orders', 'track', 'saved', 'quotes', 'profile'];

function statusBadge(stage) {
  const map = {
    'Order Placed': 'placed',
    'Quality Check': 'quality',
    'Payment Confirmed': 'payment',
    Dispatched: 'dispatched',
    Delivered: 'delivered',
  };
  return map[stage] || 'placed';
}

/* ── My Orders section ──────────────────────────────────── */
function MyOrders({ orders, onSelectOrder }) {
  const { lang, t } = useLanguage();

  if (!orders.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noOrdersBuyer')}</p>
        <Link to="/jaggery" className="btn btn--primary btn--sm">{t('nav.jaggery')}</Link>
      </div>
    );
  }
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>{t('dashboard.thOrderId')}</th>
            <th>{t('dashboard.thProduct')}</th>
            <th>{t('dashboard.thQty')}</th>
            <th>{t('dashboard.thTotal')}</th>
            <th>{t('dashboard.thStage')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const currentStage = ORDER_STAGES[o.stageIndex ?? 0];
            return (
              <tr key={o.id}>
                <td><code className="dash-code">{o.id}</code></td>
                <td>
                  <Link to={`/products/${o.productId}`} className="dash-link-btn">
                    {o.productName}
                  </Link>
                </td>
                <td>{o.quantity}</td>
                <td>{formatINR(o.finalAmount || 0)}</td>
                <td>
                  <span className={`dash-badge dash-badge--${statusBadge(currentStage)}`}>
                    {localizeStage(currentStage, lang)}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="dash-link-btn"
                    onClick={() => onSelectOrder(o.id)}
                  >
                    {t('dashboard.trackArrow')}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Track Orders section ───────────────────────────────── */
function TrackOrders({ orders, selectedOrderId, onSelectOrderId, onAdvanceStage }) {
  const { t } = useLanguage();

  if (!orders.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noTrackOrders')}</p>
        <Link to="/jaggery" className="btn btn--primary btn--sm">{t('dashboard.exploreMarket')}</Link>
      </div>
    );
  }

  const selected = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="track-wrap">
      <div className="track-selector">
        <label className="dash-label" htmlFor="track-order-select">{t('dashboard.selectTrackOrder')}</label>
        <select
          id="track-order-select"
          className="auth-select"
          value={selected.id}
          onChange={(e) => onSelectOrderId(e.target.value)}
        >
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.id} — {o.productName} ({o.quantity} qtl)
            </option>
          ))}
        </select>
      </div>
      {selected && (
        <div className="track-detail">
          <div className="track-meta">
            <span><strong>{t('dashboard.thProduct')}:</strong> {selected.productName}</span>
            <span><strong>{t('dashboard.thSupplier')}:</strong> {selected.supplier}</span>
            <span><strong>{t('dashboard.thQty')}:</strong> {selected.quantity}</span>
            <span><strong>{t('dashboard.thTotal')}:</strong> {formatINR(selected.finalAmount || 0)}</span>
          </div>
          <OrderTracker order={selected} onAdvanceStage={onAdvanceStage} />
        </div>
      )}
    </div>
  );
}

/* ── Saved Products section ─────────────────────────────── */
function SavedProducts({ userId }) {
  const { lang, t } = useLanguage();
  const [savedIds, setSavedIds] = useState(() => getSavedProductIds(userId));
  const allProducts = useMemo(() => [
    ...MARKETPLACE_PRODUCTS,
    ...getAllSellerProducts(),
  ], []);

  const saved = useMemo(
    () => allProducts.filter((p) => savedIds.includes(p.id)),
    [allProducts, savedIds]
  );

  function handleRemove(productId) {
    unsaveProduct(userId, productId);
    setSavedIds(getSavedProductIds(userId));
  }

  if (!saved.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noSavedProducts')}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/jaggery" className="btn btn--primary btn--sm">{t('footer.browseJaggery')}</Link>
          <Link to="/bagasse" className="btn btn--secondary btn--sm">{t('footer.browseBagasse')}</Link>
        </div>
      </div>
    );
  }
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>{t('dashboard.thProduct')}</th>
            <th>{t('dashboard.thCategory')}</th>
            <th>{t('dashboard.thSupplier')}</th>
            <th>{t('dashboard.thPriceQtl')}</th>
            <th>{t('dashboard.thAction')}</th>
          </tr>
        </thead>
        <tbody>
          {saved.map((p) => (
            <tr key={p.id}>
              <td>{lang === 'hi' && p.nameHi ? p.nameHi : p.name}</td>
              <td>{localizeCategory(p.category, lang)}</td>
              <td>{p.supplier || p.sellerName || '—'}</td>
              <td>{formatINR(p.pricePerQuintal)}</td>
              <td>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Link to={`/products/${p.id}`} className="dash-link-btn">
                    {t('dashboard.viewArrow')}
                  </Link>
                  <button
                    type="button"
                    className="dash-link-btn dash-link-btn--danger"
                    onClick={() => handleRemove(p.id)}
                  >
                    {t('dashboard.remove')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Quote Requests section ─────────────────────────────── */
function QuoteRequests({ quotes }) {
  const { t } = useLanguage();

  if (!quotes.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noQuotesBuyer')}</p>
        <Link to="/jaggery" className="btn btn--primary btn--sm">{t('dashboard.exploreMarket')}</Link>
      </div>
    );
  }
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>{t('dashboard.thOrderId')}</th>
            <th>{t('dashboard.thProduct')}</th>
            <th>{t('dashboard.thQty')}</th>
            <th>{t('dashboard.thTotal')}</th>
            <th>{t('dashboard.thDate')}</th>
            <th>{t('dashboard.thStatus')}</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.id}>
              <td><code className="dash-code">{q.id}</code></td>
              <td>
                <Link to={`/products/${q.productId}`} className="dash-link-btn">
                  {q.productName}
                </Link>
              </td>
              <td>{q.requestedQuantity}</td>
              <td>{formatINR(q.estimatedSubtotal || 0)}</td>
              <td>{new Date(q.createdAt).toLocaleDateString('en-IN')}</td>
              <td><span className="dash-badge dash-badge--placed">{q.status || 'Logged'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Profile section ────────────────────────────────────── */
function ProfileSection({ user, onUpdate }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateUserProfile(form);
      onUpdate();
      setLoading(false);
      setSaved(true);
    }, 220);
  }

  return (
    <div className="profile-wrap">
      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <div className="auth-form-grid">
          <div className="auth-field">
            <label className="auth-label" htmlFor="p-name">{t('auth.fullName')}</label>
            <input id="p-name" name="name" className="auth-input" value={form.name || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="p-email">{t('auth.emailLabel')}</label>
            <input id="p-email" name="email" type="email" className="auth-input" value={form.email || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="p-phone">{t('auth.phone')}</label>
            <input id="p-phone" name="phone" className="auth-input" value={form.phone || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="p-city">{t('auth.city')}</label>
            <input id="p-city" name="city" className="auth-input" value={form.city || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="p-state">{t('auth.state')}</label>
            <input id="p-state" name="state" className="auth-input" value={form.state || ''} onChange={handleChange} />
          </div>
        </div>

        {saved && <p className="dash-success">{t('dashboard.profileSaved')}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading} style={{ maxWidth: 220 }}>
          {loading ? t('dashboard.saving') : t('dashboard.saveChanges')}
        </button>
      </form>

      <div className="profile-meta">
        <p><strong>{t('dashboard.accountTypeBuyer')}</strong></p>
        <p>
          <strong>{t('dashboard.memberSince')}</strong>{' '}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
            : 'Current session'}
        </p>
        <p className="profile-demo-note">{t('dashboard.profileDemoNote')}</p>
      </div>
    </div>
  );
}

/* ── Main Buyer Dashboard ────────────────────────────────── */
export default function BuyerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('orders');
  const [orders, setOrders] = useState(() => getDemoOrders());
  const [trackedOrderId, setTrackedOrderId] = useState(null);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'buyer') return <Navigate to="/dashboard/seller" replace />;

  const quotes = getDemoQuotes();
  const sections = SECTION_IDS.map((id) => ({ id, label: t(`dashboard.buyerTabs.${id}`) }));

  function handleTrackFromOrders(orderId) {
    setTrackedOrderId(orderId);
    setActiveSection('track');
  }

  function handleAdvanceStage(orderId) {
    advanceDemoOrderStage(orderId);
    setOrders(getDemoOrders());
  }

  return (
    <div className="dash-page">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-sidebar__brand" aria-label="Gurvista Home">
          <img src={gurvistaLogo} alt="GurVista" className="dash-sidebar__logo" />
        </Link>

        <div className="dash-sidebar__user">
          <div className="dash-avatar" aria-hidden="true">{user.name?.[0]?.toUpperCase() || 'B'}</div>
          <div>
            <p className="dash-sidebar__name">{user.name}</p>
            <p className="dash-sidebar__role">{t('dashboard.demoBuyerRole')}</p>
          </div>
        </div>

        <nav className="dash-nav" aria-label={t('dashboard.buyerTitle')}>
          {sections.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`dash-nav__item${activeSection === id ? ' dash-nav__item--active' : ''}`}
              onClick={() => setActiveSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar__footer">
          <div className="dash-lang-row" role="group" aria-label={t('nav.languageLabel')}>
            <button
              type="button"
              className={`dash-lang-btn${lang === 'en' ? ' dash-lang-btn--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`dash-lang-btn${lang === 'hi' ? ' dash-lang-btn--active' : ''}`}
              onClick={() => setLang('hi')}
            >
              हिंदी
            </button>
          </div>
          <Link to="/" className="dash-sidebar__link">{t('dashboard.backHome')}</Link>
          <Link to="/jaggery" className="dash-sidebar__link">{t('footer.browseJaggery')}</Link>
          <Link to="/bagasse" className="dash-sidebar__link">{t('footer.browseBagasse')}</Link>
          <button type="button" className="dash-logout-btn" onClick={logout}>{t('dashboard.signOut')}</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <div className="dash-mobile-header">
          <span className="dash-mobile-title">{t('dashboard.buyerTitle')}</span>
          <div className="dash-mobile-actions">
            <button
              type="button"
              className="dash-mobile-lang"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              aria-label={t('nav.languageLabel')}
            >
              {lang === 'en' ? 'हिंदी' : 'EN'}
            </button>
            <Link to="/" className="dash-mobile-home">{t('dashboard.homeShort')}</Link>
            <button type="button" className="dash-logout-btn dash-logout-btn--sm" onClick={logout}>
              {t('dashboard.signOut')}
            </button>
          </div>
        </div>

        <div className="dash-mobile-tabs">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`dash-mobile-tab${activeSection === id ? ' dash-mobile-tab--active' : ''}`}
              onClick={() => setActiveSection(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="dash-demo-strip">{t('dashboard.buyerDemoStrip')}</div>

        <div className="dash-content">
          <div className="dash-content-header">
            <h1 className="dash-content-title">
              {sections.find((s) => s.id === activeSection)?.label}
            </h1>
            {activeSection === 'orders' && (
              <span className="dash-content-count">
                {orders.length} {orders.length === 1 ? t('dashboard.orderWord') : t('dashboard.ordersWord')}
              </span>
            )}
            {activeSection === 'quotes' && (
              <span className="dash-content-count">
                {quotes.length} {quotes.length === 1 ? t('dashboard.requestWord') : t('dashboard.requestsWord')}
              </span>
            )}
          </div>

          {activeSection === 'orders' && <MyOrders orders={orders} onSelectOrder={handleTrackFromOrders} />}
          {activeSection === 'track' && (
            <TrackOrders
              orders={orders}
              selectedOrderId={trackedOrderId}
              onSelectOrderId={setTrackedOrderId}
              onAdvanceStage={handleAdvanceStage}
            />
          )}
          {activeSection === 'saved' && <SavedProducts userId={user.id} />}
          {activeSection === 'quotes' && <QuoteRequests quotes={quotes} />}
          {activeSection === 'profile' && <ProfileSection user={user} onUpdate={refreshUser} />}
        </div>
      </main>
    </div>
  );
}
