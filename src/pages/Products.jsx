import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketplaceShell from '../components/marketplace/MarketplaceShell';
import {
  MARKETPLACE_PRODUCTS,
  ALL_CATEGORIES,
  ALL_PRICE_RANGES,
  JAGGERY_CATEGORIES,
  JAGGERY_PRICE_RANGES,
  BAGASSE_CATEGORIES,
  BAGASSE_PRICE_RANGES,
} from '../data/marketplaceData';
import { getAllSellerProducts } from '../utils/sellerProductStorage';
import { useLanguage } from '../context/useLanguage';

export default function Products() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const catParam = (searchParams.get('cat') || '').toLowerCase();

  const allMerged = useMemo(
    () => [...MARKETPLACE_PRODUCTS, ...getAllSellerProducts()],
    []
  );

  if (catParam === 'jaggery') {
    const jaggeryProducts = allMerged.filter((p) => p.marketplace === 'jaggery');
    return (
      <MarketplaceShell
        key="jaggery"
        variant="jaggery"
        eyebrow={t('marketplace.jaggeryEyebrow')}
        title={t('marketplace.jaggeryTitle')}
        subtitle={t('marketplace.jaggerySubtitle')}
        products={jaggeryProducts}
        categories={JAGGERY_CATEGORIES}
        priceRanges={JAGGERY_PRICE_RANGES}
      />
    );
  }

  if (catParam === 'bagasse') {
    const bagasseProducts = allMerged.filter((p) => p.marketplace === 'bagasse');
    return (
      <MarketplaceShell
        key="bagasse"
        variant="bagasse"
        eyebrow={t('marketplace.bagasseEyebrow')}
        title={t('marketplace.bagasseTitle')}
        subtitle={t('marketplace.bagasseSubtitle')}
        products={bagasseProducts}
        categories={BAGASSE_CATEGORIES}
        priceRanges={BAGASSE_PRICE_RANGES}
      />
    );
  }

  return (
    <MarketplaceShell
      key="all"
      variant="jaggery"
      eyebrow={t('marketplace.allEyebrow')}
      title={t('marketplace.allTitle')}
      subtitle={t('marketplace.allSubtitle')}
      products={allMerged}
      categories={ALL_CATEGORIES}
      priceRanges={ALL_PRICE_RANGES}
    />
  );
}
