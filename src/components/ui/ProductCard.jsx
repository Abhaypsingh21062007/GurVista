import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../data/marketplaceData';
import { defaultImageForCategory } from '../../utils/sellerProductStorage';
import { useLanguage } from '../../context/useLanguage';
import { localizeCategory } from '../../i18n/translations';
import './ProductCard.css';

/**
 * ProductCard — Reusable marketplace listing card for Jaggery & Bagasse.
 */
export default function ProductCard({ product, variant }) {
  const { lang, t } = useLanguage();
  const {
    id,
    marketplace,
    category,
    name,
    nameHi,
    supplier,
    sellerName,
    location,
    pricePerQuintal,
    availableStock,
    image,
    imageUrl,
    imageAlt,
    specs,
    isSample,
    isSellerListing,
  } = product;

  const mode = variant || marketplace || 'jaggery';
  const isBagasse = mode === 'bagasse';
  const displaySupplier = supplier || sellerName || 'Partner Producer';
  const fallbackImage = defaultImageForCategory(category);
  const [imgSrc, setImgSrc] = useState(() => image || imageUrl || fallbackImage);
  const primaryTitle = lang === 'hi' && nameHi ? nameHi : name;
  const secondaryTitle = lang === 'hi' && nameHi ? name : nameHi;

  return (
    <article className={`product-card product-card--${mode}`}>
      <Link
        to={`/products/${id}`}
        className="product-card__image-wrap"
        aria-label={`${t('marketplace.viewDetails')}: ${primaryTitle}`}
      >
        <img
          src={imgSrc}
          alt={imageAlt || primaryTitle}
          className="product-card__image"
          loading="lazy"
          decoding="async"
          onError={() => {
            if (imgSrc !== fallbackImage) setImgSrc(fallbackImage);
          }}
        />
      </Link>

      <div className="product-card__body">
        <div className="product-card__header">
          <div className="product-card__eyebrow-row">
            <span className={`tag ${isBagasse ? 'tag--green' : 'tag--brown'}`}>
              {localizeCategory(category, lang)}
            </span>
            {isSellerListing ? (
              <span className="product-card__sample-label">
                {t('marketplace.sellerDemoLabel')}
              </span>
            ) : isSample ? (
              <span className="product-card__sample-label">
                {t('marketplace.sampleDemoLabel')}
              </span>
            ) : null}
          </div>

          <div className="product-card__title-row">
            <Link to={`/products/${id}`} className="product-card__name-link">
              <h3 className="product-card__name">{primaryTitle}</h3>
            </Link>
            {secondaryTitle && (
              <span className="product-card__name-hi" lang={lang === 'hi' ? 'en' : 'hi'}>
                {secondaryTitle}
              </span>
            )}
          </div>
        </div>

        <dl className="product-card__details">
          <div className="product-card__detail-row">
            <dt>{t('marketplace.supplier')}</dt>
            <dd>{displaySupplier}</dd>
          </div>
          <div className="product-card__detail-row">
            <dt>{t('marketplace.location')}</dt>
            <dd>{location}</dd>
          </div>
          <div className="product-card__detail-row">
            <dt>{t('marketplace.availableStock')}</dt>
            <dd className="num">
              {Number(availableStock).toLocaleString('en-IN')} {t('marketplace.quintals')}
            </dd>
          </div>
          {isBagasse && specs?.Moisture && (
            <div className="product-card__detail-row">
              <dt>{t('marketplace.moisture')}</dt>
              <dd className="num">{specs.Moisture}</dd>
            </div>
          )}
        </dl>

        <div className="product-card__footer">
          <div className="product-card__price-block">
            <span className="product-card__price num">
              {formatINR(pricePerQuintal)}
              <span className="product-card__price-unit">{t('marketplace.perQuintal')}</span>
            </span>
          </div>
          <Link
            to={`/products/${id}`}
            className={`btn btn--sm ${isBagasse ? 'btn--secondary' : 'btn--ghost-brown'}`}
          >
            {t('marketplace.viewDetails')}
          </Link>
        </div>
      </div>
    </article>
  );
}
