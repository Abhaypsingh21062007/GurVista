import './About.css';
import SectionHeader from '../components/ui/SectionHeader';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

const CONTENT = {
  en: {
    eyebrow: 'Our Story',
    title: 'About Gurvista',
    desc: "Born in the heart of India's sugarcane country.",
    whyEyebrow: 'Why Gurvista',
    whyHeading: 'A Marketplace Built on Trust and Terroir',
    p1: 'Muzaffarnagar district produces more jaggery per hectare than anywhere else in India. For generations, this wealth has passed through layers of middlemen, leaving producers underpaid and buyers uncertain of provenance.',
    p2: 'Gurvista was founded to close that gap — to give producers a direct, dignified market, and to give buyers the traceability they increasingly demand.',
    cta: 'Partner with Us',
    valuesHeading: 'What We Stand For',
    values: [
      { title: 'Direct Trade', desc: 'No commission layers. Producers set prices; buyers pay fair value.' },
      { title: 'Traceability', desc: 'Every listing is linked to a specific kolhu or mill in the region.' },
      { title: 'Heritage', desc: "We document and celebrate Western UP's centuries-old jaggery traditions." },
    ],
  },
  hi: {
    eyebrow: 'हमारी कहानी',
    title: 'गुरविस्ता के बारे में',
    desc: 'भारत के गन्ना क्षेत्र के केंद्र मुज़फ्फरनगर से जन्मा।',
    whyEyebrow: 'गुरविस्ता क्यों',
    whyHeading: 'भरोसे और मिट्टी की पहचान पर बना बाज़ार',
    p1: 'मुज़फ्फरनगर जिला देश के सबसे प्रमुख गुड़ उत्पादक क्षेत्रों में से एक है। पीढ़ियों से यह उपज कई बिचौलियों से होकर गुज़रती रही है, जिससे उत्पादकों को पूरा दाम और खरीदारों को सीधी पहचान नहीं मिल पाती थी।',
    p2: 'गुरविस्ता इसी दूरी को कम करने के लिए बना है — ताकि उत्पादकों को सीधा और सम्मानजनक बाज़ार मिले और खरीदारों को शुद्ध, भरोसेमंद उत्पाद मिल सके।',
    cta: 'हमसे जुड़ें',
    valuesHeading: 'हमारे मूल्य',
    values: [
      { title: 'सीधा व्यापार', desc: 'बिना अतिरिक्त कमीशन के। उत्पादक भाव तय करते हैं और खरीदार उचित मूल्य देते हैं।' },
      { title: 'स्रोत की पहचान', desc: 'हर लिस्टिंग सीधे क्षेत्र के कोल्हू या मिल से जुड़ी होती है।' },
      { title: 'विरासत', desc: 'हम पश्चिमी उत्तर प्रदेश की सदियों पुरानी गुड़ परंपरा को आगे बढ़ाते हैं।' },
    ],
  },
};

export default function About() {
  const { lang } = useLanguage();
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <div className="about-page">
      <div className="page-header section--green">
        <div className="container">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>{c.eyebrow}</span>
          <h1 className="page-title">{c.title}</h1>
          <p className="page-desc">{c.desc}</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container about-body">
          <div className="about-lead">
            <SectionHeader eyebrow={c.whyEyebrow} heading={c.whyHeading} />
            <p className="about-para">{c.p1}</p>
            <p className="about-para">{c.p2}</p>
            <Link to="/contact" className="btn btn--primary" style={{ marginTop: 'var(--space-md)', alignSelf: 'flex-start' }}>
              {c.cta}
            </Link>
          </div>

          <div className="about-values">
            <h3 className="about-values__heading">{c.valuesHeading}</h3>
            {c.values.map(({ title, desc }) => (
              <div key={title} className="about-value-item">
                <hr className="divider" style={{ margin: '0 0 var(--space-md)' }} />
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
