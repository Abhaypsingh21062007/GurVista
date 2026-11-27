import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { QUANTITY_FILTERS } from '../../data/marketplaceData';
import { useLanguage } from '../../context/useLanguage';
import { localizeCategory } from '../../i18n/translations';
import './MarketplaceShell.css';

function localizePriceRangeLabel(range, lang) {
  if (lang !== 'hi') return range.label;
  const map = {
    all: 'सभी भाव',
    'under-4300': '₹4,300 / क्विंटल तक',
    '4300-5000': '₹4,300 – ₹5,000 / क्विंटल',
    'above-5000': '₹5,000 / क्विंटल से अधिक',
    'under-260': '₹260 / क्विंटल तक',
    '260-360': '₹260 – ₹360 / क्विंटल',
    'above-360': '₹360 / क्विंटल से अधिक',
    'under-500': '₹500 / क्विंटल से कम (बगास)',
    '3500-4500': '₹3,500 – ₹4,500 / क्विंटल',
    'above-4500': '₹4,500 / क्विंटल से अधिक',
  };
  return map[range.id] || range.label;
}

function localizeQtyLabel(q, lang, t) {
  if (lang !== 'hi') return q.label;
  const map = {
    any: t('marketplace.qtyAny'),
    50: t('marketplace.qty50'),
    100: t('marketplace.qty100'),
    250: t('marketplace.qty250'),
    500: t('marketplace.qty500'),
  };
  return map[q.id] || q.label;
}

