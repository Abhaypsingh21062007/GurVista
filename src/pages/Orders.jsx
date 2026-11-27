import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../data/marketplaceData';
import {
  advanceDemoOrderStage,
  clearDemoHistory,
  formatTimestamp,
  getDemoOrders,
  getDemoQuotes,
} from '../utils/demoOrdersStorage';
import { useLanguage } from '../context/useLanguage';
import OrderTracker from '../components/orders/OrderTracker';
import './Orders.css';

export default function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState(() => getDemoOrders());
  const [quotes, setQuotes] = useState(() => getDemoQuotes());

  const handleAdvanceStage = (orderId) => {
    advanceDemoOrderStage(orderId);
    setOrders(getDemoOrders());
  };

  const handleClearDemo = () => {
    clearDemoHistory();
    setOrders([]);
    setQuotes([]);
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <section className="page-header section--green">
        <div className="container orders-header__inner">
          <div>
            <span className="eyebrow">{t('ordersPage.eyebrow')}</span>
            <h1 className="page-title">{t('ordersPage.title')}</h1>
            <p className="page-desc">{t('ordersPage.desc')}</p>
          </div>
          {(orders.length > 0 || quotes.length > 0) && (
            <button
              type="button"
              className="btn btn--ghost-ivory btn--sm"
              onClick={handleClearDemo}
            >
              {t('ordersPage.clearDemo')}
            </button>
          )}
        </div>
      </section>

      {/* Simulation disclosure */}
      <div className="mkt-sample-bar">
        <div className="container mkt-sample-bar__inner">
          <span className="mkt-sample-bar__tag">{t('ordersPage.simTag')}</span>
          <p className="mkt-sample-bar__text">{t('detail.demoDisclaimer')}</p>
        </div>
      </div>

      {/* Orders list */}
      <section className="section section--ivory">
        <div className="container orders-content">
          <div className="orders-section-head">
            <div>
              <span className="eyebrow">{t('ordersPage.bulkHeading')}</span>
              <h2>{t('ordersPage.simOrdersTitle')} ({orders.length})</h2>
            </div>
            <div className="orders-section-head__links">
              <Link to="/jaggery" className="btn btn--ghost-green btn--sm">
                {t('ordersPage.exploreJaggery')}
              </Link>
              <Link to="/bagasse" className="btn btn--ghost-green btn--sm">
                {t('ordersPage.exploreBagasse')}
              </Link>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="orders-empty">
              <h3>{t('ordersPage.noOrdersTitle')}</h3>
              <p>{t('ordersPage.noOrdersDesc')}</p>
              <div className="orders-empty__actions">
                <Link to="/jaggery" className="btn btn--primary">{t('ordersPage.exploreJaggery')}</Link>
                <Link to="/bagasse" className="btn btn--secondary">{t('ordersPage.exploreBagasse')}</Link>
              </div>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-card__top">
                    <div>
                      <span className="order-card__meta">
                        {formatTimestamp(order.createdAt)} · {t('ordersPage.simTag')}
                      </span>
                      <h3 className="order-card__title">
                        <Link to={`/products/${order.productId}`}>{order.productName}</Link>
                      </h3>
                      <p className="order-card__supplier">
                        {t('detail.supplier')}: {order.supplier} ({order.location})
                      </p>
                    </div>
                    <div className="order-card__totals">
                      <span>{order.quantity} {t('detail.quintalsWord')} @ {formatINR(order.pricePerQuintal)}/qtl</span>
                      <span className="order-card__fee">
                        {t('detail.subtotal')} {formatINR(order.subtotal)} + 2% {formatINR(order.platformFee)}
                      </span>
                      <strong className="order-card__final">
                        {t('detail.finalAmount')}: {formatINR(order.finalAmount)}
                      </strong>
                    </div>
                  </div>

                  {order.delivery && (
                    <div className="order-card__delivery">
                      <strong>{t('ordersPage.deliveryTo')}</strong> {order.delivery.buyerName}
                      {order.delivery.companyName ? ` (${order.delivery.companyName})` : ''} ·{' '}
                      {order.delivery.address}, {order.delivery.cityState} – {order.delivery.pincode} ·{' '}
                      {order.delivery.phone}
                    </div>
                  )}

                  <OrderTracker order={order} onAdvanceStage={handleAdvanceStage} />
                </article>
              ))}
            </div>
          )}

          {/* Saved Quote Requests */}
          <div className="quotes-section">
            <div className="orders-section-head">
              <div>
                <span className="eyebrow">{t('ordersPage.customEnquiries')}</span>
                <h2>{t('ordersPage.savedQuotesTitle')} ({quotes.length})</h2>
              </div>
            </div>

            {quotes.length === 0 ? (
              <p className="quotes-empty-text">{t('ordersPage.noQuotesText')}</p>
            ) : (
              <div className="quotes-grid">
                {quotes.map((q) => (
                  <article key={q.id} className="quote-card">
                    <div className="quote-card__head">
                      <span className="tag tag--outline">{q.id}</span>
                      <span className="quote-card__time">{formatTimestamp(q.createdAt)}</span>
                    </div>
                    <h3 className="quote-card__title">{q.productName}</h3>
                    <p className="quote-card__meta">
                      {q.requestedQuantity} {t('detail.quintalsWord')} · {t('detail.subtotal')} {formatINR(q.estimatedSubtotal)}
                    </p>
                    <p className="quote-card__meta">
                      {t('ordersPage.buyerWord')} {q.buyerName} · {t('ordersPage.deliveryWord')} {q.deliveryLocation}
                    </p>
                    {q.notes && <p className="quote-card__notes">“{q.notes}”</p>}
                    <span className="quote-card__status">{q.status}</span>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
