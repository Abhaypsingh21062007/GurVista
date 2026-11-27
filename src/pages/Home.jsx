import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import './Home.css';

import heroImg from '../assets/images/jaggery-producer-2.jpg';
import jaggeryPanelImg from '../assets/images/jaggery-blocks-punjab.jpg';
import bagassePanelImg from '../assets/images/bagasse-loading.jpg';
import storyImg from '../assets/images/jaggery-boiling.jpg';
import sellerImg from '../assets/images/jaggery-producer-1.jpg';
import chakuGurImg from '../assets/images/khurpa-gur-dhep.jpg';
import ladduGurImg from '../assets/images/jaggery-block-closeup.jpg';
import jaggeryPowderImg from '../assets/images/jaggery-powder.jpg';
import bagasseCloseupImg from '../assets/images/bagasse-closeup.jpg';

const P = {
  hero: heroImg,
  jaggeryPanel: jaggeryPanelImg,
  bagassePanel: bagassePanelImg,
  story: storyImg,
  seller: sellerImg,
};

const HOME_PRODUCTS = {
  en: [
    {
      id: 'chaku-gur',
      name: 'Chaku Gur',
      nameHi: 'चाकू गुड़',
      desc: 'Soft, hand-cut slab jaggery — single-boil process for highest mineral retention.',
      price: '₹4,200',
      unit: '/ quintal',
      minOrder: '5 qtl min.',
      image: chakuGurImg,
      tag: 'Jaggery',
      featured: true,
    },
    {
      id: 'laddu-gur',
      name: 'Laddu Gur',
      nameHi: 'लड्डू गुड़',
      desc: 'Round mould-pressed, festival and confectionery grade.',
      price: '₹4,500',
      unit: '/ qtl',
      image: ladduGurImg,
      tag: 'Jaggery',
    },
    {
      id: 'khurpa-gur',
      name: 'Khurpa Gur',
      nameHi: 'खुरपा गुड़',
      desc: 'Hard-pressed traditional gur — extended shelf life.',
      price: '₹3,900',
      unit: '/ qtl',
      image: jaggeryPanelImg,
      tag: 'Jaggery',
    },
    {
      id: 'jaggery-powder',
      name: 'Jaggery Powder',
      nameHi: 'गुड़ पाउडर',
      desc: 'Fine-ground, free-flowing — ideal for retail and bakery use.',
      price: '₹5,200',
      unit: '/ qtl',
      image: jaggeryPowderImg,
      tag: 'Jaggery',
    },
    {
      id: 'raw-mill-bagasse',
      name: 'Sugarcane Bagasse',
      nameHi: 'खोई (बगास)',
      desc: 'Fibrous sugarcane residue for paper mills, biofuel and packaging.',
      price: '₹240',
      unit: '/ qtl',
      image: bagasseCloseupImg,
      tag: 'Bagasse',
    },
  ],
  hi: [
    {
      id: 'chaku-gur',
      name: 'चाकू गुड़',
      nameHi: 'Chaku Gur',
      desc: 'हाथ से कटी सुनहरी भेली — शुद्ध सिंगल-बॉयल प्रक्रिया से तैयार।',
      price: '₹4,200',
      unit: '/ क्विंटल',
      minOrder: 'न्यूनतम 5 क्विंटल',
      image: chakuGurImg,
      tag: 'गुड़',
      featured: true,
    },
    {
      id: 'laddu-gur',
      name: 'लड्डू गुड़',
      nameHi: 'Laddu Gur',
      desc: 'गोल सांचे में बना गुड़ — मिठाई और थोक व्यापार के लिए उपयुक्त।',
      price: '₹4,500',
      unit: '/ क्विंटल',
      image: ladduGurImg,
      tag: 'गुड़',
    },
    {
      id: 'khurpa-gur',
      name: 'खुरपा गुड़',
      nameHi: 'Khurpa Gur',
      desc: 'मजबूत बनावट वाला पारंपरिक गुड़ — लंबे समय तक सुरक्षित।',
      price: '₹3,900',
      unit: '/ क्विंटल',
      image: jaggeryPanelImg,
      tag: 'गुड़',
    },
    {
      id: 'jaggery-powder',
      name: 'गुड़ पाउडर (शक्कर)',
      nameHi: 'Jaggery Powder',
      desc: 'बारीक पिसा शुद्ध गुड़ पाउडर — खुदरा और बेकरी उपयोग के लिए।',
      price: '₹5,200',
      unit: '/ क्विंटल',
      image: jaggeryPowderImg,
      tag: 'गुड़',
    },
    {
      id: 'raw-mill-bagasse',
      name: 'गन्ने की खोई (बगास)',
      nameHi: 'Sugarcane Bagasse',
      desc: 'पेपर मिल, बॉयलर और बायोफ्यूल के लिए रेशेदार गन्ना खोई।',
      price: '₹240',
      unit: '/ क्विंटल',
      image: bagasseCloseupImg,
      tag: 'बगास',
    },
  ],
};

