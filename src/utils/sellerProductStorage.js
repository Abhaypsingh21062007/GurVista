import defaultJaggeryImg from '../assets/images/khurpa-gur-dhep.jpg';
import defaultPowderImg from '../assets/images/jaggery-powder.jpg';
import defaultLadduImg from '../assets/images/jaggery-block-closeup.jpg';
import defaultKhurpaImg from '../assets/images/jaggery-blocks-punjab.jpg';
import defaultBagasseImg from '../assets/images/bagasse-closeup.jpg';
import defaultDriedBagasseImg from '../assets/images/bagasse-residue.jpg';
import defaultIndustrialBagasseImg from '../assets/images/bagasse-mill.jpg';

/* ============================================================
   Gurvista — Seller Product Listings (localStorage)
   Products added by sellers are stored here and merged into
   the marketplace alongside the base sample listings.
   ============================================================ */

const KEY = 'gurvista_seller_products';

export const PRODUCT_CATEGORIES = [
  'Chaku Gur',
  'Laddu Gur',
  'Khurpa Gur',
  'Jaggery Powder',
  'Raw Bagasse',
  'Dried Bagasse',
  'Industrial-Grade Bagasse',
];

export function marketplaceFromCategory(category) {
  const bagasseCategories = ['Raw Bagasse', 'Dried Bagasse', 'Industrial-Grade Bagasse'];
  return bagasseCategories.includes(category) ? 'bagasse' : 'jaggery';
}

export function defaultImageForCategory(category) {
  switch (category) {
    case 'Jaggery Powder':
      return defaultPowderImg;
    case 'Laddu Gur':
      return defaultLadduImg;
    case 'Khurpa Gur':
      return defaultKhurpaImg;
    case 'Raw Bagasse':
      return defaultBagasseImg;
    case 'Dried Bagasse':
      return defaultDriedBagasseImg;
    case 'Industrial-Grade Bagasse':
      return defaultIndustrialBagasseImg;
    case 'Chaku Gur':
    default:
      return defaultJaggeryImg;
  }
}

function normalizeSellerProduct(raw) {
  const marketplace = raw.marketplace || marketplaceFromCategory(raw.category);
  const image = raw.imageUrl?.trim() || raw.image || defaultImageForCategory(raw.category);
  const supplier = raw.supplier || raw.sellerName || 'Partner Producer';
  return {
    ...raw,
    marketplace,
    image,
    imageAlt: raw.imageAlt || `${raw.name} — ${supplier}`,
    supplier,
    packaging:
      raw.packaging ||
      (marketplace === 'bagasse'
        ? 'Bulk / baled industrial supply'
        : '25 kg / 50 kg food-grade sacks'),
    isSellerListing: true,
    isSample: false,
  };
}

export function getAllSellerProducts() {
  try {
    const stored = localStorage.getItem(KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeSellerProduct) : [];
  } catch {
    return [];
  }
}

export function getSellerProducts(sellerId) {
  return getAllSellerProducts().filter((p) => p.sellerId === sellerId);
}

function saveAll(products) {
  localStorage.setItem(KEY, JSON.stringify(products));
}

/**
 * Add a new product listing.
 * @param {object} product - product fields from the seller's form
 * @returns {object} the saved product with generated id
 */
export function addSellerProduct(product) {
  const all = getAllSellerProducts();
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const newProduct = normalizeSellerProduct({
    ...product,
    id: `sp-${Date.now()}-${slug || 'listing'}`,
    createdAt: new Date().toISOString(),
  });
  saveAll([newProduct, ...all]);
  return newProduct;
}

/**
 * Update an existing product listing.
 * @param {string} id
 * @param {object} updates
 */
export function updateSellerProduct(id, updates) {
  const all = getAllSellerProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const merged = {
    ...all[idx],
    ...updates,
    // Recompute image from updated imageUrl/category if changed
    image: updates.imageUrl !== undefined
      ? (updates.imageUrl.trim() || defaultImageForCategory(updates.category || all[idx].category))
      : all[idx].image,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = normalizeSellerProduct(merged);
  saveAll(all);
  return all[idx];
}

/**
 * Delete a product listing by id.
 */
export function deleteSellerProduct(id) {
  const filtered = getAllSellerProducts().filter((p) => p.id !== id);
  saveAll(filtered);
  return true;
}
