import { useMemo } from 'react';
import MarketplaceShell from '../components/marketplace/MarketplaceShell';
import {
  MARKETPLACE_PRODUCTS,
  BAGASSE_CATEGORIES,
  BAGASSE_PRICE_RANGES,
} from '../data/marketplaceData';
import { getAllSellerProducts } from '../utils/sellerProductStorage';
import { useLanguage } from '../context/useLanguage';

const B2B_SPECS_BAR_BY_LANG = {
  en: [
    { label: 'Supply Forms', value: 'Loose, Semi-Baled & Strapped Bales' },
    { label: 'Moisture Bands', value: '10%–18% Dried · 45%–52% Raw' },
    { label: 'Buyer Applications', value: 'Paper Pulp, Biofuel, Boilers & Packaging' },
    { label: 'Pricing Basis', value: 'Ex-Mill / Ex-Yard per Quintal' },
  ],
  hi: [
    { label: 'सप्लाई रूप', value: 'खुली, अर्ध-गठरी और बंधी गांठें' },
    { label: 'नमी सीमा', value: '10%–18% सूखी · 45%–52% कच्ची' },
    { label: 'उपयोग क्षेत्र', value: 'पेपर पल्प, बायोफ्यूल, बॉयलर व पैकेजिंग' },
    { label: 'भाव आधार', value: 'एक्स-मिल / एक्स-यार्ड प्रति क्विंटल' },
  ],
};

export default function BagasseMarketplace() {
  const { lang, t } = useLanguage();

  const products = useMemo(() => {
    const base = MARKETPLACE_PRODUCTS.filter((p) => p.marketplace === 'bagasse');
    const seller = getAllSellerProducts().filter((p) => p.marketplace === 'bagasse');
    return [...base, ...seller];
  }, []);

  return (
    <MarketplaceShell
      variant="bagasse"
      eyebrow={t('marketplace.bagasseEyebrow')}
      title={t('marketplace.bagasseTitle')}
      subtitle={t('marketplace.bagasseSubtitle')}
      products={products}
      categories={BAGASSE_CATEGORIES}
      priceRanges={BAGASSE_PRICE_RANGES}
      b2bSpecsBar={B2B_SPECS_BAR_BY_LANG[lang] || B2B_SPECS_BAR_BY_LANG.en}
    />
  );
}