const WHY_POINTS_BY_LANG = {
  en: [
    {
      title: 'Direct from Producer',
      desc: 'No commission layers. Buy at fair farm-gate rates directly from kolhus and mills across Muzaffarnagar.',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Every listing shows per-quintal rate, minimum order quantity and origin clearly upfront.',
    },
    {
      title: 'Fewer Intermediaries',
      desc: 'From the kolhu to your warehouse with fewer handoffs — faster, simpler and traceable.',
    },
    {
      title: 'Sustainable Bagasse Utilisation',
      desc: 'Turning sugarcane fibre residue into industrial value — connecting mills directly with buyers.',
    },
  ],
  hi: [
    {
      title: 'सीधे उत्पादक से खरीद',
      desc: 'बिना अतिरिक्त बिचौलियों के। मुज़फ्फरनगर के कोल्हू और मिलों से सीधे सही भाव पर खरीदें।',
    },
    {
      title: 'पारदर्शी भाव और शर्तें',
      desc: 'हर लिस्टिंग पर प्रति क्विंटल भाव, न्यूनतम ऑर्डर मात्रा और स्थान की जानकारी स्पष्ट दिखती है।',
    },
    {
      title: 'कम बिचौलिए, सीधा व्यापार',
      desc: 'कोल्हू से सीधे आपके गोदाम तक — तेज़, सरल और भरोसेमंद आपूर्ति।',
    },
    {
      title: 'बगास (खोई) का सही औद्योगिक उपयोग',
      desc: 'गन्ने के रेशेदार अवशेष को सीधे पेपर मिल, बॉयलर और ईंधन खरीदारों तक पहुँचाना।',
    },
  ],
};

const HOW_STEPS_BY_LANG = {
  en: [
    {
      num: '01',
      title: 'Browse Products',
      desc: 'Filter by jaggery variety, bagasse grade, stock availability and price across Muzaffarnagar.',
    },
    {
      num: '02',
      title: 'Compare Suppliers',
      desc: 'Review producer locations, packaging formats, specifications and listed per-quintal rates.',
    },
    {
      num: '03',
      title: 'Order in Bulk',
      desc: 'Select quintal quantity, verify subtotal and proposed 2% fee, or submit a custom quote request.',
    },
    {
      num: '04',
      title: 'Track Delivery',
      desc: 'Follow each order stage from Order Placed and Quality Check through Dispatched and Delivered.',
    },
  ],
  hi: [
    {
      num: '01',
      title: 'उत्पाद खोजें',
      desc: 'मुज़फ्फरनगर के उत्पादकों से गुड़ की किस्म, बगास ग्रेड, भाव और मात्रा के अनुसार चुनें।',
    },
    {
      num: '02',
      title: 'सप्लायर की तुलना करें',
      desc: 'उत्पादक का स्थान, पैकेजिंग विवरण, गुणवत्ता और प्रति क्विंटल भाव एक साथ देखें।',
    },
    {
      num: '03',
      title: 'थोक ऑर्डर करें',
      desc: 'क्विंटल मात्रा चुनें, कुल राशि देखें या अपनी आवश्यकता के अनुसार कोटेशन मांगें।',
    },
    {
      num: '04',
      title: 'डिलीवरी ट्रैक करें',
      desc: 'ऑर्डर दर्ज होने से लेकर गुणवत्ता जांच, भुगतान और डिलीवरी तक हर चरण की स्थिति देखें।',
    },
  ],
};

