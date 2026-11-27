import chakuGurImg from '../assets/images/khurpa-gur-dhep.jpg';
import jaggeryPowderImg from '../assets/images/jaggery-powder.jpg';
import ladduGurImg from '../assets/images/jaggery-block-closeup.jpg';
import khurpaGurImg from '../assets/images/jaggery-blocks-punjab.jpg';
import jaggeryMakingImg from '../assets/images/jaggery-producer-2.jpg';
import bagasseCloseupImg from '../assets/images/bagasse-closeup.jpg';
import sugarcaneFieldImg from '../assets/images/sugarcane-field-up.jpg';
import bagasseResidueImg from '../assets/images/bagasse-residue.jpg';
import bagasseLoadingImg from '../assets/images/bagasse-loading.jpg';
import bagasseMillImg from '../assets/images/bagasse-mill.jpg';

/* ============================================================
   GURVISTA — Centralised Sample Marketplace Data
   All listings, suppliers, stock figures and prices below are
   illustrative sample data for demonstration purposes.
   ============================================================ */

export const SAMPLE_NOTICE =
  'Sample marketplace listings: producer names, stock levels and per-quintal prices are indicative figures for demonstration.';

export const MARKETPLACE_PRODUCTS = [
  /* ── JAGGERY LISTINGS ────────────────────────────────────── */
  {
    id: 'chaku-gur',
    marketplace: 'jaggery',
    category: 'Chaku Gur',
    name: 'Chaku Gur',
    nameHi: 'चाकू गुड़',
    supplier: 'Ram Prakash Kolhu',
    location: 'Shahpur, Muzaffarnagar',
    pricePerQuintal: 4200,
    availableStock: 85,
    minOrderQuintals: 5,
    packaging: '25 kg & 50 kg food-grade gunny / poly-lined sacks',
    image: chakuGurImg,
    imageAlt: 'Traditional Chaku Gur blocks stacked after setting',
    description:
      'Classic golden-amber slab jaggery cut cleanly by knife after shallow-pan evaporation. Prepared using single-boil sugarcane juice without chemical bleaches.',
    specs: {
      Form: 'Hand-cut rectangular slabs (1–2 kg)',
      Preparation: 'Single-boil open iron pan',
      'Crop Season': 'Current crushing season',
      Packaging: '25 kg / 50 kg lined sacks',
    },
    isSample: true,
  },
  {
    id: 'jaggery-powder',
    marketplace: 'jaggery',
    category: 'Jaggery Powder',
    name: 'Jaggery Powder',
    nameHi: 'गुड़ पाउडर',
    supplier: 'Aggarwal Shakkar Mill',
    location: 'Muzaffarnagar City',
    pricePerQuintal: 5200,
    availableStock: 120,
    minOrderQuintals: 2,
    packaging: '25 kg moisture-barrier PP bags',
    image: jaggeryPowderImg,
    imageAlt: 'Fine golden natural cane jaggery powder',
    description:
      'Uniform, free-flowing granular shakkar dried and sieved for retail packing, bakeries, beverage blenders and commercial kitchens.',
    specs: {
      Form: 'Fine free-flowing powder (sieved)',
      Preparation: 'Sun-cured & mechanically sieved',
      'Crop Season': 'Current crushing season',
      Packaging: '25 kg moisture-sealed bags',
    },
    isSample: true,
  },
  {
    id: 'laddu-gur',
    marketplace: 'jaggery',
    category: 'Laddu Gur',
    name: 'Laddu Gur',
    nameHi: 'लड्डू गुड़',
    supplier: 'Devi Shakkar Udyog',
    location: 'Budhana, Muzaffarnagar',
    pricePerQuintal: 4500,
    availableStock: 60,
    minOrderQuintals: 5,
    packaging: '20 kg corrugated cartons / 40 kg sacks',
    image: ladduGurImg,
    imageAlt: 'Round hand-moulded Laddu Gur sphere',
    description:
      'Smooth, dense round portions shaped while warm. Popular with regional sweetmeat makers, wholesale grocers and festive food suppliers.',
    specs: {
      Form: 'Round hand-shaped lumps (250–500 g)',
      Preparation: 'Clarified cane juice reduction',
      'Crop Season': 'Current crushing season',
      Packaging: '20 kg cartons / 40 kg sacks',
    },
    isSample: true,
  },
  {
    id: 'khurpa-gur',
    marketplace: 'jaggery',
    category: 'Khurpa Gur',
    name: 'Khurpa Gur',
    nameHi: 'खुरपा गुड़',
    supplier: 'Chaudhary Cane Works',
    location: 'Titawi, Muzaffarnagar',
    pricePerQuintal: 3900,
    availableStock: 210,
    minOrderQuintals: 10,
    packaging: '50 kg woven jute sacks',
    image: khurpaGurImg,
    imageAlt: 'Traditional golden Khurpa Gur blocks piled with jute sacks',
    description:
      'Firm-set, dark-bodied traditional gur suited for bulk storage, regional wholesale distribution and industrial food formulation.',
    specs: {
      Form: 'Dense firm blocks',
      Preparation: 'Extended iron-karahi reduction',
      'Crop Season': 'Current crushing season',
      Packaging: '50 kg jute sacks',
    },
    isSample: true,
  },
  {
    id: 'chaku-gur-bulk',
    marketplace: 'jaggery',
    category: 'Chaku Gur',
    name: 'Chaku Gur — Wholesale Lot',
    nameHi: 'चाकू गुड़ (थोक)',
    supplier: 'Kisan Gramodyog Kendra',
    location: 'Khatauli, Muzaffarnagar',
    pricePerQuintal: 4350,
    availableStock: 280,
    minOrderQuintals: 20,
    packaging: '50 kg double-lined sacks',
    image: jaggeryMakingImg,
    imageAlt: 'Traditional kolhu pan pouring fresh sugarcane jaggery batch',
    description:
      'Consistent-colour Chaku Gur lots aggregated directly from partner kolhus for mandi distributors and packaged food brands.',
    specs: {
      Form: 'Uniform 1 kg slabs',
      Preparation: 'Single-boil, natural vegetable clarifier',
      'Crop Season': 'Current crushing season',
      Packaging: '50 kg double-lined sacks',
    },
    isSample: true,
  },
  {
    id: 'jaggery-powder-coarse',
    marketplace: 'jaggery',
    category: 'Jaggery Powder',
    name: 'Jaggery Powder — Coarse Granule',
    nameHi: 'दानेदार गुड़ पाउडर',
    supplier: 'Bharadwaj Sugar & Gur',
    location: 'Kairana Road, Muzaffarnagar',
    pricePerQuintal: 5450,
    availableStock: 45,
    minOrderQuintals: 2,
    packaging: '25 kg kraft-lined bags',
    image: jaggeryPowderImg,
    imageAlt: 'Coarse golden granular jaggery powder texture',
    description:
      'Coarse-crystal natural cane powder with rich caramel aroma, prepared in small batches for specialty food retail.',
    specs: {
      Form: 'Coarse free-flowing granules',
      Preparation: 'Slow-cooled & screened',
      'Crop Season': 'Current crushing season',
      Packaging: '25 kg kraft-lined bags',
    },
    isSample: true,
  },

  /* ── BAGASSE LISTINGS ────────────────────────────────────── */
  {
    id: 'raw-mill-bagasse',
    marketplace: 'bagasse',
    category: 'Raw Bagasse',
    name: 'Raw Mill-Run Bagasse',
    supplier: 'Meerut Road Agri Co.',
    location: 'Jansath, Muzaffarnagar',
    pricePerQuintal: 240,
    availableStock: 1200,
    minOrderQuintals: 100,
    packaging: 'Loose tipper / open truck load',
    image: bagasseCloseupImg,
    imageAlt: 'Crushed fibrous raw sugarcane bagasse after juice extraction',
    description:
      'Freshly discharged fibrous residue directly off cane crushers. Suitable for nearby cogeneration boilers, composting units and mushroom substrate processors.',
    specs: {
      Grade: 'Raw Mill-Run (Unscreened)',
      Moisture: '45% – 50% (indicative)',
      'Supply Format': 'Loose bulk truckload',
      'Dispatch Window': 'Same-week ex-mill loading',
    },
    isSample: true,
  },
  {
    id: 'fresh-crush-bagasse',
    marketplace: 'bagasse',
    category: 'Raw Bagasse',
    name: 'Fresh Crush Cane Bagasse',
    supplier: 'Doab Cane Crushers',
    location: 'Shamli Road, Muzaffarnagar',
    pricePerQuintal: 210,
    availableStock: 850,
    minOrderQuintals: 100,
    packaging: 'Loose bulk / tractor-trolley or truck',
    image: sugarcaneFieldImg,
    imageAlt: 'Harvested Uttar Pradesh sugarcane stalks ready for crushing',
    description:
      'High-volume raw bagasse available throughout peak crushing months for brick kilns, biomass aggregators and organic manure facilities.',
    specs: {
      Grade: 'Raw Crusher Output',
      Moisture: '48% – 52% (indicative)',
      'Supply Format': 'Loose bulk',
      'Dispatch Window': 'Scheduled daily pickup',
    },
    isSample: true,
  },
  {
    id: 'sun-dried-bagasse',
    marketplace: 'bagasse',
    category: 'Dried Bagasse',
    name: 'Dried Fibrous Bagasse — Loose & Semi-Baled',
    supplier: 'Upper Ganga Biomass',
    location: 'Mansurpur, Muzaffarnagar',
    pricePerQuintal: 320,
    availableStock: 600,
    minOrderQuintals: 50,
    packaging: 'Twine-tied bundles / tarpaulin truck',
    image: bagasseResidueImg,
    imageAlt: 'Sun-dried sugarcane residue and fibrous stalks',
    description:
      'Open-yard sun-dried bagasse with reduced moisture for higher calorific efficiency in industrial boilers and livestock roughage blends.',
    specs: {
      Grade: 'Sun-Dried Standard',
      Moisture: '18% – 22% (indicative)',
      'Supply Format': 'Semi-baled bundles',
      'Dispatch Window': '3–5 business days ex-yard',
    },
    isSample: true,
  },
  {
    id: 'boiler-fuel-dried-bagasse',
    marketplace: 'bagasse',
    category: 'Dried Bagasse',
    name: 'Low-Moisture Boiler-Grade Dried Bagasse',
    supplier: 'Rohana Agro Fuels',
    location: 'Rohana Kalan, Muzaffarnagar',
    pricePerQuintal: 350,
    availableStock: 420,
    minOrderQuintals: 50,
    packaging: 'Strapped 250 kg bales',
    image: bagasseLoadingImg,
    imageAlt: 'Bulk dried bagasse stock pile and industrial loader',
    description:
      'Uniformly dried and wire-strapped bales engineered for long-haul freight to paper mills, textile boilers and briquette plants.',
    specs: {
      Grade: 'Dried Boiler Grade',
      Moisture: '14% – 18% (indicative)',
      'Supply Format': 'Compressed ~250 kg bales',
      'Dispatch Window': '2–4 business days ex-yard',
    },
    isSample: true,
  },
  {
    id: 'industrial-depithed-bagasse',
    marketplace: 'bagasse',
    category: 'Industrial-Grade Bagasse',
    name: 'Industrial-Grade Depithed Bagasse',
    supplier: 'Muzaffarnagar Fibre & Pulp',
    location: 'Bhopa Road, Muzaffarnagar',
    pricePerQuintal: 390,
    availableStock: 500,
    minOrderQuintals: 100,
    packaging: 'High-density strapped bales (300 kg)',
    image: bagasseMillImg,
    imageAlt: 'Industrial bagasse handling with wheel loader at mill yard',
    description:
      'Screened and depithed sugarcane fibre tailored for kraft paper manufacturing, moulded biodegradable tableware and particleboard units.',
    specs: {
      Grade: 'Depithed Industrial Fibre',
      Moisture: '12% – 16% (indicative)',
      'Supply Format': 'High-density 300 kg bales',
      'Dispatch Window': 'Scheduled contract lots',
    },
    isSample: true,
  },
  {
    id: 'industrial-briquette-bagasse',
    marketplace: 'bagasse',
    category: 'Industrial-Grade Bagasse',
    name: 'Industrial-Grade Compressed Bagasse Bales',
    supplier: 'Vindhya Bio-Residue Works',
    location: 'Khatauli Industrial Area, Muzaffarnagar',
    pricePerQuintal: 430,
    availableStock: 340,
    minOrderQuintals: 50,
    packaging: 'Palletised / strapped 350 kg industrial bales',
    image: bagasseLoadingImg,
    imageAlt: 'Industrial-scale bagasse yard loading for bulk mill dispatch',
    description:
      'High-density screened bagasse compressed for optimal container and trailer payload efficiency in pulp, packaging and bio-energy plants.',
    specs: {
      Grade: 'High-Density Industrial Bale',
      Moisture: '10% – 14% (indicative)',
      'Supply Format': 'Strapped 350 kg bales',
      'Dispatch Window': '48–72 hours ex-plant',
    },
    isSample: true,
  },
];

