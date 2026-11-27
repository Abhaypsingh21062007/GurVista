import { useMemo } from 'react';
import MarketplaceShell from '../components/marketplace/MarketplaceShell';
import {
  MARKETPLACE_PRODUCTS,
  JAGGERY_CATEGORIES,
  JAGGERY_PRICE_RANGES,
} from '../data/marketplaceData';
import { getAllSellerProducts } from '../utils/sellerProductStorage';
import { useLanguage } from '../context/useLanguage';

export default function JaggeryMarketplace() {
  const { t } = useLanguage();

  const products = useMemo(() => {
    const base = MARKETPLACE_PRODUCTS.filter((p) => p.marketplace === 'jaggery');
    const seller = getAllSellerProducts().filter((p) => p.marketplace === 'jaggery');
    return [...base, ...seller];
  }, []);

  return (
    <MarketplaceShell
      variant="jaggery"
      eyebrow={t('marketplace.jaggeryEyebrow')}
      title={t('marketplace.jaggeryTitle')}
      subtitle={t('marketplace.jaggerySubtitle')}
      products={products}
      categories={JAGGERY_CATEGORIES}
      priceRanges={JAGGERY_PRICE_RANGES}
    />
  );
}
