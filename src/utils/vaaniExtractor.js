/**
 * vaaniExtractor.js — Rule-based Hindi speech-to-product-data extraction.
 * No external dependencies. No API calls. Pure JS.
 *
 * Extracts: name, category, pricePerQuintal, availableStock,
 *           minOrderQuintals, location, description
 * from a natural Hindi transcript like:
 *   "मेरे पास 50 क्विंटल चाकू गुड़ है। भाव 4200 रुपये प्रति क्विंटल है।"
 */

import { PRODUCT_CATEGORIES } from './sellerProductStorage';

/* ── Hindi word-to-digit map ─────────────────────────────── */
const HINDI_DIGIT_WORDS = {
  'शून्य': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4,
  'पाँच': 5, 'पांच': 5, 'छः': 6, 'छह': 6, 'सात': 7,
  'आठ': 8, 'नौ': 9, 'दस': 10, 'ग्यारह': 11, 'बारह': 12,
  'तेरह': 13, 'चौदह': 14, 'पन्द्रह': 15, 'पंद्रह': 15,
  'सोलह': 16, 'सत्रह': 17, 'अट्ठारह': 18, 'उन्नीस': 19,
  'बीस': 20, 'तीस': 30, 'चालीस': 40, 'पचास': 50,
  'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
  'सौ': 100, 'हज़ार': 1000, 'हजार': 1000,
  'लाख': 100000, 'करोड़': 10000000,
};

/** Convert a simple Hindi number phrase to a JS number, or return null. */
function hindiWordToNumber(text) {
  let result = 0;
  let current = 0;
  const words = text.trim().split(/\s+/);
  for (const word of words) {
    const val = HINDI_DIGIT_WORDS[word];
    if (val === undefined) return null;
    if (val === 100) {
      current = current === 0 ? 100 : current * 100;
    } else if (val >= 1000) {
      result += (current === 0 ? 1 : current) * val;
      current = 0;
    } else {
      current += val;
    }
  }
  return result + current || null;
}

/** Remove commas from number strings like "4,200" → 4200. */
function parseNumber(str) {
  if (!str) return null;
  const clean = str.replace(/,/g, '');
  const n = Number(clean);
  return isNaN(n) ? null : n;
}

/* ── Category detection ──────────────────────────────────── */
const CATEGORY_PATTERNS = [
  // Most specific first
  { pattern: /चाकू\s*गुड़|chaku\s*gur/i,       category: 'Chaku Gur' },
  { pattern: /लड्डू\s*गुड़|laddu\s*gur/i,       category: 'Laddu Gur' },
  { pattern: /खुरपा\s*गुड़|khurpa\s*gur/i,      category: 'Khurpa Gur' },
  { pattern: /गुड़\s*पाउडर|jaggery\s*powder/i,  category: 'Jaggery Powder' },
  { pattern: /सूखी\s*खोई|dried\s*bagasse/i,     category: 'Dried Bagasse' },
  { pattern: /औद्योगिक\s*बगास|industrial.*bagasse/i, category: 'Industrial-Grade Bagasse' },
  { pattern: /कच्ची\s*खोई|raw\s*bagasse/i,      category: 'Raw Bagasse' },
  { pattern: /खोई|बगास|bagasse/i,               category: 'Raw Bagasse' },
  { pattern: /गुड़|jaggery|gur/i,               category: 'Chaku Gur' }, // generic fallback
];

function detectCategory(text) {
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category;
  }
  return '';
}

/* ── Quantity extraction ─────────────────────────────────── */
const UNIT_ALIASES = {
  'क्विंटल': 'quintal', 'quintal': 'quintal', 'qtl': 'quintal',
  'किलो': 'kg', 'किलोग्राम': 'kg', 'kg': 'kg',
  'टन': 'ton', 'ton': 'ton',
};

// Matches: "50 क्विंटल", "50 quintal", "पचास क्विंटल"
const QTY_NUM_PATTERN = /(\d[\d,]*)\s*(क्विंटल|किलो|किलोग्राम|टन|quintal|qtl|kg|ton)/gi;

function extractQuantity(text) {
  let match;
  while ((match = QTY_NUM_PATTERN.exec(text)) !== null) {
    const num = parseNumber(match[1]);
    if (num !== null && num > 0) {
      return { qty: num, unit: UNIT_ALIASES[match[2].toLowerCase()] || 'quintal' };
    }
  }

  // Try Hindi word numbers before unit
  const hindiQtyPattern = /((?:(?:शून्य|एक|दो|तीन|चार|पाँच|पांच|छः|छह|सात|आठ|नौ|दस|ग्यारह|बारह|तेरह|चौदह|पन्द्रह|पंद्रह|सोलह|सत्रह|अट्ठारह|उन्नीस|बीस|तीस|चालीस|पचास|साठ|सत्तर|अस्सी|नब्बे|सौ|हज़ार|हजार|लाख)\s*)+)(क्विंटल|किलो|किलोग्राम|टन)/g;
  const hindiMatch = hindiQtyPattern.exec(text);
  if (hindiMatch) {
    const num = hindiWordToNumber(hindiMatch[1]);
    if (num !== null) {
      return { qty: num, unit: UNIT_ALIASES[hindiMatch[3]] || 'quintal' };
    }
  }

  return null;
}