export const JAGGERY_CATEGORIES = [
  'All',
  'Chaku Gur',
  'Jaggery Powder',
  'Laddu Gur',
  'Khurpa Gur',
];

export const BAGASSE_CATEGORIES = [
  'All',
  'Raw Bagasse',
  'Dried Bagasse',
  'Industrial-Grade Bagasse',
];

export const ALL_CATEGORIES = [
  'All',
  'Chaku Gur',
  'Jaggery Powder',
  'Laddu Gur',
  'Khurpa Gur',
  'Raw Bagasse',
  'Dried Bagasse',
  'Industrial-Grade Bagasse',
];

export const JAGGERY_PRICE_RANGES = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: 'under-4300', label: 'Up to ₹4,300 / qtl', min: 0, max: 4300 },
  { id: '4300-5000', label: '₹4,300 – ₹5,000 / qtl', min: 4300, max: 5000 },
  { id: 'above-5000', label: 'Above ₹5,000 / qtl', min: 5001, max: Infinity },
];

export const BAGASSE_PRICE_RANGES = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: 'under-260', label: 'Up to ₹260 / qtl', min: 0, max: 260 },
  { id: '260-360', label: '₹260 – ₹360 / qtl', min: 260, max: 360 },
  { id: 'above-360', label: 'Above ₹360 / qtl', min: 361, max: Infinity },
];

export const ALL_PRICE_RANGES = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: 'under-500', label: 'Under ₹500 / qtl (Bagasse)', min: 0, max: 500 },
  { id: '3500-4500', label: '₹3,500 – ₹4,500 / qtl', min: 3500, max: 4500 },
  { id: 'above-4500', label: 'Above ₹4,500 / qtl', min: 4501, max: Infinity },
];

export const QUANTITY_FILTERS = [
  { id: 'any', label: 'Any stock', minStock: 0 },
  { id: '50', label: '50+ quintals', minStock: 50 },
  { id: '100', label: '100+ quintals', minStock: 100 },
  { id: '250', label: '250+ quintals', minStock: 250 },
  { id: '500', label: '500+ quintals', minStock: 500 },
];

export function formatINR(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}