export default function Home() {
  const { lang, t } = useLanguage();
  const products = HOME_PRODUCTS[lang] || HOME_PRODUCTS.en;
  const featured = products.find((p) => p.featured);
  const grid = products.filter((p) => !p.featured);
  const whyPoints = WHY_POINTS_BY_LANG[lang] || WHY_POINTS_BY_LANG.en;
  const howSteps = HOW_STEPS_BY_LANG[lang] || HOW_STEPS_BY_LANG.en;

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — Regional Agricultural Broadsheet Masthead
          ══════════════════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero">
        <div className="container">
          <div className="hero__dateline">
            <span className="hero__coords">
              {lang === 'hi'
                ? '29.47° उ., 77.71° पू. · मुज़फ्फरनगर मंडी क्षेत्र'
                : '29.47° N, 77.71° E · MUZAFFARNAGAR BELT'}
            </span>
            <span className="hero__rates">
              {lang === 'hi'
                ? 'सांकेतिक दर: चाकू गुड़ ₹4,200/क्विंटल · खोई ₹240/क्विंटल'
                : 'Indicative sample rates: Chaku Gur ₹4,200/qtl · Bagasse ₹240/qtl'}
            </span>
          </div>

          <div className="hero__grid">
            <div className="hero__text">
              <p className="hero__eyebrow">{t('home.heroEyebrow')}</p>
              <h1 className="hero__heading">
                {t('home.heroHeadingStart')}{' '}
                <em className="hero__heading-em">{t('home.heroHeadingEm')}</em>
                <br />
                {t('home.heroHeadingEnd')}
              </h1>
              <p className="hero__hindi" lang="hi">
                मुज़फ्फरनगर की मिठास, सीधे आप तक।
              </p>
              <p className="hero__desc">{t('home.heroDesc')}</p>
              <div className="hero__actions">
                <Link to="/products" className="btn btn--primary">
                  {t('home.exploreMarket')}
                </Link>
                <Link to="/register?role=seller" className="btn btn--ghost-green">
                  {t('home.becomeSeller')}
                </Link>
              </div>
            </div>

            <figure className="hero__visual">
              <div className="hero__frame">
                <img
                  src={P.hero}
                  alt="Traditional jaggery manufacturing — artisan workers stirring sugarcane juice in large iron pans over open fire"
                  className="hero__image"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <figcaption className="hero__caption">
                <span>
                  {lang === 'hi'
                    ? 'कोल्हू में गन्ने के रस की धीमी आंच पर उबाल प्रक्रिया'
                    : 'Open-pan sugarcane juice reduction at a regional kolhu'}
                </span>
                <span className="hero__photo-credit">{t('home.heroCredit')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          1. TWO TRADES. ONE ORIGIN.
          ══════════════════════════════════════════════════════ */}
      <section className="categories" aria-label="Product categories">
        <div className="container">
          <div className="categories__grid">
            {/* Jaggery Trade */}
            <article className="categories__panel categories__panel--jaggery">
              <div className="categories__img-frame">
                <img
                  src={P.jaggeryPanel}
                  alt="Traditional jaggery blocks from Muzaffarnagar producers — natural, unrefined cane sugar"
                  className="categories__panel-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="categories__panel-body">
                <div className="categories__panel-meta">
                  <span className="categories__panel-label">{t('nav.jaggery')}</span>
                  <span className="categories__panel-label-alt" lang={lang === 'hi' ? 'en' : 'hi'}>
                    {lang === 'hi' ? 'Jaggery · Retail & Wholesale' : 'गुड़ · थोक व खुदरा'}
                  </span>
                </div>
                <h2 className="categories__panel-heading">{t('home.catJaggeryHeading')}</h2>
                <p className="categories__panel-desc">{t('home.catJaggeryDesc')}</p>
                <Link to="/jaggery" className="btn btn--ghost-green">
                  {t('home.browseJaggery')}
                </Link>
              </div>
            </article>

            {/* Bagasse Supply */}
            <article className="categories__panel categories__panel--bagasse">
              <div className="categories__img-frame">
                <img
                  src={P.bagassePanel}
                  alt="Sugarcane bagasse stock pile and industrial loader"
                  className="categories__panel-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="categories__panel-body">
                <div className="categories__panel-meta">
                  <span className="categories__panel-label">{t('nav.bagasse')}</span>
                  <span className="categories__panel-label-alt" lang={lang === 'hi' ? 'en' : 'hi'}>
                    {lang === 'hi' ? 'Bagasse · Industrial B2B' : 'बगास · औद्योगिक सप्लाई'}
                  </span>
                </div>
                <h2 className="categories__panel-heading">{t('home.catBagasseHeading')}</h2>
                <p className="categories__panel-desc">{t('home.catBagasseDesc')}</p>
                <Link to="/bagasse" className="btn btn--ghost-ivory">
                  {t('home.browseBagasse')}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. EXPLORE OUR PRODUCTS — Editorial Catalogue + Mandi Sheet
          ══════════════════════════════════════════════════════ */}
      <section className="sec-products section--ivory" aria-labelledby="products-heading">
        <div className="container">
          <div className="sec-products__header">
            <div>
              <span className="eyebrow">{t('home.productsEyebrow')}</span>
              <h2 id="products-heading">{t('home.productsHeading')}</h2>
            </div>
            <span className="sec-products__cta-note">{t('home.wholesaleNote')}</span>
          </div>

          {/* Spotlight Listing */}
          <article className="product-spotlight">
            <div className="product-spotlight__media">
              <img
                src={featured.image}
                alt={`${featured.name} — ${featured.desc}`}
                className="product-spotlight__img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="product-spotlight__body">
              <div className="product-spotlight__meta">
                <span className="tag tag--brown">{featured.tag}</span>
                {featured.minOrder && (
                  <span className="product-min">{featured.minOrder}</span>
                )}
              </div>
              <div className="product-spotlight__titles">
                <h3 className="product-spotlight__name">{featured.name}</h3>
                <span className="product-spotlight__name-alt" lang={lang === 'hi' ? 'en' : 'hi'}>
                  {featured.nameHi}
                </span>
              </div>
              <p className="product-spotlight__desc">{featured.desc}</p>
              <div className="product-spotlight__foot">
                <div className="product-spotlight__price-wrap">
                  <span className="product-price">{featured.price}</span>
                  <span className="product-unit">{featured.unit}</span>
                </div>
                <Link to={`/products/${featured.id}`} className="btn btn--primary btn--sm">
                  {t('home.viewProduct')}
                </Link>
              </div>
            </div>
          </article>

          {/* Ruled 2x2 Trading Sheet */}
          <div className="products-sheet" role="list">
            {grid.map((p) => (
              <article key={p.id} className="product-row" role="listitem">
                <Link to={`/products/${p.id}`} className="product-row__thumb-wrap" aria-label={p.name}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="product-row__thumb"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
                <div className="product-row__content">
                  <div className="product-row__top">
                    <span
                      className={`tag ${
                        p.id === 'raw-mill-bagasse' ? 'tag--green' : 'tag--outline'
                      }`}
                    >
                      {p.tag}
                    </span>
                    <span className="product-row__price">
                      {p.price}
                      <span className="product-unit">{p.unit}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="product-row__name">
                      <Link to={`/products/${p.id}`}>{p.name}</Link>
                    </h3>
                    <span className="product-row__name-alt" lang={lang === 'hi' ? 'en' : 'hi'}>
                      {p.nameHi}
                    </span>
                  </div>
                  <p className="product-row__desc">{p.desc}</p>
                  <Link
                    to={`/products/${p.id}`}
                    className="product-row__link"
                    aria-label={`${t('home.viewProduct')}: ${p.name}`}
                  >
                    {t('home.viewProduct')} →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="sec-products__cta">
            <Link to="/products" className="btn btn--secondary">
              {t('home.viewAllProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. THE STORY OF MUZAFFARNAGAR
          ══════════════════════════════════════════════════════ */}
      <section className="sec-story" aria-labelledby="story-heading">
        <div className="sec-story__inner container">
          <figure className="sec-story__visual">
            <div className="sec-story__img-wrap">
              <img
                src={P.story}
                alt="Traditional jaggery boiling in Muzaffarnagar kolhu pan"
                className="sec-story__img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="sec-story__caption">
              {lang === 'hi'
                ? 'मुज़फ्फरनगर के पारंपरिक कोल्हू में कड़ाही से गुड़ पकाने का दृश्य'
                : 'Single-boil iron pan evaporation in Muzaffarnagar district'}
            </figcaption>
          </figure>

          <div className="sec-story__text">
            <span className="eyebrow">{t('home.storyEyebrow')}</span>
            <h2 id="story-heading">{t('home.storyHeading')}</h2>

            <p>{t('home.storyP1')}</p>
            <p>{t('home.storyP2')}</p>

            <blockquote className="sec-story__quote">{t('home.storyQuote')}</blockquote>

            <p>{t('home.storyP3')}</p>

            <div className="sec-story__foot">
              <span className="sec-story__source-text">{t('home.storyDisclaimer')}</span>
              <Link to="/about" className="btn btn--ghost-green btn--sm">
                {t('home.readStory')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. WHY GURVISTA — 2x2 Architectural Ledger
          ══════════════════════════════════════════════════════ */}
      <section className="sec-why section--green" aria-labelledby="why-heading">
        <div className="container">
          <div className="sec-why__header">
            <div>
              <span className="eyebrow">{t('home.whyEyebrow')}</span>
              <h2 id="why-heading">{t('home.whyHeading')}</h2>
            </div>
            <p className="sec-why__sub">{t('home.whySub')}</p>
          </div>

          <div className="sec-why__grid">
            {whyPoints.map(({ title, desc }, i) => (
              <div key={title} className="sec-why__cell">
                <span className="sec-why__item-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sec-why__item-title">{title}</h3>
                <p className="sec-why__item-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. HOW IT WORKS — Sequential Trade Process
          ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="sec-how section--ivory" aria-labelledby="how-heading">
        <div className="container">
          <div className="sec-how__header">
            <div>
              <span className="eyebrow">{t('home.howEyebrow')}</span>
              <h2 id="how-heading">{t('home.howHeading')}</h2>
            </div>
            <div className="sec-how__foot">
              <Link to="/products" className="btn btn--primary btn--sm">
                {t('home.startBrowsing')}
              </Link>
              <Link to="/contact" className="btn btn--ghost-green btn--sm">
                {t('home.sendEnquiry')}
              </Link>
            </div>
          </div>

          <div className="sec-how__steps" role="list">
            {howSteps.map(({ num, title, desc }) => (
              <div key={num} className="how-step" role="listitem">
                <div className="how-step__top">
                  <span className="how-step__num">{num}</span>
                </div>
                <h3 className="how-step__title">{title}</h3>
                <p className="how-step__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. BECOME A SELLER — Producer Prospectus
          ══════════════════════════════════════════════════════ */}
      <section className="sec-seller section--green" aria-labelledby="seller-heading">
        <div className="container sec-seller__inner">
          <div className="sec-seller__text">
            <span className="eyebrow">{t('home.sellerEyebrow')}</span>
            <h2 id="seller-heading">{t('home.sellerHeading')}</h2>
            <p className="sec-seller__desc">{t('home.sellerDesc')}</p>

            <div className="sec-seller__terms" aria-label="Seller benefits">
              <div className="sec-seller__term">
                <strong>0%</strong>
                <span>{t('home.sellerB1')}</span>
              </div>
              <div className="sec-seller__term">
                <strong>100%</strong>
                <span>{t('home.sellerB2')}</span>
              </div>
              <div className="sec-seller__term">
                <strong>{lang === 'hi' ? 'सीधा' : 'Direct'}</strong>
                <span>{t('home.sellerB3')}</span>
              </div>
            </div>

            <div className="sec-seller__actions">
              <Link to="/register?role=seller" className="btn btn--primary">
                {t('home.registerSeller')}
              </Link>
              <Link to="/about" className="btn btn--ghost-ivory">
                {t('home.learnMore')}
              </Link>
            </div>
          </div>

          <div className="sec-seller__visual">
            <img
              src={P.seller}
              alt="Sugarcane farmer in the fields of Muzaffarnagar district, Uttar Pradesh"
              className="sec-seller__img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </>
  );
}
