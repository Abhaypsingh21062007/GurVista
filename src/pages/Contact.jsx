import { useState } from 'react';
import './Contact.css';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useLanguage } from '../context/useLanguage';

const COPY = {
  en: {
    eyebrow: 'Get in Touch',
    title: 'Contact Gurvista',
    desc: "Looking to source jaggery or bagasse? Tell us your requirements and we'll help connect you.",
    formEyebrow: 'Buyer Enquiry',
    formHeading: 'Tell Us What You Need',
    nameLabel: 'Full Name *',
    namePh: 'Your name',
    emailLabel: 'Email Address *',
    emailPh: 'you@example.com',
    phoneLabel: 'Phone Number',
    phonePh: '+91 98765 43210',
    typeLabel: 'Buyer Type',
    selectPrompt: 'Select…',
    buyerTypes: ['Retail Shop', 'Wholesale Distributor', 'Industrial Buyer', 'Export', 'Other'],
    msgLabel: 'Your Requirement *',
    msgPh: 'Describe what you need — product type, volume, delivery location, timeline…',
    submitBtn: 'Send Enquiry',
    submittedMsg: 'Your demonstration enquiry has been recorded locally.',
    asideHeading: 'Location & Support',
    regionLabel: 'Region',
    regionValue: 'Muzaffarnagar, Uttar Pradesh',
    hoursLabel: 'Support Hours',
    hoursValue: 'Mon–Sat, 9 AM – 6 PM IST',
    noteLabel: 'Demonstration Notice',
    noteValue: 'This interface is for marketplace demonstration; no external messages are dispatched.',
  },
  hi: {
    eyebrow: 'संपर्क करें',
    title: 'गुरविस्ता से संपर्क करें',
    desc: 'गुड़ या खोई (बगास) खरीदना चाहते हैं? अपनी आवश्यकता बताएं।',
    formEyebrow: 'खरीदार पूछताछ',
    formHeading: 'अपनी आवश्यकता बताएं',
    nameLabel: 'पूरा नाम *',
    namePh: 'आपका नाम',
    emailLabel: 'ईमेल पता *',
    emailPh: 'you@example.com',
    phoneLabel: 'मोबाइल नंबर',
    phonePh: '+91 98765 43210',
    typeLabel: 'खरीदार का प्रकार',
    selectPrompt: 'चुनें…',
    buyerTypes: ['खुदरा दुकान', 'थोक व्यापारी', 'औद्योगिक खरीदार', 'निर्यात', 'अन्य'],
    msgLabel: 'आपकी आवश्यकता *',
    msgPh: 'बताएं आपको क्या चाहिए — उत्पाद, मात्रा, डिलीवरी स्थान और समय…',
    submitBtn: 'पूछताछ भेजें',
    submittedMsg: 'आपकी डेमो पूछताछ स्थानीय रूप से दर्ज कर ली गई है।',
    asideHeading: 'क्षेत्र और सहायता',
    regionLabel: 'क्षेत्र',
    regionValue: 'मुज़फ्फरनगर, उत्तर प्रदेश',
    hoursLabel: 'सहायता समय',
    hoursValue: 'सोम–शनि, सुबह 9 बजे – शाम 6 बजे',
    noteLabel: 'डेमो सूचना',
    noteValue: 'यह केवल प्रदर्शन के लिए है; कोई बाहरी संदेश नहीं भेजा जाता है।',
  },
};

export default function Contact() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.en;
  const [form, setForm] = useState({
    name: '', email: '', phone: '', buyerType: '', message: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSent(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.email.includes('@') || !form.message.trim()) {
      setError(
        lang === 'hi'
          ? 'कृपया अपना नाम, सही ईमेल पता और आवश्यकता लिखें।'
          : 'Please enter your name, a valid email address, and your requirement.'
      );
      setSent(false);
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="page-header section--green">
        <div className="container">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>{c.eyebrow}</span>
          <h1 className="page-title">{c.title}</h1>
          <p className="page-desc">{c.desc}</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container contact-body">
          {/* Form */}
          <div className="contact-form-wrap">
            <SectionHeader eyebrow={c.formEyebrow} heading={c.formHeading} />
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">{c.nameLabel}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder={c.namePh}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">{c.emailLabel}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder={c.emailPh}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">{c.phoneLabel}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder={c.phonePh}
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="buyerType">{c.typeLabel}</label>
                  <select
                    id="buyerType"
                    name="buyerType"
                    className="form-select"
                    value={form.buyerType}
                    onChange={handleChange}
                  >
                    <option value="">{c.selectPrompt}</option>
                    {c.buyerTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">{c.msgLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder={c.msgPh}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="contact-error" role="alert">{error}</p>}
              {sent && <p className="contact-sent" role="status">{c.submittedMsg}</p>}

              <Button type="submit" variant="primary">{c.submitBtn}</Button>
            </form>
          </div>

          {/* Info aside */}
          <aside className="contact-info">
            <h3 className="contact-info__heading">{c.asideHeading}</h3>
            <dl className="contact-info__list">
              <div className="contact-info__item">
                <dt className="contact-info__label">{c.regionLabel}</dt>
                <dd className="contact-info__value">{c.regionValue}</dd>
              </div>
              <div className="contact-info__item">
                <dt className="contact-info__label">{c.hoursLabel}</dt>
                <dd className="contact-info__value">{c.hoursValue}</dd>
              </div>
              <div className="contact-info__item">
                <dt className="contact-info__label">{c.noteLabel}</dt>
                <dd className="contact-info__value">{c.noteValue}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </div>
  );
}
