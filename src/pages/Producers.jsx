import './Producers.css';
import SectionHeader from '../components/ui/SectionHeader';
import Tag from '../components/ui/Tag';
import { useLanguage } from '../context/useLanguage';

const PRODUCERS_DATA = {
  en: {
    eyebrow: 'Sample Directory',
    title: 'Meet the Producers',
    desc: "Sample regional profiles representing kolhus and cane processing units across Muzaffarnagar's sugarcane belt.",
    secEyebrow: 'Indicative Profiles',
    secHeading: 'Craft Behind the Produce',
    sincePrefix: 'Sample profile · Producing since',
    items: [
      {
        id: 'ram-prakash-kolhu',
        name: 'Ram Prakash Kolhu',
        location: 'Shahpur, Muzaffarnagar',
        products: ['Chaku Gur', 'Laddu Gur'],
        since: '1978',
        bio: 'Traditional single-boil jaggery making using iron pans and local cane varieties.',
      },
      {
        id: 'devi-shakkar-udyog',
        name: 'Devi Shakkar Udyog',
        location: 'Budhana, Muzaffarnagar',
        products: ['Laddu Gur', 'Jaggery Powder'],
        since: '2001',
        bio: 'Family enterprise known for clarified jaggery rounds and sieved cane powder.',
      },
      {
        id: 'meerut-road-agri',
        name: 'Meerut Road Agri Co.',
        location: 'Jansath, Muzaffarnagar',
        products: ['Raw Bagasse', 'Dried Bagasse'],
        since: '1995',
        bio: 'Industrial-scale bagasse processor supplying paper mills and biomass plants across North India.',
      },
    ],
  },
  hi: {
    eyebrow: 'सैंपल निर्देशिका',
    title: 'उत्पादकों से मिलें',
    desc: 'मुज़फ्फरनगर के गन्ना क्षेत्र के कोल्हू और क्रशिंग इकाइयों की सैंपल क्षेत्रीय प्रोफ़ाइल।',
    secEyebrow: 'सांकेतिक परिचय',
    secHeading: 'उपज के पीछे की कारीगरी',
    sincePrefix: 'सैंपल प्रोफ़ाइल · वर्ष',
    items: [
      {
        id: 'ram-prakash-kolhu',
        name: 'राम प्रकाश कोल्हू',
        location: 'शाहपुर, मुज़फ्फरनगर',
        products: ['चाकू गुड़', 'लड्डू गुड़'],
        since: '1978',
        bio: 'पारंपरिक लोहे की कड़ाही में सिंगल-बॉयल प्रक्रिया से शुद्ध गुड़ उत्पादन।',
      },
      {
        id: 'devi-shakkar-udyog',
        name: 'देवी शक्कर उद्योग',
        location: 'बुढ़ाना, मुज़फ्फरनगर',
        products: ['लड्डू गुड़', 'गुड़ पाउडर'],
        since: '2001',
        bio: 'साफ लड्डू गुड़ और छना हुआ प्राकृतिक गुड़ पाउडर तैयार करने वाली पारिवारिक इकाई।',
      },
      {
        id: 'meerut-road-agri',
        name: 'मेरठ रोड एग्री कं.',
        location: 'जानसठ, मुज़फ्फरनगर',
        products: ['कच्ची खोई', 'सूखी खोई'],
        since: '1995',
        bio: 'उत्तर भारत की पेपर मिलों और बायोमास प्लांट्स को बड़े पैमाने पर बगास सप्लाई करने वाली इकाई।',
      },
    ],
  },
};

export default function Producers() {
  const { lang } = useLanguage();
  const c = PRODUCERS_DATA[lang] || PRODUCERS_DATA.en;

  return (
    <div className="producers-page">
      <div className="page-header section--green">
        <div className="container">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>{c.eyebrow}</span>
          <h1 className="page-title">{c.title}</h1>
          <p className="page-desc">{c.desc}</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container">
          <SectionHeader eyebrow={c.secEyebrow} heading={c.secHeading} />
          <div className="producers-list">
            {c.items.map((p) => (
              <article key={p.id} className="producer-card">
                <div className="producer-card__avatar" aria-hidden="true">
                  {p.name.charAt(0)}
                </div>
                <div className="producer-card__body">
                  <div className="producer-card__meta">
                    <h3 className="producer-card__name">{p.name}</h3>
                    <span className="producer-card__location">{p.location}</span>
                  </div>
                  <p className="producer-card__bio">{p.bio}</p>
                  <div className="producer-card__tags">
                    {p.products.map((prod) => (
                      <Tag key={prod} variant="outline">{prod}</Tag>
                    ))}
                  </div>
                  <span className="producer-card__since">{c.sincePrefix} {p.since}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
