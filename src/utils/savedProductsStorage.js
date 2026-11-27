/* ============================================================
   Gurvista — Saved Products (Buyer Wishlist)
   Per-user saved product IDs stored in localStorage.
   ============================================================ */

function key(userId) {
  return `gurvista_saved_${userId}`;
}

export function getSavedProductIds(userId) {
  try {
    const stored = localStorage.getItem(key(userId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveProduct(userId, productId) {
  const ids = getSavedProductIds(userId);
  if (!ids.includes(productId)) {
    localStorage.setItem(key(userId), JSON.stringify([...ids, productId]));
  }
}

export function unsaveProduct(userId, productId) {
  const ids = getSavedProductIds(userId).filter((id) => id !== productId);
  localStorage.setItem(key(userId), JSON.stringify(ids));
}

export function isProductSaved(userId, productId) {
  return getSavedProductIds(userId).includes(productId);
}
