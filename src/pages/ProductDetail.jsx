import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MARKETPLACE_PRODUCTS,
  formatINR,
} from '../data/marketplaceData';
import {
  advanceDemoOrderStage,
  calculateOrderTotals,
  getRemainingDemoStock,
  saveDemoOrder,
  saveDemoQuote,
} from '../utils/demoOrdersStorage';
import { defaultImageForCategory, getAllSellerProducts } from '../utils/sellerProductStorage';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { localizeCategory } from '../i18n/translations';
import {
  isProductSaved,
  saveProduct,
  unsaveProduct,
} from '../utils/savedProductsStorage';
import OrderTracker from '../components/orders/OrderTracker';
import './ProductDetail.css';

const INITIAL_DELIVERY = {
  buyerName: '',
  companyName: '',
  phone: '',
  email: '',
  address: '',
  cityState: '',
  pincode: '',
  notes: '',
};

const INITIAL_QUOTE = {
  buyerName: '',
  phone: '',
  email: '',
  deliveryLocation: '',
  notes: '',
};

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const product = [...MARKETPLACE_PRODUCTS, ...getAllSellerProducts()].find(
    (p) => p.id === id
  );

  if (!product) {
    return (
      <section className="section section--ivory">
        <div className="container detail-not-found">
          <span className="eyebrow">{t('detail.notFoundEyebrow')}</span>
          <h1>{t('detail.notFoundTitle')}</h1>
          <p>{t('detail.notFoundDesc')}</p>
          <div className="detail-not-found__actions">
            <Link to="/jaggery" className="btn btn--primary">{t('detail.browseJaggery')}</Link>
            <Link to="/bagasse" className="btn btn--ghost-green">{t('detail.browseBagasse')}</Link>
          </div>
        </div>
      </section>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
}

function ProductDetailContent({ product }) {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const actionSectionRef = useRef(null);
  const fallbackImage = defaultImageForCategory(product.category);
  const [imgSrc, setImgSrc] = useState(() => product.image || product.imageUrl || fallbackImage);
  const [remainingStock, setRemainingStock] = useState(() =>
    getRemainingDemoStock(product.id, product.availableStock)
  );
  const [quantityInput, setQuantityInput] = useState(
    String(Math.min(product.minOrderQuintals, Math.max(1, remainingStock)))
  );
  const [activeMode, setActiveMode] = useState('bulk');
  const [delivery, setDelivery] = useState(() => ({
    ...INITIAL_DELIVERY,
    buyerName: user?.role === 'buyer' ? (user.name || '') : '',
    phone: user?.role === 'buyer' ? (user.phone || '') : '',
    email: user?.role === 'buyer' ? (user.email || '') : '',
    cityState:
      user?.role === 'buyer' && user.city
        ? [user.city, user.state].filter(Boolean).join(', ')
        : '',
  }));
  const [quoteForm, setQuoteForm] = useState(() => ({
    ...INITIAL_QUOTE,
    buyerName: user?.role === 'buyer' ? (user.name || '') : '',
    phone: user?.role === 'buyer' ? (user.phone || '') : '',
    email: user?.role === 'buyer' ? (user.email || '') : '',
    deliveryLocation: user?.role === 'buyer' ? (user.city || '') : '',
  }));
  const [formError, setFormError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [savedQuote, setSavedQuote] = useState(null);
  const [isSaved, setIsSaved] = useState(() =>
    user?.role === 'buyer' ? isProductSaved(user.id, product.id) : false
  );

  const toggleSaveProduct = () => {
    if (!user) {
      navigate('/login?role=buyer');
      return;
    }
    if (user.role !== 'buyer') return;
    if (isSaved) {
      unsaveProduct(user.id, product.id);
      setIsSaved(false);
    } else {
      saveProduct(user.id, product.id);
      setIsSaved(true);
    }
  };

  const isBagasse = product.marketplace === 'bagasse';
  const backRoute = isBagasse ? '/bagasse' : '/jaggery';
  const backLabel = isBagasse ? t('detail.backBagasse') : t('detail.backJaggery');
  const displayName = lang === 'hi' && product.nameHi ? product.nameHi : product.name;
  const secondaryName = lang === 'hi' && product.nameHi ? product.name : product.nameHi;

  const parsedQty = Number(quantityInput);
  const isWholePositive =
    quantityInput.trim() !== '' &&
    Number.isInteger(parsedQty) &&
    parsedQty > 0;

  let qtyError = '';
  if (remainingStock === 0) {
    qtyError = lang === 'hi'
      ? 'इस उत्पाद का सारा डेमो स्टॉक आपके ब्राउज़र सत्र में बुक हो चुका है।'
      : 'All demonstration stock for this listing has been reserved in your browser session.';
  } else if (!isWholePositive) {
    qtyError = lang === 'hi'
      ? 'कृपया क्विंटल में पूर्ण संख्या दर्ज करें।'
      : 'Enter a whole number of quintals.';
  } else if (parsedQty < product.minOrderQuintals) {
    qtyError = lang === 'hi'
      ? `न्यूनतम ऑर्डर मात्रा ${product.minOrderQuintals} क्विंटल है।`
      : `Minimum order quantity is ${product.minOrderQuintals} quintals.`;
  } else if (parsedQty > remainingStock) {
    qtyError = lang === 'hi'
      ? `मात्रा उपलब्ध स्टॉक (${remainingStock.toLocaleString('en-IN')} क्विंटल) से अधिक है।`
      : `Quantity exceeds available stock (${remainingStock.toLocaleString('en-IN')} quintals remaining).`;
  }

  const effectiveQty = isWholePositive ? parsedQty : 0;
  const totals = calculateOrderTotals(effectiveQty, product.pricePerQuintal);

  const stepQuantity = (delta) => {
    const base = isWholePositive ? parsedQty : product.minOrderQuintals;
    const next = Math.min(
      Math.max(product.minOrderQuintals, base + delta),
      Math.max(product.minOrderQuintals, remainingStock)
    );
    setQuantityInput(String(next));
    setFormError('');
  };

  const openPanel = (mode) => {
    setActiveMode(mode);
    setFormError('');
    actionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDeliveryChange = (e) => {
    setDelivery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleQuoteChange = (e) => {
    setQuoteForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handlePlaceDemoOrder = (e) => {
    e.preventDefault();
    if (qtyError) {
      setFormError(qtyError);
      return;
    }

    const requiredFields = [
      ['buyerName', lang === 'hi' ? 'पूरा नाम' : 'Full Name'],
      ['phone', lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'],
      ['email', lang === 'hi' ? 'ईमेल पता' : 'Email Address'],
      ['address', lang === 'hi' ? 'डिलीवरी पता' : 'Delivery Address'],
      ['cityState', lang === 'hi' ? 'शहर और राज्य' : 'City & State'],
      ['pincode', lang === 'hi' ? 'पिन कोड' : 'PIN Code'],
    ];

    for (const [field, label] of requiredFields) {
      if (!delivery[field].trim()) {
        setFormError(
          lang === 'hi'
            ? `डेमो ऑर्डर दर्ज करने के लिए कृपया ${label} भरें।`
            : `Please enter ${label} to place this demonstration order.`
        );
        return;
      }
    }

    const order = saveDemoOrder({
      productId: product.id,
      productName: product.name,
      marketplace: product.marketplace,
      supplier: product.supplier,
      location: product.location,
      quantity: totals.quantity,
      pricePerQuintal: totals.pricePerQuintal,
      subtotal: totals.subtotal,
      platformFee: totals.platformFee,
      finalAmount: totals.finalAmount,
      delivery: { ...delivery },
    });

    setPlacedOrder(order);
    setRemainingStock(getRemainingDemoStock(product.id, product.availableStock));
    setActiveMode('order-confirmed');
    setFormError('');
  };

  const handleRequestQuoteSubmit = (e) => {
    e.preventDefault();
    if (!isWholePositive || parsedQty < 1) {
      setFormError(
        lang === 'hi'
          ? 'कृपया क्विंटल में सही मात्रा दर्ज करें।'
          : 'Please enter a valid requested quantity in quintals.'
      );
      return;
    }
    if (!quoteForm.buyerName.trim() || !quoteForm.phone.trim() || !quoteForm.deliveryLocation.trim()) {
      setFormError(
        lang === 'hi'
          ? 'कृपया अपना नाम, मोबाइल नंबर और डिलीवरी शहर भरें।'
          : 'Please fill in your name, phone number, and delivery city.'
      );
      return;
    }

    const quote = saveDemoQuote({
      productId: product.id,
      productName: product.name,
      marketplace: product.marketplace,
      supplier: product.supplier,
      location: product.location,
      requestedQuantity: parsedQty,
      indicativePricePerQuintal: product.pricePerQuintal,
      estimatedSubtotal: totals.subtotal,
      ...quoteForm,
    });

    setSavedQuote(quote);
    setActiveMode('quote-confirmed');
    setFormError('');
  };

  const handleAdvancePlacedOrder = (orderId) => {
    const updated = advanceDemoOrderStage(orderId);
    if (updated) setPlacedOrder(updated);
  };

  const quickSteps = isBagasse ? [50, 100, 250] : [5, 10, 25];

  return (
    <div className={`detail-page detail-page--${product.marketplace}`}>
      {/* Sample disclosure */}
      <div className="mkt-sample-bar">
        <div className="container mkt-sample-bar__inner">
          <span className="mkt-sample-bar__tag">{t('marketplace.sampleTag')}</span>
          <p className="mkt-sample-bar__text">{t('marketplace.sampleNotice')}</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container">
          <div className="detail-top-nav">
            <Link to={backRoute} className="detail-back">
              ← {backLabel}
            </Link>
            <Link to="/orders" className="detail-orders-link">
              {t('detail.viewDemoOrders')}
            </Link>
          </div>

          <div className="detail-grid">
            {/* ── Left Column: Large Photo + Specifications ─────── */}
            <div className="detail-left">
              <div className="detail-visual">
                <img
                  src={imgSrc}
                  alt={product.imageAlt || displayName}
                  className="detail-visual__img"
                  loading="eager"
                  decoding="async"
                  onError={() => {
                    if (imgSrc !== fallbackImage) setImgSrc(fallbackImage);
                  }}
                />
              </div>

              <div className="detail-spec-card">
                <h2 className="detail-spec-card__title">
                  {isBagasse ? t('detail.industrialSpecs') : t('detail.productSpecs')}
                </h2>
                <dl className="detail-specs">
                  <div className="detail-specs__row">
                    <dt>{t('detail.supplier')}</dt>
                    <dd>{product.supplier}</dd>
                  </div>
                  <div className="detail-specs__row">
                    <dt>{t('detail.originLocation')}</dt>
                    <dd>{product.location}</dd>
                  </div>
                  <div className="detail-specs__row">
                    <dt>{t('detail.minOrder')}</dt>
                    <dd>{product.minOrderQuintals} {t('detail.quintalsWord')}</dd>
                  </div>
                  <div className="detail-specs__row">
                    <dt>{t('detail.packaging')}</dt>
                    <dd>{product.packaging}</dd>
                  </div>
                  {product.specs &&
                    Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="detail-specs__row">
                        <dt>{key}</dt>
                        <dd>{val}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            </div>

            {/* ── Right Column: Info + Quantity + Order Summary ─── */}
            <div className="detail-info">
              <div className="detail-info__top">
                <span className={`tag ${isBagasse ? 'tag--green' : 'tag--brown'}`}>
                  {localizeCategory(product.category, lang)}
                </span>
                <span className="detail-sample-note">
                  {product.isSellerListing
                    ? t('marketplace.sellerDemoLabel')
                    : t('marketplace.sampleDemoLabel')}
                </span>
              </div>

              <h1 className="detail-title">{displayName}</h1>
              {secondaryName && (
                <p className="detail-title-hi" lang={lang === 'hi' ? 'en' : 'hi'}>{secondaryName}</p>
              )}

              <p className="detail-supplier-line">
                {t('detail.suppliedBy')} <strong>{product.supplier}</strong> · {product.location}
              </p>

              <p className="detail-desc">{product.description}</p>

              {/* Price & Stock Banner */}
              <div className="detail-price-box">
                <div>
                  <span className="detail-price-label">{t('detail.pricePerQuintal')}</span>
                  <div className="detail-price">
                    {formatINR(product.pricePerQuintal)}
                    <span className="detail-price__unit"> {t('detail.quintalUnit')}</span>
                  </div>
                </div>
                <div className="detail-stock-block">
                  <span className="detail-stock">
                    {t('detail.availableStock')}{' '}
                    <strong>{remainingStock.toLocaleString('en-IN')} {t('detail.quintalsWord')}</strong>
                  </span>
                  <span className="detail-min-order">
                    {t('detail.minOrderShort')} <strong>{product.minOrderQuintals} {t('detail.quintalsWord')}</strong>
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="qty-box">
                <div className="qty-box__head">
                  <label htmlFor="bulk-qty-input" className="qty-box__label">
                    {t('detail.orderQtyLabel')}
                  </label>
                  <div className="qty-presets" aria-label="Quick quantity presets">
                    <button
                      type="button"
                      className="qty-preset-btn"
                      onClick={() => {
                        setQuantityInput(String(product.minOrderQuintals));
                        setFormError('');
                      }}
                    >
                      {t('detail.minBtn')} ({product.minOrderQuintals})
                    </button>
                    {quickSteps.map((step) => (
                      <button
                        key={step}
                        type="button"
                        className="qty-preset-btn"
                        disabled={remainingStock < product.minOrderQuintals}
                        onClick={() => stepQuantity(step)}
                      >
                        +{step}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qty-stepper">
                  <button
                    type="button"
                    className="qty-stepper__btn"
                    aria-label="Decrease quantity by 1 quintal"
                    onClick={() => stepQuantity(-1)}
                    disabled={parsedQty <= product.minOrderQuintals}
                  >
                    −
                  </button>
                  <input
                    id="bulk-qty-input"
                    type="number"
                    min={product.minOrderQuintals}
                    max={Math.max(product.minOrderQuintals, remainingStock)}
                    step={1}
                    className="qty-stepper__input"
                    value={quantityInput}
                    onChange={(e) => {
                      setQuantityInput(e.target.value);
                      setFormError('');
                    }}
                  />
                  <button
                    type="button"
                    className="qty-stepper__btn"
                    aria-label="Increase quantity by 1 quintal"
                    onClick={() => stepQuantity(1)}
                    disabled={parsedQty >= remainingStock}
                  >
                    +
                  </button>
                  <span className="qty-stepper__unit">{t('detail.quintalsWord')}</span>
                </div>

                {qtyError && (
                  <p className="qty-error" role="alert">
                    {qtyError}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="order-summary" aria-label={t('detail.orderSummary')}>
                <div className="order-summary__head">
                  <h2>{t('detail.orderSummary')}</h2>
                  <span className="order-summary__badge">{t('detail.demoEstimate')}</span>
                </div>

                <dl className="order-summary__rows">
                  <div className="order-summary__row">
                    <dt>
                      {t('detail.quantity')} ({totals.quantity.toLocaleString('en-IN')} {t('detail.quintalsWord')} × {formatINR(product.pricePerQuintal)})
                    </dt>
                    <dd>{formatINR(totals.subtotal)}</dd>
                  </div>
                  <div className="order-summary__row">
                    <dt>{t('detail.subtotal')}</dt>
                    <dd>{formatINR(totals.subtotal)}</dd>
                  </div>
                  <div className="order-summary__row">
                    <dt>{t('detail.platformFee')}</dt>
                    <dd>{formatINR(totals.platformFee)}</dd>
                  </div>
                  <div className="order-summary__row order-summary__row--total">
                    <dt>{t('detail.finalAmount')}</dt>
                    <dd>{formatINR(totals.finalAmount)}</dd>
                  </div>
                </dl>

                <p className="order-summary__note">{t('detail.summaryNote')}</p>
              </div>

              {/* Primary CTAs */}
              <div className="detail-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => openPanel('bulk')}
                >
                  {t('detail.orderBulkBtn')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost-green"
                  onClick={() => openPanel('quote')}
                >
                  {t('detail.requestQuoteBtn')}
                </button>
                {(!user || user.role === 'buyer') && (
                  <button
                    type="button"
                    className={`btn ${isSaved ? 'btn--secondary' : 'btn--ghost-brown'}`}
                    onClick={toggleSaveProduct}
                  >
                    {isSaved ? t('detail.savedProduct') : t('detail.saveProduct')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Interactive Checkout / Quote / Confirmation Panel ── */}
          <div ref={actionSectionRef} className="detail-workflow">
            <div className="detail-workflow__tabs" role="tablist" aria-label="Order workflow options">
              <button
                type="button"
                role="tab"
                aria-selected={activeMode === 'bulk' || activeMode === 'order-confirmed'}
                className={`detail-tab${
                  activeMode === 'bulk' || activeMode === 'order-confirmed'
                    ? ' detail-tab--active'
                    : ''
                }`}
                onClick={() => setActiveMode('bulk')}
              >
                {t('detail.tabBulk')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeMode === 'quote' || activeMode === 'quote-confirmed'}
                className={`detail-tab${
                  activeMode === 'quote' || activeMode === 'quote-confirmed'
                    ? ' detail-tab--active'
                    : ''
                }`}
                onClick={() => setActiveMode('quote')}
              >
                {t('detail.tabQuote')}
              </button>
            </div>

            <div className="detail-workflow__panel">
              <div className="demo-notice-strip">
                <strong>{t('detail.simCheckoutLabel')}</strong> {t('detail.demoDisclaimer')}
              </div>

              {formError && (
                <div className="form-alert" role="alert">
                  {formError}
                </div>
              )}

              {/* ── Mode 1: Bulk Delivery & Demo Order Form ── */}
              {activeMode === 'bulk' && (
                <form className="checkout-form" onSubmit={handlePlaceDemoOrder} noValidate>
                  <div className="checkout-form__intro">
                    <h3>{t('detail.deliveryHeading')}</h3>
                    <p>
                      {t('detail.deliverySub')} <strong>{totals.quantity} {t('detail.quintalsWord')}</strong> ({displayName}) · {t('detail.finalAmountWord')}{' '}
                      <strong>{formatINR(totals.finalAmount)}</strong> {t('detail.includesFee')}
                    </p>
                  </div>

                  <div className="checkout-form__grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="buyerName">{t('detail.fullName')}</label>
                      <input
                        id="buyerName"
                        name="buyerName"
                        type="text"
                        className="form-input"
                        value={delivery.buyerName}
                        onChange={handleDeliveryChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="companyName">{t('detail.companyName')}</label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        className="form-input"
                        value={delivery.companyName}
                        onChange={handleDeliveryChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">{t('detail.phone')}</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={delivery.phone}
                        onChange={handleDeliveryChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">{t('detail.email')}</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder="buyer@company.in"
                        value={delivery.email}
                        onChange={handleDeliveryChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="address">{t('detail.address')}</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="form-input"
                      value={delivery.address}
                      onChange={handleDeliveryChange}
                      required
                    />
                  </div>

                  <div className="checkout-form__grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="cityState">{t('detail.cityState')}</label>
                      <input
                        id="cityState"
                        name="cityState"
                        type="text"
                        className="form-input"
                        value={delivery.cityState}
                        onChange={handleDeliveryChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="pincode">{t('detail.pincode')}</label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        className="form-input"
                        placeholder="251001"
                        value={delivery.pincode}
                        onChange={handleDeliveryChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="notes">{t('detail.notes')}</label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="form-textarea"
                      style={{ minHeight: '90px' }}
                      value={delivery.notes}
                      onChange={handleDeliveryChange}
                    />
                  </div>

                  <div className="checkout-form__actions">
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={Boolean(qtyError)}
                    >
                      {t('detail.placeOrderBtn')} ({formatINR(totals.finalAmount)})
                    </button>
                  </div>
                </form>
              )}

              {/* ── Mode 2: Request a Quote Form ── */}
              {activeMode === 'quote' && (
                <form className="checkout-form" onSubmit={handleRequestQuoteSubmit} noValidate>
                  <div className="checkout-form__intro">
                    <h3>{t('detail.quoteHeading')}</h3>
                    <p>
                      {t('detail.quoteSub')} <strong>{displayName}</strong> ({product.supplier}).
                    </p>
                  </div>

                  <div className="checkout-form__grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="q-buyerName">{t('detail.yourName')}</label>
                      <input
                        id="q-buyerName"
                        name="buyerName"
                        type="text"
                        className="form-input"
                        value={quoteForm.buyerName}
                        onChange={handleQuoteChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="q-phone">{t('detail.phone')}</label>
                      <input
                        id="q-phone"
                        name="phone"
                        type="tel"
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={quoteForm.phone}
                        onChange={handleQuoteChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="q-email">{t('detail.email').replace(' *', '')}</label>
                      <input
                        id="q-email"
                        name="email"
                        type="email"
                        className="form-input"
                        value={quoteForm.email}
                        onChange={handleQuoteChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="q-deliveryLocation">{t('detail.deliveryCity')}</label>
                      <input
                        id="q-deliveryLocation"
                        name="deliveryLocation"
                        type="text"
                        className="form-input"
                        value={quoteForm.deliveryLocation}
                        onChange={handleQuoteChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="q-notes">
                      {t('detail.quoteNotes')} ({effectiveQty || 0} {t('detail.quintalsWord')})
                    </label>
                    <textarea
                      id="q-notes"
                      name="notes"
                      className="form-textarea"
                      style={{ minHeight: '90px' }}
                      value={quoteForm.notes}
                      onChange={handleQuoteChange}
                    />
                  </div>

                  <div className="checkout-form__actions">
                    <button type="submit" className="btn btn--secondary">
                      {t('detail.submitQuoteBtn')}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Mode 3: Placed Order Confirmation + Tracker ── */}
              {activeMode === 'order-confirmed' && placedOrder && (
                <div className="confirmation-box">
                  <div className="confirmation-box__head">
                    <div>
                      <span className="tag tag--green">{t('detail.orderConfirmedTag')}</span>
                      <h3>{t('detail.orderPlacedTitle')} — {placedOrder.id}</h3>
                      <p>
                        {placedOrder.quantity} {t('detail.quintalsWord')} · {placedOrder.productName} ·{' '}
                        <strong>{formatINR(placedOrder.finalAmount)}</strong>
                      </p>
                    </div>
                    <Link to="/orders" className="btn btn--primary btn--sm">
                      {t('detail.viewAllOrdersBtn')}
                    </Link>
                  </div>

                  <OrderTracker
                    order={placedOrder}
                    onAdvanceStage={handleAdvancePlacedOrder}
                  />
                </div>
              )}

              {/* ── Mode 4: Quote Request Confirmation ── */}
              {activeMode === 'quote-confirmed' && savedQuote && (
                <div className="confirmation-box">
                  <div className="confirmation-box__head">
                    <div>
                      <span className="tag tag--brown">{t('detail.quoteConfirmedTag')}</span>
                      <h3>{t('detail.quoteLoggedTitle')} — {savedQuote.id}</h3>
                      <p>
                        {savedQuote.requestedQuantity} {t('detail.quintalsWord')} · {savedQuote.productName} ({savedQuote.deliveryLocation}).{' '}
                        {t('detail.quoteLoggedDesc')}
                      </p>
                    </div>
                    <Link to="/orders" className="btn btn--secondary btn--sm">
                      {t('detail.viewAllQuotesBtn')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