function FilterControls({
  categories,
  priceRanges,
  selectedCategory,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  selectedQty,
  onSelectQty,
  onReset,
  hasActiveFilters,
  idPrefix,
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="mkt-filters">
      {/* Category */}
      <div className="mkt-filter-group">
        <h3 className="mkt-filter-heading">{t('marketplace.categoryHeading')}</h3>
        <div className="mkt-filter-options" role="radiogroup" aria-label={t('marketplace.categoryHeading')}>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={active}
                className={`mkt-filter-btn${active ? ' mkt-filter-btn--active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                <span>{localizeCategory(cat, lang)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div className="mkt-filter-group">
        <h3 className="mkt-filter-heading">{t('marketplace.priceHeading')}</h3>
        <div className="mkt-filter-options" role="radiogroup" aria-label={t('marketplace.priceHeading')}>
          {priceRanges.map((range) => {
            const active = selectedPriceRange === range.id;
            return (
              <label key={range.id} className="mkt-radio-row">
                <input
                  type="radio"
                  name={`${idPrefix}-price`}
                  checked={active}
                  onChange={() => onSelectPriceRange(range.id)}
                />
                <span>{localizePriceRangeLabel(range, lang)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Available quantity */}
      <div className="mkt-filter-group">
        <h3 className="mkt-filter-heading">{t('marketplace.qtyHeading')}</h3>
        <div className="mkt-filter-options" role="radiogroup" aria-label={t('marketplace.qtyHeading')}>
          {QUANTITY_FILTERS.map((q) => {
            const active = selectedQty === q.id;
            return (
              <label key={q.id} className="mkt-radio-row">
                <input
                  type="radio"
                  name={`${idPrefix}-qty`}
                  checked={active}
                  onChange={() => onSelectQty(q.id)}
                />
                <span>{localizeQtyLabel(q, lang, t)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" className="btn btn--ghost-green btn--sm mkt-reset-btn" onClick={onReset}>
          {t('marketplace.clearAllFilters')}
        </button>
      )}
    </div>
  );
}

/**
 * MarketplaceShell — Reusable search, filter, sort, mobile drawer and grid
 * tailored for either 'jaggery' (premium agri-commerce) or 'bagasse' (industrial B2B).
 */
export default function MarketplaceShell({
  variant = 'jaggery',
  eyebrow,
  title,
  subtitle,
  products,
  categories,
  priceRanges,
  initialCategory = 'All',
  b2bSpecsBar,
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedQty, setSelectedQty] = useState('any');
  const [sortBy, setSortBy] = useState('default');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (selectedQty !== 'any' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange('all');
    setSelectedQty('any');
    setSortBy('default');
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const priceRule = priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
    const qtyRule = QUANTITY_FILTERS.find((f) => f.id === selectedQty) || QUANTITY_FILTERS[0];

    const list = products.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (item.pricePerQuintal < priceRule.min || item.pricePerQuintal > priceRule.max) {
        return false;
      }
      if (item.availableStock < qtyRule.minStock) {
        return false;
      }
      if (q) {
        const haystack = [
          item.name,
          item.nameHi || '',
          item.category,
          item.supplier || item.sellerName || '',
          item.location,
          item.description,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
    }
    return list;
  }, [products, searchQuery, selectedCategory, selectedPriceRange, selectedQty, sortBy, priceRanges]);

  const isBagasse = variant === 'bagasse';

  return (
    <div className={`mkt-page mkt-page--${variant}`}>
      {/* ── Page Header ─────────────────────────────────────── */}
      <section className={`mkt-header ${isBagasse ? 'mkt-header--bagasse' : 'mkt-header--jaggery'}`}>
        <div className="container">
          <div className="mkt-header__inner">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mkt-header__title">{title}</h1>
            <p className="mkt-header__subtitle">{subtitle}</p>
          </div>

          {b2bSpecsBar && (
            <div className="mkt-b2b-strip" aria-label="Industrial procurement specifications">
              {b2bSpecsBar.map(({ label, value }) => (
                <div key={label} className="mkt-b2b-strip__item">
                  <span className="mkt-b2b-strip__label">{label}</span>
                  <strong className="mkt-b2b-strip__value">{value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Sample Data Disclosure Strip ────────────────────── */}
      <div className="mkt-sample-bar">
        <div className="container mkt-sample-bar__inner">
          <span className="mkt-sample-bar__tag">{t('marketplace.sampleTag')}</span>
          <p className="mkt-sample-bar__text">{t('marketplace.sampleNotice')}</p>
        </div>
      </div>

      {/* ── Main Workspace ──────────────────────────────────── */}
      <section className="mkt-body section--ivory">
        <div className="container">
          {/* Toolbar: Search + Mobile Filter Trigger + Sort */}
          <div className="mkt-toolbar">
            <div className="mkt-search">
              <label htmlFor={`search-${variant}`} className="visually-hidden">
                {t('marketplace.searchLabel')}
              </label>
              <input
                id={`search-${variant}`}
                type="search"
                className="form-input mkt-search__input"
                placeholder={t('marketplace.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mkt-toolbar__controls">
              <button
                type="button"
                className="btn btn--ghost-green btn--sm mkt-mobile-filter-btn"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls={`filter-drawer-${variant}`}
              >
                {t('marketplace.filterBtn')}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>

              <div className="mkt-sort">
                <label htmlFor={`sort-${variant}`} className="mkt-sort__label">
                  {t('marketplace.sortLabel')}
                </label>
                <select
                  id={`sort-${variant}`}
                  className="form-select mkt-sort__select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">{t('marketplace.sortDefault')}</option>
                  <option value="price-asc">{t('marketplace.sortAsc')}</option>
                  <option value="price-desc">{t('marketplace.sortDesc')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Layout: Desktop Sidebar + Product Grid */}
          <div className="mkt-layout">
            <aside className="mkt-sidebar" aria-label={t('marketplace.filtersTitle')}>
              <div className="mkt-sidebar__panel">
                <div className="mkt-sidebar__head">
                  <h2 className="mkt-sidebar__title">{t('marketplace.filtersTitle')}</h2>
                  <span className="mkt-count-badge">
                    {filteredProducts.length} {t('marketplace.listingsWord')}
                  </span>
                </div>
                <FilterControls
                  categories={categories}
                  priceRanges={priceRanges}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedPriceRange={selectedPriceRange}
                  onSelectPriceRange={setSelectedPriceRange}
                  selectedQty={selectedQty}
                  onSelectQty={setSelectedQty}
                  onReset={resetFilters}
                  hasActiveFilters={activeFilterCount > 0 || sortBy !== 'default'}
                  idPrefix={`desktop-${variant}`}
                />
              </div>
            </aside>

            <div className="mkt-results">
              <div className="mkt-results__meta">
                <p className="mkt-results__count">
                  {t('marketplace.showingPrefix')} <strong>{filteredProducts.length}</strong> {t('marketplace.ofText')} {products.length} {t('marketplace.listingsWord')}
                </p>
                {activeFilterCount > 0 && (
                  <button type="button" className="mkt-inline-clear" onClick={resetFilters}>
                    {t('marketplace.clearAll')}
                  </button>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className={`mkt-grid mkt-grid--${variant}`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant={variant} />
                  ))}
                </div>
              ) : (
                <div className="mkt-empty">
                  <h3>{t('marketplace.noMatchTitle')}</h3>
                  <p>{t('marketplace.noMatchDesc')}</p>
                  <button type="button" className="btn btn--primary btn--sm" onClick={resetFilters}>
                    {t('marketplace.resetFilters')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile Filter Drawer ────────────────────────────── */}
      {drawerOpen && (
        <div
          className="mkt-drawer-backdrop"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        id={`filter-drawer-${variant}`}
        className={`mkt-drawer${drawerOpen ? ' mkt-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('marketplace.filtersTitle')}
        aria-hidden={!drawerOpen}
      >
        <div className="mkt-drawer__head">
          <h2>{t('marketplace.filtersTitle')}</h2>
          <button
            type="button"
            className="mkt-drawer__close"
            onClick={() => setDrawerOpen(false)}
            aria-label={t('marketplace.closeFilters')}
          >
            {t('marketplace.closeFilters')}
          </button>
        </div>
        <div className="mkt-drawer__body">
          <FilterControls
            categories={categories}
            priceRanges={priceRanges}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
            selectedQty={selectedQty}
            onSelectQty={setSelectedQty}
            onReset={resetFilters}
            hasActiveFilters={activeFilterCount > 0 || sortBy !== 'default'}
            idPrefix={`mobile-${variant}`}
          />
        </div>
        <div className="mkt-drawer__foot">
          <button
            type="button"
            className="btn btn--primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setDrawerOpen(false)}
          >
            {t('marketplace.showPrefix')} {filteredProducts.length} {t('marketplace.resultsWord')}
          </button>
        </div>
      </div>
    </div>
  );
}
