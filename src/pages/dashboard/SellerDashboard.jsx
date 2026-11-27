import { useState, useCallback } from 'react';
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
import { formatINR } from '../../data/marketplaceData';
import {
  getSellerProducts,
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  PRODUCT_CATEGORIES,
  marketplaceFromCategory,
} from '../../utils/sellerProductStorage';
import gurvistaLogo from '../../assets/images/gurvista-logo.jpg';
import '../auth/Login.css';
import './BuyerDashboard.css';
import './SellerDashboard.css';

const SECTION_IDS = ['overview', 'products', 'add', 'orders', 'inventory', 'profile'];

function makeEmptyForm(defaultLocation = '') {
  return {
    name: '',
    category: PRODUCT_CATEGORIES[0],
    pricePerQuintal: '',
    availableStock: '',
    minOrderQuintals: '',
    description: '',
    location: defaultLocation,
    imageUrl: '',
  };
}

/* ── Overview section ───────────────────────────────────── */
function Overview({ products, orders, quotes, sellerName, onNavigate }) {
  const { lang, t } = useLanguage();
  const totalStock = products.reduce((s, p) => s + (Number(p.availableStock) || 0), 0);
  const summaryRows = [
    { label: t('dashboard.statListings'), value: products.length },
    { label: t('dashboard.statStock'), value: totalStock.toLocaleString('en-IN') },
    { label: t('dashboard.statOrders'), value: orders.length },
    { label: t('dashboard.statQuotes'), value: quotes.length },
  ];

  return (
    <div className="overview-wrap">
      <p className="overview-greeting">
        {t('dashboard.sellerGreeting')} <strong>{sellerName}</strong>. {t('dashboard.sellerGreetingSub')}
      </p>

      <div className="overview-summary">
        {summaryRows.map(({ label, value }) => (
          <div key={label} className="overview-summary__item">
            <span className="overview-summary__value">{value}</span>
            <span className="overview-summary__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="overview-quick-actions">
        <button type="button" className="btn btn--primary" onClick={() => onNavigate('add')}>
          {t('dashboard.addNewProductBtn')}
        </button>
        <button type="button" className="btn btn--ghost-green" onClick={() => onNavigate('products')}>
          {t('dashboard.viewMyProductsBtn')}
        </button>
        <button type="button" className="btn btn--ghost-green" onClick={() => onNavigate('orders')}>
          {t('dashboard.checkIncomingOrdersBtn')}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="dash-empty">
          <p>{t('dashboard.noSellerProducts')}</p>
        </div>
      ) : (
        <div className="overview-recent">
          <h3 className="overview-recent__heading">{t('dashboard.yourListedProducts')}</h3>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>{t('dashboard.thProduct')}</th>
                  <th>{t('dashboard.thCategory')}</th>
                  <th>{t('dashboard.thPriceQtl')}</th>
                  <th>{t('dashboard.thStockQtl')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{localizeCategory(p.category, lang)}</td>
                    <td>{formatINR(p.pricePerQuintal)}</td>
                    <td>{p.availableStock}</td>
                    <td>
                      <Link to={`/products/${p.id}`} className="dash-link-btn">
                        {t('dashboard.viewInMarket')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="overview-notice">{t('dashboard.overviewNotice')}</div>
    </div>
  );
}

/* ── Product form (Add / Edit) ──────────────────────────── */
function ProductForm({ initial, defaultLocation, onSave, onCancel, mode = 'add' }) {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState(() => initial || makeEmptyForm(defaultLocation));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(initial?.imageUrl || '');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'imageUrl') setPreview(value);
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())
      errs.name = lang === 'hi' ? 'कृपया उत्पाद का नाम लिखें।' : 'Please enter the product name.';
    if (!form.pricePerQuintal || isNaN(Number(form.pricePerQuintal)) || Number(form.pricePerQuintal) <= 0)
      errs.pricePerQuintal = lang === 'hi' ? 'कृपया प्रति क्विंटल सही भाव लिखें।' : 'Please enter a valid price per quintal in rupees.';
    if (form.availableStock === '' || isNaN(Number(form.availableStock)) || Number(form.availableStock) < 0)
      errs.availableStock = lang === 'hi' ? 'कृपया क्विंटल में उपलब्ध मात्रा लिखें।' : 'Please enter available quantity in quintals.';
    if (!form.minOrderQuintals || isNaN(Number(form.minOrderQuintals)) || Number(form.minOrderQuintals) <= 0)
      errs.minOrderQuintals = lang === 'hi' ? 'कृपया न्यूनतम ऑर्डर मात्रा लिखें।' : 'Please enter minimum order quantity in quintals.';
    if (!form.location.trim())
      errs.location = lang === 'hi' ? 'कृपया गाँव, मंडी या जिले का नाम लिखें।' : 'Please enter village, town or mandi location.';
    if (!form.description.trim())
      errs.description = lang === 'hi' ? 'कृपया उत्पाद का संक्षिप्त विवरण लिखें।' : 'Please enter a short description of your produce.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      onSave({
        name: form.name.trim(),
        category: form.category,
        pricePerQuintal: Number(form.pricePerQuintal),
        availableStock: Number(form.availableStock),
        minOrderQuintals: Number(form.minOrderQuintals),
        location: form.location.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl?.trim() || '',
        marketplace: marketplaceFromCategory(form.category),
      });
      setLoading(false);
    }, 250);
  }

  return (
    <form className="product-form auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-form-grid">
        <div className="auth-field">
          <label className="auth-label" htmlFor="pf-name">{t('dashboard.productName')}</label>
          <input
            id="pf-name"
            name="name"
            className={`auth-input${errors.name ? ' auth-input--error' : ''}`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="pf-cat">{t('dashboard.category')}</label>
          <select
            id="pf-cat"
            name="category"
            className="auth-select auth-input"
            value={form.category}
            onChange={handleChange}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{localizeCategory(c, lang)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="product-form-triple">
        <div className="auth-field">
          <label className="auth-label" htmlFor="pf-price">{t('dashboard.pricePerQuintal')}</label>
          <input
            id="pf-price"
            name="pricePerQuintal"
            type="number"
            min="1"
            className={`auth-input${errors.pricePerQuintal ? ' auth-input--error' : ''}`}
            value={form.pricePerQuintal}
            onChange={handleChange}
          />
          {errors.pricePerQuintal && <span className="field-error">{errors.pricePerQuintal}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="pf-stock">{t('dashboard.qtyAvailable')}</label>
          <input
            id="pf-stock"
            name="availableStock"
            type="number"
            min="0"
            className={`auth-input${errors.availableStock ? ' auth-input--error' : ''}`}
            value={form.availableStock}
            onChange={handleChange}
          />
          {errors.availableStock && <span className="field-error">{errors.availableStock}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="pf-moq">{t('dashboard.minOrderQty')}</label>
          <input
            id="pf-moq"
            name="minOrderQuintals"
            type="number"
            min="1"
            className={`auth-input${errors.minOrderQuintals ? ' auth-input--error' : ''}`}
            value={form.minOrderQuintals}
            onChange={handleChange}
          />
          {errors.minOrderQuintals && <span className="field-error">{errors.minOrderQuintals}</span>}
        </div>
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="pf-loc">{t('dashboard.locationField')}</label>
        <input
          id="pf-loc"
          name="location"
          className={`auth-input${errors.location ? ' auth-input--error' : ''}`}
          value={form.location}
          onChange={handleChange}
        />
        {errors.location && <span className="field-error">{errors.location}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="pf-desc">{t('dashboard.descField')}</label>
        <textarea
          id="pf-desc"
          name="description"
          className={`auth-textarea auth-input${errors.description ? ' auth-input--error' : ''}`}
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="pf-img">
          {t('dashboard.imgUrlField')} <span className="auth-label--opt">{t('auth.optional')}</span>
        </label>
        <input
          id="pf-img"
          name="imageUrl"
          type="url"
          className="auth-input"
          placeholder="https://…"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <p className="auth-hint">{t('dashboard.imgUrlHint')}</p>
        {preview && (
          <div className="product-form__preview">
            <img
              src={preview}
              alt="Preview"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      <div className="product-form__actions">
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading
            ? t('dashboard.saving')
            : mode === 'edit'
              ? t('dashboard.saveProductChanges')
              : t('dashboard.publishListing')}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost-green" onClick={onCancel}>
            {t('dashboard.cancel')}
          </button>
        )}
      </div>
    </form>
  );
}

/* ── My Products section ────────────────────────────────── */
function MyProducts({ products, onEdit, onDelete, onAdd }) {
  const { lang, t } = useLanguage();

  if (!products.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noSellerProducts')}</p>
        <button type="button" className="btn btn--primary btn--sm" onClick={onAdd}>
          {t('dashboard.addNewProductBtn')}
        </button>
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
            <th>{t('dashboard.thPriceQtl')}</th>
            <th>{t('dashboard.thStockQtl')}</th>
            <th>{t('dashboard.thMinOrder')}</th>
            <th>{t('dashboard.thLocation')}</th>
            <th>{t('dashboard.thAction')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{ maxWidth: 210, wordBreak: 'break-word' }}>
                <Link to={`/products/${p.id}`} className="dash-link-btn">
                  {p.name}
                </Link>
              </td>
              <td>{localizeCategory(p.category, lang)}</td>
              <td>{formatINR(p.pricePerQuintal)}</td>
              <td>{p.availableStock}</td>
              <td>{p.minOrderQuintals}</td>
              <td style={{ fontSize: 14 }}>{p.location}</td>
              <td>
                <div className="product-actions">
                  <button type="button" className="dash-link-btn" onClick={() => onEdit(p)}>
                    {t('dashboard.edit')}
                  </button>
                  <button
                    type="button"
                    className="dash-link-btn dash-link-btn--danger"
                    onClick={() => {
                      const msg = lang === 'hi'
                        ? `क्या आप "${p.name}" को हटाना चाहते हैं?`
                        : `Delete "${p.name}"? This cannot be undone.`;
                      if (window.confirm(msg)) {
                        onDelete(p.id);
                      }
                    }}
                  >
                    {t('dashboard.delete')}
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

/* ── Incoming Orders ────────────────────────────────────── */
function IncomingOrders({ orders, onAdvanceStage }) {
  const { lang, t } = useLanguage();

  if (!orders.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noIncomingOrders')}</p>
        <p style={{ fontSize: 14, color: 'var(--color-grey-mid)' }}>{t('dashboard.incomingOrdersHint')}</p>
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
            <th>{t('dashboard.thBuyer')}</th>
            <th>{t('dashboard.thQty')}</th>
            <th>{t('dashboard.thTotal')}</th>
            <th>{t('dashboard.thStage')}</th>
            <th>{t('dashboard.thAction')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const idx = Math.min(o.stageIndex ?? 0, ORDER_STAGES.length - 1);
            const currentStage = ORDER_STAGES[idx];
            const isDone = idx >= ORDER_STAGES.length - 1;
            return (
              <tr key={o.id}>
                <td><code className="dash-code">{o.id}</code></td>
                <td>{o.productName}</td>
                <td>{o.delivery?.buyerName || 'Demo Buyer'}</td>
                <td>{o.quantity}</td>
                <td>{formatINR(o.finalAmount || 0)}</td>
                <td>
                  <span className={`dash-badge ${isDone ? 'dash-badge--delivered' : 'dash-badge--placed'}`}>
                    {localizeStage(currentStage, lang)}
                  </span>
                </td>
                <td>
                  {isDone ? (
                    <span style={{ fontSize: 14, color: 'var(--color-grey-mid)' }}>{t('dashboard.completed')}</span>
                  ) : (
                    <button
                      type="button"
                      className="dash-link-btn"
                      onClick={() => onAdvanceStage(o.id)}
                    >
                      {t('dashboard.markPrefix')} {localizeStage(ORDER_STAGES[idx + 1], lang)} →
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Inventory section ──────────────────────────────────── */
function Inventory({ products, onEdit }) {
  const { lang, t } = useLanguage();

  if (!products.length) {
    return (
      <div className="dash-empty">
        <p>{t('dashboard.noSellerProducts')}</p>
      </div>
    );
  }

  return (
    <>
      <p className="inventory-hint">{t('dashboard.inventoryHint')}</p>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>{t('dashboard.thProduct')}</th>
              <th>{t('dashboard.thCategory')}</th>
              <th>{t('dashboard.thStockQtl')}</th>
              <th>{t('dashboard.thMinOrder')}</th>
              <th>{t('dashboard.thPriceQtl')}</th>
              <th>{t('dashboard.thStatus')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = Number(p.availableStock);
              const level = stock === 0 ? 'out' : stock < 20 ? 'low' : 'ok';
              const levelLabel =
                level === 'out'
                  ? t('dashboard.outOfStock')
                  : level === 'low'
                    ? t('dashboard.lowStock')
                    : t('dashboard.inStock');
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{localizeCategory(p.category, lang)}</td>
                  <td><strong>{stock}</strong></td>
                  <td>{p.minOrderQuintals}</td>
                  <td>{formatINR(p.pricePerQuintal)}</td>
                  <td>
                    <span className={`inventory-level inventory-level--${level}`}>
                      {levelLabel}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="dash-link-btn" onClick={() => onEdit(p)}>
                      {t('dashboard.updateStock')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Business Profile section ───────────────────────────── */
function BusinessProfile({ user, onUpdate }) {
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
            <label className="auth-label" htmlFor="bp-name">{t('auth.fullName')}</label>
            <input id="bp-name" name="name" className="auth-input" value={form.name || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="bp-biz">{t('auth.businessName')}</label>
            <input id="bp-biz" name="businessName" className="auth-input" value={form.businessName || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="bp-email">{t('auth.emailLabel')}</label>
            <input id="bp-email" name="email" type="email" className="auth-input" value={form.email || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="bp-phone">{t('auth.phone')}</label>
            <input id="bp-phone" name="phone" className="auth-input" value={form.phone || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="bp-city">{t('auth.city')}</label>
            <input id="bp-city" name="city" className="auth-input" value={form.city || ''} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="bp-state">{t('auth.state')}</label>
            <input id="bp-state" name="state" className="auth-input" value={form.state || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="auth-field">
          <label className="auth-label" htmlFor="bp-address">{t('auth.address')}</label>
          <input id="bp-address" name="address" className="auth-input" value={form.address || ''} onChange={handleChange} />
        </div>
        <div className="auth-field">
          <label className="auth-label" htmlFor="bp-gst">
            {t('auth.gst')} <span style={{ fontWeight: 400 }}>{t('auth.optional')}</span>
          </label>
          <input id="bp-gst" name="gst" className="auth-input" value={form.gst || ''} onChange={handleChange} />
        </div>

        {saved && <p className="dash-success">{t('dashboard.bizProfileSaved')}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading} style={{ maxWidth: 220 }}>
          {loading ? t('dashboard.saving') : t('dashboard.saveChanges')}
        </button>
      </form>

      <div className="profile-meta">
        <p><strong>{t('dashboard.accountTypeSeller')}</strong></p>
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

/* ── Main Seller Dashboard ──────────────────────────────── */
export default function SellerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');
  const [orders, setOrders] = useState(() => getDemoOrders());
  const [editingProduct, setEditingProduct] = useState(null);
  const [flashMessage, setFlashMessage] = useState('');
  const sellerId = user?.id;
  const [products, setProducts] = useState(() =>
    sellerId ? getSellerProducts(sellerId) : []
  );

  const loadProducts = useCallback(() => {
    if (!sellerId) return;
    setProducts(getSellerProducts(sellerId));
  }, [sellerId]);

  if (!user) return <Navigate to="/login?role=seller" replace />;
  if (user.role !== 'seller') return <Navigate to="/dashboard/buyer" replace />;

  const quotes = getDemoQuotes();
  const defaultLocation = [user.city, user.state].filter(Boolean).join(', ') || 'Muzaffarnagar, Uttar Pradesh';
  const sections = SECTION_IDS.map((id) => ({ id, label: t(`dashboard.sellerTabs.${id}`) }));

  function handleAddProduct(formData) {
    addSellerProduct({
      ...formData,
      sellerId: user.id,
      sellerName: user.businessName || user.name,
    });
    loadProducts();
    setFlashMessage(
      lang === 'hi'
        ? `"${formData.name}" प्रकाशित हो गया है और अब बाज़ार में दिखाई दे रहा है।`
        : `"${formData.name}" published and now visible in the marketplace.`
    );
    setActiveSection('products');
  }

  function handleEditSave(formData) {
    updateSellerProduct(editingProduct.id, formData);
    loadProducts();
    setEditingProduct(null);
    setFlashMessage(
      lang === 'hi' ? `"${formData.name}" अपडेट हो गया।` : `"${formData.name}" updated.`
    );
    setActiveSection('products');
  }

  function handleDelete(id) {
    deleteSellerProduct(id);
    loadProducts();
    setFlashMessage(lang === 'hi' ? 'लिस्टिंग हटाई गई।' : 'Listing deleted.');
  }

  function handleAdvanceStage(orderId) {
    advanceDemoOrderStage(orderId);
    setOrders(getDemoOrders());
  }

  function goToEdit(product) {
    setEditingProduct(product);
    setFlashMessage('');
    setActiveSection('edit');
  }

  function switchSection(id) {
    setActiveSection(id);
    setEditingProduct(null);
    setFlashMessage('');
  }

  const displaySection = editingProduct && activeSection === 'edit' ? 'edit' : activeSection;
  const sectionLabel = displaySection === 'edit'
    ? t('dashboard.editProductTitle')
    : sections.find((s) => s.id === activeSection)?.label;

  return (
    <div className="dash-page">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-sidebar__brand" aria-label="Gurvista Home">
          <img src={gurvistaLogo} alt="GurVista" className="dash-sidebar__logo" />
        </Link>

        <div className="dash-sidebar__user">
          <div className="dash-avatar" aria-hidden="true">{user.name?.[0]?.toUpperCase() || 'S'}</div>
          <div>
            <p className="dash-sidebar__name">{user.businessName || user.name}</p>
            <p className="dash-sidebar__role">{t('dashboard.demoSellerRole')}</p>
          </div>
        </div>

        <nav className="dash-nav" aria-label={t('dashboard.sellerTitle')}>
          {sections.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`dash-nav__item${activeSection === id ? ' dash-nav__item--active' : ''}`}
              onClick={() => switchSection(id)}
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
          <span className="dash-mobile-title">{t('dashboard.sellerTitle')}</span>
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
              onClick={() => switchSection(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="dash-demo-strip">{t('dashboard.sellerDemoStrip')}</div>

        <div className="dash-content">
          <div className="dash-content-header">
            <h1 className="dash-content-title">{sectionLabel}</h1>
            {activeSection === 'products' && products.length > 0 && (
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => switchSection('add')}
              >
                {t('dashboard.addNewProductBtn')}
              </button>
            )}
          </div>

          {flashMessage && (
            <p className="dash-success" style={{ marginBottom: 20 }}>{flashMessage}</p>
          )}

          {displaySection === 'overview' && (
            <Overview
              products={products}
              orders={orders}
              quotes={quotes}
              sellerName={user.businessName || user.name}
              onNavigate={switchSection}
            />
          )}
          {displaySection === 'products' && (
            <MyProducts
              products={products}
              onEdit={goToEdit}
              onDelete={handleDelete}
              onAdd={() => switchSection('add')}
            />
          )}
          {displaySection === 'add' && (
            <ProductForm
              defaultLocation={defaultLocation}
              onSave={handleAddProduct}
              onCancel={() => switchSection('products')}
              mode="add"
            />
          )}
          {displaySection === 'edit' && editingProduct && (
            <ProductForm
              key={editingProduct.id}
              initial={editingProduct}
              defaultLocation={defaultLocation}
              onSave={handleEditSave}
              onCancel={() => { setEditingProduct(null); setActiveSection('products'); }}
              mode="edit"
            />
          )}
          {displaySection === 'orders' && (
            <IncomingOrders orders={orders} onAdvanceStage={handleAdvanceStage} />
          )}
          {displaySection === 'inventory' && <Inventory products={products} onEdit={goToEdit} />}
          {displaySection === 'profile' && <BusinessProfile user={user} onUpdate={refreshUser} />}
        </div>
      </main>
    </div>
  );
}
