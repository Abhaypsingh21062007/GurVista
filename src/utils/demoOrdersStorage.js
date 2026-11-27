/* ============================================================
   GURVISTA — Demonstration Orders & Quotes (localStorage)
   Simulated persistence for demo bulk orders, quote requests,
   and 5-stage tracking. No real payments or logistics.
   ============================================================ */

export const ORDERS_STORAGE_KEY = 'gurvista_demo_orders_v1';
export const QUOTES_STORAGE_KEY = 'gurvista_demo_quotes_v1';

export const PLATFORM_FEE_RATE = 0.02;

export const ORDER_STAGES = [
  'Order Placed',
  'Quality Check',
  'Payment Confirmed',
  'Dispatched',
  'Delivered',
];

export const DEMO_DISCLAIMER =
  'Simulated demonstration system: orders, proposed 2% platform fees, quote requests, and tracking stages are stored locally in your browser without real payments or logistics.';

function safeReadArray(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteArray(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Compute subtotal, proposed 2% platform fee, and final amount.
 */
export function calculateOrderTotals(quantity, pricePerQuintal) {
  const safeQty = Number.isFinite(Number(quantity)) ? Math.max(0, Number(quantity)) : 0;
  const subtotal = Math.round(safeQty * pricePerQuintal);
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const finalAmount = subtotal + platformFee;
  return {
    quantity: safeQty,
    pricePerQuintal,
    subtotal,
    platformFee,
    finalAmount,
  };
}

export function getDemoOrders() {
  return safeReadArray(ORDERS_STORAGE_KEY);
}

export function saveDemoOrder(orderPayload) {
  const existing = getDemoOrders();
  const id = `GV-DEMO-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  const newOrder = {
    ...orderPayload,
    id,
    createdAt: now,
    stageIndex: 0,
    stageHistory: [{ stage: ORDER_STAGES[0], timestamp: now }],
    isSimulated: true,
  };

  safeWriteArray(ORDERS_STORAGE_KEY, [newOrder, ...existing]);
  return newOrder;
}

export function advanceDemoOrderStage(orderId) {
  const existing = getDemoOrders();
  const now = new Date().toISOString();

  const updated = existing.map((order) => {
    if (order.id !== orderId) return order;
    const nextIdx = Math.min((order.stageIndex ?? 0) + 1, ORDER_STAGES.length - 1);
    if (nextIdx === order.stageIndex) return order;
    const history = Array.isArray(order.stageHistory) ? order.stageHistory : [];
    return {
      ...order,
      stageIndex: nextIdx,
      stageHistory: [...history, { stage: ORDER_STAGES[nextIdx], timestamp: now }],
    };
  });

  safeWriteArray(ORDERS_STORAGE_KEY, updated);
  return updated.find((o) => o.id === orderId) || null;
}

export function getDemoQuotes() {
  return safeReadArray(QUOTES_STORAGE_KEY);
}

export function saveDemoQuote(quotePayload) {
  const existing = getDemoQuotes();
  const id = `GV-QUOTE-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  const newQuote = {
    ...quotePayload,
    id,
    createdAt: now,
    status: 'Simulated Request Logged',
    isSimulated: true,
  };

  safeWriteArray(QUOTES_STORAGE_KEY, [newQuote, ...existing]);
  return newQuote;
}

/**
 * Remaining available stock for a product after subtracting any
 * previously placed demonstration orders stored in localStorage.
 */
export function getRemainingDemoStock(productId, baseStock) {
  const orders = getDemoOrders();
  const reserved = orders
    .filter((o) => o.productId === productId)
    .reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);
  return Math.max(0, baseStock - reserved);
}

export function clearDemoHistory() {
  try {
    window.localStorage.removeItem(ORDERS_STORAGE_KEY);
    window.localStorage.removeItem(QUOTES_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}