/* ── Price extraction ────────────────────────────────────── */
// Matches: "4200 रुपये", "₹4200", "4,200 रुपये प्रति क्विंटल"
const PRICE_PATTERN = /(?:₹\s*)?(\d[\d,]*)\s*(रुपये|rupee|rupees|₹)/i;
const PRICE_PATTERN_ALT = /(?:भाव|मूल्य|दाम|rate|price)[^\d₹]*(?:₹\s*)?(\d[\d,]*)/i;

function extractPrice(text) {
  let match = PRICE_PATTERN.exec(text);
  if (match) return parseNumber(match[1]);
  match = PRICE_PATTERN_ALT.exec(text);
  if (match) return parseNumber(match[1]);
  return null;
}

/* ── Location extraction ─────────────────────────────────── */
// Known UP jaggery belt cities + generic "X में है / X से हूँ"
const KNOWN_LOCATIONS = [
  'मुज़फ्फरनगर', 'muzaffarnagar', 'मेरठ', 'meerut',
  'शामली', 'shamli', 'बागपत', 'baghpat',
  'सहारनपुर', 'saharanpur', 'हापुड़', 'hapur',
  'अमरोहा', 'amroha', 'बिजनौर', 'bijnor',
  'मुरादाबाद', 'moradabad', 'रामपुर', 'rampur',
  'बुलंदशहर', 'bulandshahr', 'अलीगढ़', 'aligarh',
  'आगरा', 'agra', 'लखनऊ', 'lucknow',
  'गाजियाबाद', 'ghaziabad', 'नोएडा', 'noida',
  'कानपुर', 'kanpur', 'वाराणसी', 'varanasi',
  'प्रयागराज', 'prayagraj',
];

function extractLocation(text) {
  // Named locations
  for (const loc of KNOWN_LOCATIONS) {
    if (text.toLowerCase().includes(loc.toLowerCase())) {
      // Return the Hindi name preferably
      const idx = text.toLowerCase().indexOf(loc.toLowerCase());
      return text.substring(idx, idx + loc.length);
    }
  }

  // Generic "X में है", "X में कारखाना है", "X से हूँ"
  const locPattern = /([\u0900-\u097F\w]+(?:\s+[\u0900-\u097F\w]+)*)\s+(?:में|से)\s+(?:है|हूँ|हू|हूं|हमारा|मेरा|कारखाना)/;
  const m = locPattern.exec(text);
  if (m) {
    const candidate = m[1].trim();
    // Filter out product words that could match
    const skipWords = ['यह', 'वह', 'इसका', 'मेरे', 'हमारे', 'यहाँ', 'वहाँ'];
    if (!skipWords.includes(candidate)) return candidate;
  }

  return '';
}

/* ── Main extractor ──────────────────────────────────────── */
/**
 * @param {string} transcript - Raw Hindi speech transcript
 * @returns {Partial<{name, category, pricePerQuintal, availableStock, minOrderQuintals, location, description}>}
 */
export function extractProductFromTranscript(transcript) {
  if (!transcript || !transcript.trim()) return {};

  const text = transcript.trim();
  const result = {};

  // Category + name
  const category = detectCategory(text);
  if (category) {
    result.category = category;
    result.name = category; // Default name = category; seller can refine
  }

  // Quantity → availableStock (convert to quintals)
  const qtyResult = extractQuantity(text);
  if (qtyResult) {
    let stock = qtyResult.qty;
    if (qtyResult.unit === 'ton') stock = stock * 10;      // 1 ton = 10 quintals
    if (qtyResult.unit === 'kg')  stock = stock / 100;     // 1 quintal = 100 kg
    result.availableStock = String(Math.round(stock * 100) / 100);
    // Default min order = 10% of stock, min 5
    result.minOrderQuintals = String(Math.max(5, Math.round(stock * 0.1)));
  }

  // Price
  const price = extractPrice(text);
  if (price) result.pricePerQuintal = String(price);

  // Location
  const location = extractLocation(text);
  if (location) result.location = location;

  // Description — use the full transcript as a starting description
  if (text.length > 10) {
    result.description = text.length > 300 ? text.substring(0, 300) + '…' : text;
  }

  return result;
}

/** Convenience: check if extraction produced any useful data */
export function hasUsefulExtraction(extracted) {
  return !!(extracted.category || extracted.pricePerQuintal || extracted.availableStock || extracted.location);
}
